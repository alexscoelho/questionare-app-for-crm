"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Agent, Contact, Interview, Questionnaire, Question, Answer, Option
from api.utils import generate_sitemap, APIException

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