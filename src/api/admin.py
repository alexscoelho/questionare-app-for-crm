  
import os
from flask_admin import Admin
from .models import db, Agent, Deal, Contact, Interview, Questionnaire, Question, Answer, Option, Activity
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Agent, db.session))
    admin.add_view(ModelView(Deal, db.session))
    admin.add_view(ModelView(Interview, db.session))
    admin.add_view(ModelView(Questionnaire, db.session))
    admin.add_view(ModelView(Question, db.session))
    admin.add_view(ModelView(Answer, db.session))
    admin.add_view(ModelView(Option, db.session))
    admin.add_view(ModelView(Activity, db.session))
    admin.add_view(ModelView(Contact, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))