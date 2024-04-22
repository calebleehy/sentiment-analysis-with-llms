import os
from flask import current_app as app, jsonify, request, make_response
import json


@app.route("/reviewData", methods=["GET"])
def reviewData():
    try:
        with open('./data/full.json', 'r') as file:
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

@app.route("/bankNps", methods=["GET"])
def bankNpsData():
    try:
        with open('./data/bank_nps.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "bankNpsData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/bankServiceFreq", methods=["GET"])
def bankServiceFreq():
    try:
        with open('./data/bank_serv_freq.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "bankServiceFreqData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/bankIssueFreq", methods=["GET"])
def bankIssueFreq():
    try:
        with open('./data/bank_serv_issue_freq.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "bankIssueFreqData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/monthNps", methods=["GET"])
def monthNps():
    try:
        with open('./data/month_nps.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "monthNpsData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/servIssueRec", methods=["GET"])
def servIssueFreq():
    try:
        with open('./data/serv_issue_rec.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "servIssueRecData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/whatifBankNps", methods=["GET"])
def whatifBank():
    try:
        with open('./data/whatif_bank_nps.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            data = {
                "status" : "success",
                "wahtifBankNpsData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500

@app.route("/whatifRecNps", methods=["GET"])
def whatifRec():
    try:
        with open('./data/whatif_rec_nps.json', 'r') as file:
            # Load JSON data from the file
            json_data = json.load(file)
            print(json_data)
            data = {
                "status" : "success",
                "whatifRecNpsData" : json_data
            }
            return jsonify(data), 200
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format in file'}), 500




