"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Agent, Deal, Interview, Questionnaire, Activity,Question, Answer, Option
from api.utils import generate_sitemap, APIException
from datetime import datetime
import random
from sqlalchemy import desc, asc
from flask_jwt_simple import (
    jwt_required, create_jwt, get_jwt_identity
)


api = Blueprint('api', __name__)


# Provide a method to create access tokens. The create_jwt()
# function is used to actually generate the token
@api.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        raise APIException('Invalid payload')

    params = request.get_json()
    email = params.get('email', None)
    password = params.get('password', None)

    if not email:
        raise APIException('Missing email')
    if not password:
        raise APIException('Missing password')

    agent = Agent.query.filter_by(email=email,password=password).first()
    if agent is None:
        raise APIException('Invalid email or password', 401)

    # Identity can be any data that is json serializable
    print("agent.role", agent.role.value)
    ret = {
        'token': create_jwt(identity={ "id": agent.id, "role": agent.role.value }),
        'agent': agent.serialize()
    }
    return jsonify(ret), 200


@api.route('/deal/<int:deal_id>/interview/<int:interview_id>', methods=['PUT'])
@jwt_required
def edit_interview(deal_id,interview_id):
    agent = get_jwt_identity()
    body = request.get_json()

   
    interview1 = Interview.query.filter_by(id=interview_id)
    if agent["role"] != "admin": 
        interview1 = interview1.filter_by(agent_id=agent["id"])

    interview1 = interview1.first()
    if interview1 is None:
        raise APIException('No interview with that id')
    if "status" in body:
        interview1.status = body['status']
        interview1.ending_time = datetime.utcnow()
        new_deal_activity(deal_id,"Interview updated to " + body['status'])
    if "scheduled_time" in body:
        interview1.status = "DRAFT"
        interview1.scheduled_time = body['scheduled_time']
        new_deal_activity(deal_id,"Interview reschedule to" + body['scheduled_time'])
    db.session.commit() 
    return interview1.serialize(), 200

@api.route('/questionnaire/<int:id>', methods=['GET'])
@jwt_required
def get_questionnaire(id):
    agent = get_jwt_identity()
    questionnaire1 = Questionnaire.query.get(id)

    if agent["role"] != "admin" and questionnaire1.interview.agent_id != agent["id"]: 
        raise APIException('You don\'t have access to this questionnaire', status_code=403)
    
    if questionnaire1 is None:
        raise APIException('questionnaire not found', status_code=404)
    return jsonify(questionnaire1.serialize()), 200

@api.route('/deals', methods=['GET'])
@jwt_required
def get_deals():
    deals = Deal.query

    agent = get_jwt_identity()

    if agent["role"] != "admin": 
        deals = deals.filter_by(agent_id=agent["id"])

    status = request.args.get('status')
    if status is not None and status != "" and status != "undefined":
        if status == 'PENDING':
            deals = deals.filter_by(status=status)
        if status == 'APPROVED':
            deals = deals.filter_by(status=status)
        if status == 'REJECTED':
            deals = deals.filter_by(status=status)
        if status == 'NOT_INTERESTED':
            deals = deals.filter_by(status=status)

    # score = request.args.get('score')
    # if score is not None and score != "":
    #     deals = deals.filter_by(score=score)

    sort = request.args.get('sort')
    if sort is not None and sort != "" and sort != "undefined":
        order = 'desc'
        _order = request.args.get('order')
        if _order is not None and _order != "":
            order = _order

        if order == 'desc':
            deals = deals.order_by(desc(sort))
        else:
            deals = deals.order_by(asc(sort))
    
    deals = deals.all()
    

    if deals is None:
        raise APIException('contacs not found', status_code=404)
    all_deals = list(map(lambda x: x.serialize(), deals))
    return jsonify(all_deals), 200


@api.route('/deal/<int:deal_id>/interview', methods=['POST'])
@jwt_required
def create_interview(deal_id):
    body = request.get_json()
    
    existing_interview = Interview.query.filter_by(deal_id=deal_id, questionnaire_id=body['questionnaire_id']).first()
    if existing_interview is not None:
        raise APIException('There is already an interview with this id for this deal')


    interview1 = Interview()
    interview1.agent_id = body['agent_id']
    interview1.questionnaire_id = body['questionnaire_id']
    interview1.deal_id = deal_id
    if "scheduled_time" not in body:
        interview1.starting_time = datetime.utcnow()
        interview1.status = 'DRAFT'
        new_deal_activity(deal_id,"Interview rescheduled for"+ body['scheduled_time'])
    else:
        new_deal_activity(deal_id,"Interview re-scheduled")
        interview1.status = 'POSTPONED'
        interview1.scheduled_time = body['scheduled_time']
    db.session.add(interview1)
    db.session.commit()

    


    questionnaire = Questionnaire.query.get(body['questionnaire_id'])

    return interview1.serialize_big(), 200
    
@api.route('/interview/answer', methods=['POST']) 
@jwt_required 
def create_answer():
    body = request.get_json()
    agent = get_jwt_identity()

    interview = Interview.query.get(body['interview_id'])
    if interview is None:
        raise APIException('Interview with that id')

    if agent["role"] != "admin" and interview.agent_id != agent["id"]:
        raise APIException('You don\'t have access to this interview', 403)

    option = Option.query.get(body['option_id'])
    if option is None:
        raise APIException('No option with that id')

    answer1 = Answer(
        comments=body['comments'] if "comments" in body else None, 
        interview_id=body['interview_id'], 
        option_id=body['option_id'], 
        value=option.value
    )

    db.session.add(answer1)
    db.session.commit()
    update_interview_score(body['interview_id'])
    return answer1.serialize(), 200

