# Airline Booking Market Demand Web App

## Overview
A Python-based web application to help hostel owners in Australian cities analyze airline booking demand trends. The app fetches real-time flight data from the AviationStack API, processes it for insights, and presents results in an interactive dashboard.

## Tech Stack
- Backend: Python + Flask
- Web Scraping: requests, BeautifulSoup, Selenium (not used; only real API data)
- API Integration: AviationStack
- Data Processing: pandas, numpy
- Frontend: HTML + Tailwind CSS
- Charts: Plotly.js (preferred)

## Project Structure
```
Airline Booking Web App/
├── app.py                   # Flask app
├── templates/
│   └── index.html           # Tailwind frontend page
├── static/
│   └── js/
│       └── charts.js        # Chart rendering
├── scraping/
│   └── scrape_flights.py    # (Unused, for future scraping logic)
├── api/
│   └── fetch_flight_api.py  # API data integration
├── analysis/
│   └── analyze.py           # Data processing/insights
├── requirements.txt
└── README.md
```

## Setup
1. Clone the repo
2. Install dependencies: `pip install -r requirements.txt`
3. Set up API keys in a `.env` file (see below)
4. Run the app: `python app.py`

## .env Example
```
API_KEY=your_aviationstack_api_key
```

## Usage
- Visit `http://localhost:5000` in your browser.
- Select a city and date range, then click Search.
- The app will fetch and aggregate real-time flight data from the AviationStack API for the selected range.
- If no data is available for your query, the dashboard will show "No data".

## Notes
- The app is now fully real-time and does **not** use any static or demo data.
- Data freshness and completeness depend on the AviationStack API and your API key limits.
- For best results, use a paid API key for higher limits and more data.

## Features
- Fetches and analyzes real-time flight data
- Interactive charts and tables
- Filter by city and date range
- Responsive UI with Tailwind CSS

## License
MIT 