from flask import jsonify
from utils.angle_calculator import calculate_angle

def calculate_curl(data):
    shoulder = data['shoulder']
    elbow = data['elbow']
    wrist = data['wrist']
    angle = calculate_angle(shoulder, elbow, wrist)
    return jsonify({'angle': angle})

def calculate_pushup(data):
    shoulder = data['shoulder']
    elbow = data['elbow']
    wrist = data['wrist']
    angle = calculate_angle(shoulder, elbow, wrist)
    # Implement push-up specific logic here if needed
    return jsonify({'angle': angle})
