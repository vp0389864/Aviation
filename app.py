from flask import Flask, render_template, request, jsonify
import os
from api.fetch_flight_api import fetch_flight_data
from analysis.analyze import analyze_flight_data

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# API endpoint for fetching processed flight data
# Update the get_data function
@app.route('/api/data', methods=['GET'])
def get_data():
    origin = request.args.get('origin', 'SYD')
    destination = request.args.get('destination', '')
    start_date = request.args.get('start', None)
    
    if not start_date:
        return jsonify({'error': 'Missing start date'}), 400
    
    # We're ignoring end_date since AviationStack free tier only supports current date
    flights, api_debug = fetch_flight_data(origin, destination, start_date, debug=True)
    print('AviationStack API debug:', api_debug)  # Updated comment to match API
    analysis = analyze_flight_data(flights)
    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True)