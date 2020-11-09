"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Agent, Contact, Interview, Questionnaire, Activity,Question, Answer, Option
from api.utils import generate_sitemap, APIException
from datetime import datetime

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }

    return jsonify(response_body), 200

@api.route('/questionnaire/<int:id>', methods=['GET'])
def get_questionnaire(id):

    questionnaire1 = Questionnaire.query.get(id)
    
    if questionnaire1 is None:
        raise APIException('questionnaire not found', status_code=404)
    return jsonify(questionnaire1.serialize()), 200

@api.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query

    # score = request.args.get('score')
    # if score is not None and score != "":
    #     contacts = contacts.filter_by(score=score)

    sort = request.args.get('sort')
    if sort is not None and sort != "" and sort != "undefined":
        contacts = contacts.order_by(sort)
    contacts = contacts.all()
    

    if contacts is None:
        raise APIException('contacs not found', status_code=404)
    all_contacts = list(map(lambda x: x.serialize(), contacts))
    return jsonify(all_contacts), 200

@api.route('/contact/<int:contact_id>/interview/<int:interview_id>', methods=['PUT', 'GET'])
def edit_interview(contact_id,interview_id):
    body = request.get_json()

   
    interview1 = Interview.query.get(interview_id)

    if interview1 is None:
        raise APIException('No interview with that id')

    interview1.status = body['status']
    interview1.ending_time = datetime.now()
    db.session.commit() 

    new_contact_activity(contact_id,"interview updated to " + body['status'])


    return interview1.serialize(), 200


@api.route('/contact/<int:contact_id>/interview', methods=['POST'])
def create_interview(contact_id):
    body = request.get_json()
    
    existing_interview = Interview.query.filter_by(contact_id=contact_id, questionnaire_id=body['questionnaire_id']).first()
    if existing_interview is not None:
        raise APIException('There is already an interview with this id for this contact')
    interview1 = Interview()
    interview1.agent_id = body['agent_id']
    interview1.questionnaire_id = body['questionnaire_id']
    interview1.contact_id = contact_id
    interview1.status = 'DRAFT'
    interview1.starting_time = datetime.now()
    db.session.add(interview1)
    db.session.commit()

    new_contact_activity(contact_id,"new interview created")

    questionnaire = Questionnaire.query.get(body['questionnaire_id'])

    





    return interview1.serialize_big(), 200
    
        
@api.route('/interview/answer', methods=['POST', 'GET']) 
def create_answer():
    body = request.get_json()

    option = Option.query.get(body['option_id'])

    if option is None:
        raise APIException('No option with that id')
    
    answer1 = Answer(
        comments=body['comments'], 
        interview_id=body['interview_id'], 
        option_id=body['option_id'], 
        value=option.value
        
    )

    db.session.add(answer1)
    db.session.commit()
    update_interview_score(body['interview_id'])
    return "ok", 200

@api.route('/interview/answer/<int:answer_id>', methods=['PUT', 'GET']) 
def modify_answer(answer_id):
    body = request.get_json()
    option = Option.query.get(body['option_id'])

    if option is None:
        raise APIException('No option with that id')

    answer1 = Answer.query.get(answer_id)
    if answer1 is None:
        raise APIException('No answer with that id')

    answer1.comments = body['comments']
    answer1.interview_id = body['interview_id']
    answer1.option_id  = body['option_id']
    answer1.value = option.value
    db.session.commit()
    update_interview_score(body['interview_id'])
    return answer1.serialize(), 200

def update_interview_score(interview_id):
    all_answers = Answer.query.filter_by(interview_id=interview_id) 
    total_score=0
    for answer in all_answers:
        total_score = total_score + answer.option.value
    target_interview = Interview.query.get(interview_id)
    target_interview.score_total = total_score
    db.session.commit()
    
def new_contact_activity(contact_id,details,_type="note"):
    activity = Activity(
        details = details,
        activity_type = _type,
        contact_id = contact_id
    )
    db.session.add(activity)
    db.session.commit()


@api.route('/interviews', methods=['GET'])
def get_interviews():
    interviews = Interview.query.all()
    all_interviews = list(map(lambda x: x.serialize(), interviews))
    return jsonify(all_interviews), 200

@api.route('/agent/<int:agent_id>/contact/next', methods=['GET'])
def get_next_contact(agent_id):
    contact = Contact.query.filter_by(interview_status="pending",agent_id=agent_id).order_by('contacted_at').order_by('contact_attemps').first()
    if contact is None:
        raise APIException('No contact available')
    return contact.serialize(), 200

@api.route('/interview/<int:interview_id>', methods=['GET'])
def get_interview(interview_id):
    interview1 = Interview.query.get(interview_id)
    if interview1 is None:
        raise APIException('No interview with that id')
    return interview1.serialize_big(), 200

@api.route('/contact/<int:contact_id>', methods=['GET', 'PUT'])
def get_single_contact(contact_id):
    body = request.get_json()
    contact1 = Contact.query.get(contact_id)

    if request.method == 'GET':
        if contact1 is None:
            raise APIException('No contact with that id')
        return contact1.serialize(), 200
    
    if request.method == 'PUT':
        if contact1 is None:
            raise APIException('No contact with that id')
        if "first_name" in body:
            contact1.first_name = body['first_name']
        if "last_name" in body:
            contact1.last_name = body['last_name']
        if "interview_status" in body:
            contact1.interview_status = body['interview_status']
        if "approved_status" in body:    
            contact1.approved_status = body['approved_status']
        if "communication_status" in body: 
            contact1.communication_status = body['communication_status']
        if "contacted_at" in body: 
            contact1.contacted_at = body['contacted_at']
        if "contact_attemps" in body: 
            contact1.contact_attemps = body['contact_attemps']
        if "agent_id" in body: 
            contact1.agent_id = body['agent_id']
        db.session.commit() 

        new_contact_activity(contact_id,"contact modified")
        return contact1.serialize(), 200





    

    


    

