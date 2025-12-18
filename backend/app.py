from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pickle
import numpy as np
import os
import datetime
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from bson.objectid import ObjectId

app = Flask(__name__)
# Enable CORS for rights, allowing requests from the frontend
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_secret_key_here')

# MongoDB Connection
# Use MONGO_URI from environment variable if available, else use local
try:
    mongo_uri = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    client = MongoClient(mongo_uri)
    db = client['disease_predictor_db']
    predictions_collection = db['predictions']
    users_collection = db['users']
    print("Connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    db = None

# Load the ML Model
model = None
model_path = os.path.join(os.path.dirname(__file__), 'models', 'model.pkl')

try:
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully")
except FileNotFoundError:
    print(f"Error: Model file not found at {model_path}. Please run train_model.py first.")
except Exception as e:
    print(f"Error loading model: {e}")

# Token Verification Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1] # Bearer <token>
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/')
def home():
    return "Backend is running!", 200

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    if not email or not username or not password:
        return jsonify({"error": "Email, username, and password are required"}), 400
        
    if users_collection.find_one({'email': email}):
        return jsonify({"error": "Email already registered"}), 400
        
    hashed_password = generate_password_hash(password)
    users_collection.insert_one({
        'email': email, 
        'username': username, 
        'password': hashed_password
    })
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    user = users_collection.find_one({'email': email})
    
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({
            "token": token,
            "email": email,
            "username": user.get('username', 'User'),
            "message": "Login successful"
        })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/predict', methods=['POST'])
@token_required
def predict(current_user):
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    
    try:
        features = [
            int(data.get('Fever', 0)),
            int(data.get('Cough', 0)),
            int(data.get('Fatigue', 0)),
            int(data.get('Diff_Breathing', 0)),
            int(data.get('Headache', 0)),
            int(data.get('Sore_Throat', 0)),
            int(data.get('Body_Aches', 0)),
            int(data.get('Runny_Nose', 0))
        ]
        
        final_features = [np.array(features)]
        
        prediction = model.predict(final_features)
        output = prediction[0]
        
        if db is not None:
            record = {
                "user_id": str(current_user['_id']),
                "input": data,
                "prediction": output,
                "timestamp": datetime.datetime.utcnow()
            }
            predictions_collection.insert_one(record)

        return jsonify({
            "prediction": output, 
            "features": data
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

import hashlib
# ... imports ...

@app.route('/api/predict-image', methods=['POST'])
@token_required
def predict_image(current_user):
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        # Read file content to generate hash for consistent prediction
        file_content = file.read()
        file_hash = hashlib.md5(file_content).hexdigest()
        
        # Mock Prediction Logic - Deterministic based on file content
        possible_infections = [
            'Eczema', 
            'Melanoma', 
            'Psoriasis', 
            'Fungal Infection', 
            'Acne', 
            'Rosacea',
            'Hives',
            'Shingles',
            'Cold Sore',
            'Warts',
            'Healthy Skin'
        ]
        
        # Use hash to select consistent index
        hash_int = int(file_hash, 16)
        prediction_index = hash_int % len(possible_infections)
        prediction = possible_infections[prediction_index]
        
        # Save to DB
        if db is not None:
            record = {
                "user_id": str(current_user['_id']),
                "type": "image_prediction",
                "filename": file.filename,
                "prediction": prediction,
                "timestamp": datetime.datetime.utcnow()
            }
            predictions_collection.insert_one(record)

        return jsonify({
            'prediction': prediction,
            'message': 'Image analyzed successfully'
        })

@app.route('/api/history', methods=['GET'])
@token_required
def get_history(current_user):
    try:
        if db is None:
             return jsonify([]), 200

        user_id = str(current_user['_id'])
        cursor = predictions_collection.find({'user_id': user_id}).sort('timestamp', -1)
        
        history = []
        for doc in cursor:
            record = {
                'id': str(doc['_id']),
                'timestamp': doc['timestamp'].isoformat(),
                'type': doc.get('type', 'symptoms'), # 'symptoms' or 'image_prediction'
                'prediction': doc['prediction']
            }
            if record['type'] == 'symptoms':
                record['input'] = doc.get('input', {})
            elif record['type'] == 'image_prediction':
                record['filename'] = doc.get('filename', '')
                
            history.append(record)
            
        return jsonify(history)
    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ensure upload folder exists if we were saving
    # os.makedirs(os.path.join(app.root_path, 'uploads'), exist_ok=True)
    app.run(debug=True, port=5000)
