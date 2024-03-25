import os
from flask import current_app as app, jsonify, request, make_response


@app.route("/test")
def testing():
    data = {'sentence': 'this is a testing message'}
    return jsonify(data), 200