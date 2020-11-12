from flask_sqlalchemy import SQLAlchemy

from datetime import datetime



db = SQLAlchemy()

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    interviews = db.relationship('Interview', backref='agent', lazy=True)
    contacts = db.relationship('Contact', backref='agent', lazy=True)
    time_zone = db.Column(db.String(120), unique=True, default='America/New_York')
   
    
    def __repr__(self):
        return '<Agent %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "time_zone": self.time_zone
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    interview_status = db.Column(db.String(80), unique=False, nullable=False, default="PENDING")
    approved_status = db.Column(db.String(80), unique=False, nullable=True)
    communication_status = db.Column(db.String(80), unique=False, nullable=True)
    interview = db.relationship('Interview', backref='contact', lazy=True)
    activities = db.relationship('Activity', backref='contact', lazy=True)
    contacted_at = db.Column(db.DateTime, nullable=True, default=None)
    contact_attemps = db.Column(db.Integer, default=0)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=True, default=None)
    
    

    def __repr__(self):
        return '<Contact %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "interview_status": self.interview_status,
            "approved_status": self.approved_status,
            "activities": [a.serialize() for a in self.activities],
            "communication_status": self.communication_status,
            "contact_attemps": self.contact_attemps,
            "contacted_at": self.contacted_at
        }

    def serialize_small(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "interview_status": self.interview_status,
            "approved_status": self.approved_status,
            "communication_status": self.communication_status,
            "contact_attemps": self.contact_attemps,
            "contacted_at": self.contacted_at
        }


class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    details = db.Column(db.String(350), unique=False, nullable=False)
    label = db.Column(db.String(100), unique=False, nullable=True)
    activity_type = db.Column(db.String(80), unique=False, nullable=False) #'note','event'
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Contact %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "details": self.details,
            "label": self.label,
            "activity_type": self.activity_type,
            "contact_id": self.contact_id,
            "created_at": self.created_at,
        }

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    starting_time = db.Column(db.DateTime)
    ending_time = db.Column(db.DateTime)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'), nullable=False )
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=False)
    answers = db.relationship('Answer', backref='interview', lazy=True)
    status = db.Column(db.String(80), unique=False, nullable=False)
    score_total = db.Column(db.Integer, unique=False, nullable=True)
    scheduled_time = db.Column(db.DateTime(timezone=True), nullable=True)
    

    def __repr__(self):
        return '<Interview %r>' % self.id
    
    def serialize(self):
        return {
            "id": self.id,
            "starting_time": self.starting_time,
            "ending_time": self.ending_time,
            "agent_id": self.agent_id,
            "questionnaire_id": self.questionnaire_id,
            "contact_id": self.contact_id,
            "contact": self.contact.serialize_small(),
            "status": self.status,
            "score_total": self.score_total,
            "scheduled_time": self.scheduled_time
        }

    def serialize_big(self):
        questionnaire = Questionnaire.query.get(self.questionnaire_id)
        return {
            "id": self.id,
            "starting_time": self.starting_time,
            "ending_time": self.ending_time,
            "agent_id": self.agent_id,
            "questionnaire_id": self.questionnaire_id,
            "contact_id": self.contact_id,
            "status": self.status,
            "score_total": self.score_total,
            'questionnaire': questionnaire.serialize(),
            'answers': [a.serialize() for a in self.answers],
            "scheduled_time": self.scheduled_time
        }


class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    interview = db.relationship('Interview', backref='questionnaire', lazy=True)
    questions = db.relationship('Question', backref='questionnaire', lazy=True)
    
    
    def __repr__(self):
        return '<questionnaire %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "questions": [q.serialize() for q in self.questions]
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'), nullable=False)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview.id'), nullable=True)
    options = db.relationship('Option',backref='question', lazy=True)
    

    def __repr__(self):
        return '<Question %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "questionnaire_id": self.questionnaire_id,
            "options": [o.serialize() for o in self.options],
        }

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comments = db.Column(db.String(120), unique=False, nullable=False)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('option.id'), nullable=False)
    value = db.Column(db.Integer, unique=False, nullable=False)
    

    def __repr__(self):
        return '<Answer %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "comments": self.comments,
            'interview_id': self.interview_id,
            'option_id': self.option_id,
            'value': self.value
        }

class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    value = db.Column(db.Integer, unique=False, nullable=False)
    answer = db.relationship('Answer', backref='option', lazy=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    

    def __repr__(self):
        return '<Option %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "value": self.value,
            'question_id': self.question_id
        }