@api.route('/interview/answer/<int:answer_id>', methods=['PUT']) 
@jwt_required
def modify_answer(answer_id):
    body = request.get_json()
    agent = get_jwt_identity()
    option = Option.query.get(body['option_id'])

    if option is None:
        raise APIException('No option with that id')

    answer1 = Answer.query.get(answer_id)
    if answer1 is None:
        raise APIException('No answer with that id')

    interview = Interview.query.get(answer1.interview_id)
    if interview is None:
        raise APIException('Interview with that id')

    if agent["role"] != "admin" and interview.agent_id != agent["id"]:
        raise APIException('You don\'t have access to this interview', 403)

    if "comments" in body:
        answer1.comments = body['comments']
    if "option_id" in body:
        answer1.option_id  = body['option_id']
    if "value" in body:
        answer1.value = option.value
    db.session.commit()
    update_interview_score(answer1.interview_id)
    return answer1.serialize(), 200

def update_interview_score(interview_id):
    all_answers = Answer.query.filter_by(interview_id=interview_id) 
    total_score=0
    for answer in all_answers:
        total_score = total_score + answer.option.value
    target_interview = Interview.query.get(interview_id)
    target_interview.score_total = total_score
    db.session.commit()
    
def new_deal_activity(deal_id,details,_type="SYSTEM"):
    activity = Activity(
        details = details,
        activity_type = _type.upper(),
        deal_id = deal_id
    )
    db.session.add(activity)
    db.session.commit()

@api.route('/interviews', methods=['GET'])
@jwt_required
def get_interviews():
    agent = get_jwt_identity()
    interviews = Interview.query.all()
    
    if agent["role"] != "admin": 
        interviews = interviews.filter_by(agent_id=agent["id"])
    
    all_interviews = list(map(lambda x: x.serialize(), interviews))
    return jsonify(all_interviews), 200


@api.route('/agent/<int:agent_id>/deal/next', methods=['GET'])
@jwt_required
def get_next_deal(agent_id):

    agent = get_jwt_identity()
    if agent["role"] != "admin" and agent["id"] != agent_id:
        raise APIException("You don't have access to this agent deails")

    deal = Deal.query.filter_by(status="PENDING",agent_id=agent_id).order_by('contacted_at').order_by('deal_attemps').first()
    if deal is None:
        raise APIException('No deal available')
    
    return deal.serialize(), 200

@api.route('/agent/<int:agent_id>/interview/next', methods=['GET'])
@jwt_required
def get_next_interview(agent_id):

    agent = get_jwt_identity()
    if agent["role"] != "admin" and agent["id"] != agent_id:
        raise APIException("You don't have access to this agent details")

    all_interviews = Interview.query.filter_by(agent_id=agent_id)
    status = request.args.get('status')
    if status is not None and status != "":
        all_interviews = all_interviews.filter_by(status=status)
    else:
        status = ""

    all_interviews = all_interviews.order_by('starting_time')
    
    if all_interviews.count() == 0:
        raise APIException(f'No {status} interviews')
   

    return jsonify([a.serialize() for a in all_interviews]), 200
    

@api.route('/interview/<int:interview_id>', methods=['GET'])
@jwt_required
def get_interview(interview_id):
    interview1 = Interview.query.get(interview_id)
    if interview1 is None:
        raise APIException('No interview with that id')

    agent = get_jwt_identity()
    if agent["role"] != "admin" and agent["id"] != interview1.agent_id:
        raise APIException("You don't have access to this interview")

    return interview1.serialize_big(), 200

@api.route('/deal/<int:deal_id>', methods=['GET', 'PUT'])
@jwt_required
def get_single_deal(deal_id):
    deal1 = Deal.query.get(deal_id)

    if deal1 is None:
        raise APIException('No deal with that id')

    agent = get_jwt_identity()
    if agent["role"] != "admin" and agent["id"] != deal1.agent_id:
        raise APIException("You don't have access to this deal")

    if request.method == 'GET':
        return deal1.serialize(), 200
    
    if request.method == 'PUT':
        body = request.get_json()


        if "status" in body:
            deal1.status = body['status']
        if "approved_status" in body:    
            deal1.approved_status = body['approved_status']
        if "communication_status" in body: 
            deal1.communication_status = body['communication_status']
            deal1.contacted_at = datetime.utcnow()
            deal1.deal_attemps = deal1.deal_attemps + 1

        if "agent_id" in body: 
            deal1.agent_id = body['agent_id']
        db.session.commit() 

        if "note" in body:
            new_deal_activity(deal_id,body['note'], "NOTE")
        else:
            new_deal_activity(deal_id,"deal modified")

        return deal1.serialize(), 200

@api.route('/activity/<int:activity_id>', methods=['DELETE'])
# @jwt_required
def handle_activity(activity_id):
    body = request.get_json()
    activity1 = Activity.query.get(activity_id)
    activities = Activity.query.filter_by(deal_id=body['deal_id'])
    if activity1 is None:
        raise APIException('No activity found')
    db.session.delete(activity1)
    db.session.commit()

    all_activities = list(map(lambda x: x.serialize(), activities))

    return jsonify(all_activities), 200


    
    






    

    


    

