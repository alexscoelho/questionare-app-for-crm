from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

db = SQLAlchemy()

class Agent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    interview = db.relationship('Interview')
    
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
    approved_status = db.Column(db.Enum('admited','discarted','postponed'))
    interview = db.relationship('Interview')

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
    agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'))
    questionare_id = db.Column(db.Integer, db.ForeignKey('questionare.id'))
    contact_id = db.Column(db.Integer, db.ForeignKey('contact.id'))
    answer = db.relationship('Answer')

    def __repr__(self):
        return '<Interview %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "starting_time": self.starting_time,
            "ending_time": self.ending_time,
            "agent_id": self.agent_id,
            "questionare_id": self.questionare_id,
            "contact_id": self.contact_id,
        }

class Questionare(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    description = db.Column(db.String(120), unique=False, nullable=False)
    score_total = db.Column(db.Integer, unique=False, nullable=False)
    interview = db.relationship('Interview')
    question = db.relationship('Question')

    def __repr__(self):
        return '<Questionare %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "score": self.score
        }
    
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    score_min = db.Column(db.Integer, unique=False, nullable=False)
    score_max = db.Column(db.Integer, unique=False, nullable=False)
    questionare_id = db.Column(db.Integer, db.ForeignKey('questionare.id'))
    option = db.relationship('Option')

    def __repr__(self):
        return '<Question %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "score_min": self.score_min,
            "score_max": self.score_max
        }

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comments = db.Column(db.String(120), unique=False, nullable=False)
    interview_id = db.Column(db.Integer, db.ForeignKey('interview.id'))
    option_id = db.Column(db.Integer, db.ForeignKey('option.id'))

    def __repr__(self):
        return '<Answer %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "comments": self.comments,
        }

class Option(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=False)
    value = db.Column(db.String(120), unique=False, nullable=False)
    answer = db.relationship('Answer')
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))

    def __repr__(self):
        return '<Option %r>' % self.id

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "value": self.value
        }