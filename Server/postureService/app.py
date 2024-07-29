from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.exercise_routes import exercise_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(exercise_routes, url_prefix='/postureservice')

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Exercise Tracker API'})

@app.route('/exercise/<exercise>', methods=['POST'])
def handle_exercise(exercise):
    data = request.json
    image_data = data['image']
    # Process image_data and compute angle
    # For example purposes, we're returning a dummy angle
    angle = 90  # Replace this with actual angle calculation
    return jsonify({'angle': angle})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
