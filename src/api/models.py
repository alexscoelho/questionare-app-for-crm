import enum
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime



db = SQLAlchemy()

class AgentRoles(enum.Enum):
    AGENT = 'AGENT'
    ADMIN = 'ADMIN'
    READ_ONLY = 'READ_ONLY'
class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    role = db.Column(db.Enum(AgentRoles), unique=False, nullable=False, default=AgentRoles.AGENT.value)
    interviews = db.relationship('Interview', backref='agent', lazy=True)
    deals = db.relationship('Deal', backref='agent', lazy=True)
    time_zone = db.Column(db.String(120), unique=False, default='America/New_York')
   
    
    def __repr__(self):
        return '<Agent %r>' % self.email

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role.value,
            "time_zone": self.time_zone
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    deals = db.relationship('Deal', backref='contact', lazy=True)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
    email = db.Column(db.String(80), unique=False, nullable=False)
    phone = db.Column(db.String(80), unique=False, nullable=False)
    city = db.Column(db.String(80), unique=False, nullable=False)

    def __repr__(self):
        return f"{self.first_name} {self.last_name}: {str(self.id)}"

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "deals": [a.serialize() for a in self.deals],
            "created_at": self.created_at,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
        }

    def serialize_small(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "created_at": self.created_at,
            "created_at": self.created_at,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
        }


class DealStatus(enum.Enum):
    PENDING = 'PENDING'
    APPROVED = 'APPROVED'
    REJECTED = 'REJECTED'
    NOT_INTERESTED = 'NOT_INTERESTED'
class CommunicationStatus(enum.Enum):
    NO_ANSWER = 'NO_ANSWER'
    NOT_AVAILABLE = 'NOT_AVAILABLE'
    COMPLETE = 'COMPLETE'
class Deal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    status = db.Column(db.Enum(DealStatus), unique=False, nullable=True, default=DealStatus.PENDING.value)
    communication_status = db.Column(db.Enum(CommunicationStatus), unique=False, nullable=True, default=None)
    interview = db.relationship('Interview', backref='deal', lazy=True)
    activities = db.relationship('Activity', backref='deal', lazy=True)
    contacted_at = db.Column(db.DateTime(timezone=True), nullable=True, default=None)
    deal_attemps = db.Column(db.Integer, default=0)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=True, default=None)
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=True, default=None)
    
    

    def __repr__(self):
        return '<Deal %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "contact": self.contact.serialize_small(),
            "name": self.name,
            "status": self.status.value,
            "activities": [a.serialize() for a in self.activities],
            "communication_status": self.communication_status.value if self.communication_status is not None else None,
            "deal_attemps": self.deal_attemps,
            "contacted_at": self.contacted_at,
            "contact_id": self.contact_id,
            "interview": [a.serialize() for a in self.interview],
            
        }

    def serialize_small(self):
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status.value,
            "communication_status": self.communication_status.value if self.communication_status is not None else None,
            "deal_attemps": self.deal_attemps,
            "contacted_at": self.contacted_at,
            "contact_id": self.contact_id,
        }

class ActivityTypes(enum.Enum):
    NOTE = 'NOTE'
    SYSTEM = 'SYSTEM'
class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    details = db.Column(db.String(350), unique=False, nullable=False)
    label = db.Column(db.String(100), unique=False, nullable=True)
    activity_type = db.Column(db.Enum(ActivityTypes), unique=False, nullable=False, default=ActivityTypes.NOTE.value) #'note','event'
    deal_id = db.Column(db.Integer, db.ForeignKey('deal.id'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)

    def __repr__(self):
        return '<Deal %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "details": self.details,
            "label": self.label,
            "activity_type": self.activity_type.value,
            "deal_id": self.deal_id,
            "created_at": self.created_at,
        }

class InterviewStatus(enum.Enum):
    PENDING = 'PENDING'
    DRAFT = 'DRAFT'
    POSTPONED = 'POSTPONED'
    COMPLETED = 'COMPLETED'
class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    starting_time = db.Column(db.DateTime(timezone=True))
    ending_time = db.Column(db.DateTime(timezone=True))
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'), nullable=False )
    deal_id = db.Column(db.Integer, db.ForeignKey('deal.id'), nullable=False)
    answers = db.relationship('Answer', backref='interview', lazy=True)
    status = db.Column(db.Enum(InterviewStatus), unique=False, nullable=False, default=InterviewStatus.PENDING.value)
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
            "deal_id": self.deal_id,
            "deal": self.deal.serialize_small(),
            "status": self.status.value,
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
            "deal_id": self.deal_id,
            "status": self.status.value,
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
    comments = db.Column(db.String(120), unique=False, nullable=True, default=None)
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