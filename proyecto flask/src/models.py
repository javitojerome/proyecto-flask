from flask_sqlalchemy import SQLAlchemy
import datetime
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    email = db.Column(db.String(250), nullable=False)
    password = db.Column(db.String(250), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
        }

class Purchase(db.Model):
    __tablename__ = 'purchase'
    id = db.Column(db.Integer, primary_key=True)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    total_price = db.Column(db.Integer, nullable=False)
    person_email = db.Column(db.String(250), db.ForeignKey('user.email'))
    address = db.Column(db.String(250), nullable=False)
    person = db.relationship(User)

    
    def serialize(self):
        return {
            "id": self.id,
            "created_date": self.created_date,
            "total_price": self.total_price,
            "person_email": self.person_email,
            "address": self.address,
        }

    


