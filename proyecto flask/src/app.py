"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for
from flask_migrate import Migrate
from flask_swagger import swagger
from flask_cors import CORS
from utils import APIException, generate_sitemap
from admin import setup_admin
from models import db, User,Purchase
import datetime

app = Flask(__name__)
app.url_map.strict_slashes = False


app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///C:/Users/javito/OneDrive/Desktop/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    return generate_sitemap(app)

@app.route('/user', methods=['GET', 'POST'])
def handle_hello():
    if(request.method=='GET'):
        all_people = User.query.all()
        all_people = list(map(lambda x: x.serialize(), all_people))
        response_body = {
            "all_users": all_people
        }

        return jsonify(response_body), 200
    else:
        """
        { 
        "name":"",
        "email":"",
        "password": ""}
        """
        body = request.get_json()
        if body is None:
            return "The request body is null", 400
        if 'name' not in body:
            return 'You need to specify the name', 400
        if 'email' not in body:
            return 'You need to specify the email', 400
        if 'password' not in body:
            return 'You need to specify the password', 400

        new_user = User(name = body["name"], email =  body["email"],password=body["password"])
        db.session.add(new_user)
        db.session.commit()
        response_body = {
            "data":body,
            "mensaje":"usuario agregado"
        }
        return jsonify(response_body), 200


@app.route('/purchase', methods=['GET', 'POST'])
def handle_cart():
    if(request.method=='GET'):
        all_purchases = Purchase.query.all()
        all_purchases = list(map(lambda x: x.serialize(), all_purchases))
        response_body = {
            "all_purchases": all_purchases
        }

        return jsonify(response_body), 200
    else:
        """
        {
            "id": self.id,
            "created_date": self.created_date,
            "total_price": self.total_price,
            "person_email": self.person_email,
            "address": self.address,
        }
        """
        body = request.get_json()
        if body is None:
            return "The request body is null", 200
        if 'total_price' not in body:
            return 'You need to specify the total_price', 200
        if 'person_email' not in body:
            return 'You need to specify the email', 200
        if 'address' not in body:
            return 'You need to specify the address', 200

        new_purchase = Purchase(total_price=body['total_price'],person_email=body['person_email'],address=body['address'])
        db.session.add(new_purchase)
        db.session.commit()
        response_body = {
            "data":body,
            "mensaje":"compra almacenada"
        }
        return jsonify(response_body), 200


@app.route('/login', methods=['POST'])
def login():
    if(request.method=='POST'):
        
        """
        { 
        "email":"",
        "password": ""}
        """
        body = request.get_json()
        if body is None:
            return "The request body is null", 400
        if 'email' not in body:
            return 'You need to specify the email', 400
        if 'password' not in body:
            return 'You need to specify the password', 400

        user = User.query.filter_by(email = body["email"]).first()

        if(user):
            if(user.password != body["password"]):
                response_body = {
                    "mensaje":"incorrecto"
                }
                return jsonify(response_body), 400   
            response_body = {
                "data":body,
                "mensaje":"ok"
            }
            return jsonify(response_body), 200
        else:
            return jsonify({
               
                "mensaje":"incorrecto"
            }), 400




# this only runs if `$ python src/app.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=PORT, debug=False)
