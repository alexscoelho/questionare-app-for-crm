"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Agent, Contact, Interview, Questionnaire, Question, Answer, Option
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

@api.route('/contact/<int:id>/interview/agent/<int:agent_id>/questionnaire/<int:questionnaire_id>', methods=['POST', 'PUT'])
def handle_interview(id,agent_id,questionnaire_id):
    body = request.get_json()
    interview1 = Interview()
    
    if request.method == 'POST':
        
        interview1.agent_id = agent_id
        interview1.questionnaire_id = questionnaire_id
        interview1.contact_id = id
        interview1.status = 'DRAFT'
        interview1.starting_time = datetime.now()
        db.session.add(interview1)
        db.session.commit()
        return "ok", 200
    
    if request.method == 'PUT':
        interview1.status = body['status']
        interview1.ending_time = datetime.now()
        return "ok", 200
        
@api.route('/interview/answer', methods=['POST', 'GET']) 
def create_answer():
    body = request.get_json()

    answer1 = Answer(comments=body['comments'], interview_id=body['interview_id'], option_id=body['interview_id'], question_id=body['question_id'])
    db.session.add(answer1)
    db.session.commit()
    return "ok", 200

@api.route('/interview/answer/<int:answer_id>', methods=['PUT', 'GET']) 
def modify_answer(answer_id):
    body = request.get_json()
    answer1 = Answer.query.get(answer_id)
    answer1.comments = body['comments']
    answer1.interview_id = body['interview_id']
    answer1.option_id  = body['option_id']
    db.session.commit()
    return "ok", 200

@api.route('/interviews', methods=['GET'])
def get_interviews():
    interviews = Interview.query.all()
    all_interviews = list(map(lambda x: x.serialize(), interviews))
    return jsonify(all_interviews), 200


    

    


    

