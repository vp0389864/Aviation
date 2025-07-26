import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

# Change to use AviationStack API key
API_KEY = os.getenv('API_KEY')  # Using the API_KEY from .env file
BASE_URL = 'http://api.aviationstack.com/v1/flights'

def fetch_flight_data(origin, destination, start_date, end_date=None, debug=False):
    """
    Fetch flight data from AviationStack API for the current date only.
    Returns: list of dicts with flight info.
    If debug=True, also returns a list of raw API responses for debugging.
    """
    results = []
    debug_log = []
    
    try:
        # AviationStack free tier only supports current date
        # Ignore start_date and end_date parameters
        
        # Construct AviationStack API URL
        params = {
            'access_key': API_KEY,
            'dep_iata': origin
        }
        
        # Add destination filter if provided
        if destination:
            params['arr_iata'] = destination
            
        print(f"Fetching flights from {origin} to {destination if destination else 'all destinations'}")
        
        # Make request to AviationStack API
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Add debugging to see raw API response
        print(f"Raw API Response: {data}")
        debug_log.append({
            'url': BASE_URL, 
            'params': params, 
            'response': data
        })
        
        # Check if we have data and if there are any flights
        if 'data' not in data:
            print("'data' field not found in API response")
            print(f"Response keys: {data.keys()}")
            if 'error' in data:
                print(f"API Error: {data['error']}")
            # Check for specific AviationStack error messages
            if 'success' in data and not data['success']:
                print(f"API Error: Success is false. Error details: {data.get('error', {})}")
                # Check for common issues like invalid access key
                if 'code' in data.get('error', {}):
                    error_code = data['error']['code']
                    print(f"Error code: {error_code}")
                    if error_code == 101:
                        print("Invalid API access key. Please check your API_KEY in .env file.")
                    elif error_code == 104:
                        print("Usage limit reached. Free tier has limited requests.")
            if debug:
                return [], debug_log
            return [], None
            
        if not data['data']:
            print("No flights found in API response")
            if debug:
                return [], debug_log
            return [], None
            
        print(f"API Response: {len(data['data'])} flights found")
        
        # Parse AviationStack API response structure
        for item in data['data']:
            # Extract flight information
            flight_date = item.get('flight_date', datetime.now().strftime('%Y-%m-%d'))
            
            # Create a standardized flight record
            results.append({
                'route': f"{item.get('departure', {}).get('iata', '')}-{item.get('arrival', {}).get('iata', '')}",
                'date_time': flight_date,
                'airline': item.get('airline', {}).get('name', ''),
                'flight_number': item.get('flight', {}).get('number', ''),
                'status': item.get('flight_status', ''),
                'departure_time': item.get('departure', {}).get('scheduled', ''),
                'arrival_time': item.get('arrival', {}).get('scheduled', '')
            })
        
        print(f"Total flights found: {len(results)}")
        
        # If no flights found, inform the user but don't add mock data
        if len(results) == 0:
            print("No flights found in the API response. Please try a different route or check API key.")
        
        if debug:
            return results, debug_log
        return results, None
        
    except Exception as e:
        print(f"AviationStack API fetch error: {e}")
        if debug:
            return [], debug_log
        return []