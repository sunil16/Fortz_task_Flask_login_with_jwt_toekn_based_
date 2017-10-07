from flask import Flask, render_template, request
from werkzeug import secure_filename
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp
import json

app = Flask(__name__)

@app.route('/')
def index():
   return render_template('index.html')


@app.route('/home')
@jwt_required()
def home():
   return json.dumps({'success':True})



class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'rahul', '12345'),
    User(2, 'sunil', '123456789'),
    User(3, 'ram', '123'),
]


username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

@app.route('/protected')
@jwt_required()
def protected():
    return '%s' % current_identity


app.config['SECRET_KEY'] = 'super-secret'
jwt = JWT(app, authenticate, identity)

if __name__ == '__main__':
   app.run(debug = True)
