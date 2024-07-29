from flask import Blueprint, request, jsonify
from controllers.exercise_controller import calculate_curl, calculate_pushup

exercise_routes = Blueprint('exercise_routes', __name__)

@exercise_routes.route('/exercise/curl', methods=['POST'])
def curl():
    data = request.json
    return calculate_curl(data)

@exercise_routes.route('/exercise/pushup', methods=['POST'])
def pushup():
    data = request.json
    return calculate_pushup(data)
    