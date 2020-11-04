from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

db = SQLAlchemy()

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    interview = db.relationship('Interview', backref='agent', lazy=True)
    
    def __repr__(self):
        return '<Agent %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    interview_status = db.Column(db.Enum('pending','interviewed'))
    approved_status = db.Column(db.Enum('admited','discarted','postponed','dropped'))
    communication_status = db.Column(db.Enum('no answer', 'answered but not available', 'not interested any more'))
    interview = db.relationship('Interview', backref='contact', lazy=True)

    def __repr__(self):
        return '<Contact %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "interview_status": self.interview_status,
            "approved_status": self.approved_status
        }

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    starting_time = db.Column(db.DateTime)
    ending_time = db.Column(db.DateTime)
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'), nullable=False )
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'), nullable=False)
    answer = db.relationship('Answer', backref='interview', lazy=True)

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
        }

class Questionnaire(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    score_total = db.Column(db.Integer, unique=False, nullable=True)
    interview = db.relationship('Interview', backref='questionnaire', lazy=True)
    questions = db.relationship('Question', backref='questionnaire', lazy=True)
    
    def __repr__(self):
        return '<questionnaire %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "score_total": self.score_total,
            "questions": [q.serialize() for q in self.questions]
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'), nullable=False)
    options = db.relationship('Option',backref='question', lazy=True)
    answer = db.relationship('Answer',backref='question', lazy=True)


    def __repr__(self):
        return '<Question %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "questionnaire_id": self.questionnaire_id,
            "options": [o.serialize() for o in self.options],
            "answer": self.answer
        }

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comments = db.Column(db.String(120), unique=False, nullable=False)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview.id'), nullable=False)
    option_id = db.Column(db.Integer, db.ForeignKey('option.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)

    def __repr__(self):
        return '<Answer %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "comments": self.comments,
            'interview_id': self.interview_id,
            'option_id': self.option_id
        }

class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    value = db.Column(db.String(120), unique=False, nullable=False)
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