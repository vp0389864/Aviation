# analyze.py
"""
Data processing and insights generation for airline booking data.
"""
import pandas as pd
from collections import Counter

def analyze_flight_data(flight_data):
    """
    Analyze flight data and return insights (top routes, price trends, etc.).
    Returns: dict with analysis results.
    """
    if not flight_data:
        return {
            'top_routes': [],
            'price_trends': [],
            'demand_spikes': [],
            'high_demand_periods': [],
            'table_data': []
        }
    df = pd.DataFrame(flight_data)
    # Top 5 popular routes
    top_routes = df['route'].value_counts().head(5).reset_index().values.tolist()
    # Check if any data exists in the DataFrame
    print(f"DataFrame columns: {df.columns}")
    print(f"DataFrame sample: {df.head()}")
    
    # Average price trends over time - handle missing price field
    if 'price' in df.columns and df['price'].notnull().any():
        price_trends = df.groupby('date_time')['price'].mean().reset_index().values.tolist()
    else:
        # If price is missing, use count of flights per date as a proxy for demand
        print("Price field missing, using flight count per date instead")
        price_trends = df.groupby('date_time').size().reset_index(name='count').values.tolist()
    
    # Demand spikes by date
    demand_spikes = df['date_time'].value_counts().sort_values(ascending=False).head(5).reset_index().values.tolist()
    # High-demand periods (e.g., weekends)
    if 'date_time' in df.columns:
        df['weekday'] = pd.to_datetime(df['date_time'], errors='coerce').dt.day_name()
        high_demand_periods = df['weekday'].value_counts().head(3).reset_index().values.tolist()
    else:
        high_demand_periods = []
    # Table data (raw)
    table_data = df.to_dict(orient='records')
    return {
        'top_routes': top_routes,
        'price_trends': price_trends,
        'demand_spikes': demand_spikes,
        'high_demand_periods': high_demand_periods,
        'table_data': table_data
    }