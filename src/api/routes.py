"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Agent, Deal, Interview, Questionnaire, Activity,Question, Answer, Option
from api.utils import generate_sitemap, APIException
from datetime import datetime
from flask import jsonify


api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }

    return jsonify(response_body), 200

@api.route('/deal/<int:deal_id>/interview/<int:interview_id>', methods=['PUT'])
def edit_interview(deal_id,interview_id):
    body = request.get_json()

   
    interview1 = Interview.query.get(interview_id)
    print('test1')
    if interview1 is None:
        raise APIException('No interview with that id')
    print('test2')
    if "status" in body:
        interview1.status = body['status']
        interview1.ending_time = datetime.utcnow()
        new_deal_activity(deal_id,"Interview updated to " + body['status'])
    print('test3')
    if "scheduled_time" in body:
        interview1.status = "DRAFT"
        interview1.scheduled_time = body['scheduled_time']
        new_deal_activity(deal_id,"Interview reschedule to" + body['scheduled_time'])
    print('test4')  
    db.session.commit() 
    print('test5')
    return interview1.serialize(), 200


@api.route('/questionnaire/<int:id>', methods=['GET'])
def get_questionnaire(id):

    questionnaire1 = Questionnaire.query.get(id)
    
    if questionnaire1 is None:
        raise APIException('questionnaire not found', status_code=404)
    return jsonify(questionnaire1.serialize()), 200

@api.route('/deals', methods=['GET'])
def get_deals():
    deals = Deal.query

    # score = request.args.get('score')
    # if score is not None and score != "":
    #     deals = deals.filter_by(score=score)

    sort = request.args.get('sort')
    if sort is not None and sort != "" and sort != "undefined":
        deals = deals.order_by(sort)
    deals = deals.all()
    

    if deals is None:
        raise APIException('contacs not found', status_code=404)
    all_deals = list(map(lambda x: x.serialize(), deals))
    return jsonify(all_deals), 200



@api.route('/deal/<int:deal_id>/interview', methods=['POST'])
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
        new_deal_activity(deal_id,"Interview started")
        interview1.status = 'DRAFT'
        interview1.scheduled_time = body['scheduled_time']
    db.session.add(interview1)
    db.session.commit()

    


    questionnaire = Questionnaire.query.get(body['questionnaire_id'])

    return interview1.serialize_big(), 200
    
        
@api.route('/interview//answer', methods=['POST']) 
def create_answer():
    body = request.get_json()

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

@api.route('/interview/answer/<int:answer_id>', methods=['PUT', 'GET']) 
def modify_answer(answer_id):
    body = request.get_json()
    option = Option.query.get(body['option_id'])

    if option is None:
        raise APIException('No option with that id')

    answer1 = Answer.query.get(answer_id)
    if answer1 is None:
        raise APIException('No answer with that id')

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
    
def new_deal_activity(deal_id,details,_type="note"):
    activity = Activity(
        details = details,
        activity_type = _type,
        deal_id = deal_id
    )
    db.session.add(activity)
    db.session.commit()


@api.route('/interviews', methods=['GET'])
def get_interviews():
    interviews = Interview.query.all()
    all_interviews = list(map(lambda x: x.serialize(), interviews))
    return jsonify(all_interviews), 200



@api.route('/agent/<int:agent_id>/deal/next', methods=['GET'])
def get_next_deal(agent_id):
    deal = Deal.query.filter_by(interview_status="PENDING",agent_id=agent_id).order_by('contacted_at').order_by('deal_attemps').first()
    if deal is None:
        raise APIException('No deal available')
    
    return deal.serialize(), 200

@api.route('/agent/<int:agent_id>/interview/next', methods=['GET'])
def get_next_interview(agent_id):

    all_interviews = Interview.query.filter_by(agent_id=agent_id)
    status = request.args.get('status')
    if status is not None and status != "":
        all_interviews = all_interviews.filter_by(status=status)

    all_interviews = all_interviews.order_by('starting_time')
    
    if all_interviews.count() == 0:
        raise APIException('No pending interviews')

    

    return jsonify([a.serialize() for a in all_interviews]), 200

@api.route('/interview/<int:interview_id>', methods=['GET'])
def get_interview(interview_id):
    interview1 = Interview.query.get(interview_id)
    if interview1 is None:
        raise APIException('No interview with that id')
    return interview1.serialize_big(), 200


@api.route('/deal/<int:deal_id>', methods=['GET', 'PUT'])
def get_single_deal(deal_id):
    body = request.get_json()
    deal1 = Deal.query.get(deal_id)

    if request.method == 'GET':
        if deal1 is None:
            raise APIException('No deal with that id')
        return deal1.serialize(), 200
    
    if request.method == 'PUT':
        if deal1 is None:
            raise APIException('No deal with that id')
        if "first_name" in body:
            deal1.first_name = body['first_name']
        if "last_name" in body:
            deal1.last_name = body['last_name']
        if "interview_status" in body:
            deal1.interview_status = body['interview_status']
        if "approved_status" in body:    
            deal1.approved_status = body['approved_status']
        if "communication_status" in body: 
            deal1.communication_status = body['communication_status']
        if "contacted_at" in body: 
            deal1.contacted_at = body['contacted_at']
        if "deal_attemps" in body: 
            deal1.deal_attemps = body['deal_attemps']
        if "agent_id" in body: 
            deal1.agent_id = body['agent_id']
        db.session.commit() 

        new_deal_activity(deal_id,"deal modified")
        return deal1.serialize(), 200





    

    


    

