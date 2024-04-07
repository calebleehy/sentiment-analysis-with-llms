import os
from flask import current_app as app, jsonify, request, make_response
import json


@app.route("/reviewData", methods=["GET"])
def reviewData():
    try:
        with open('../data/data.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "reviewData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500