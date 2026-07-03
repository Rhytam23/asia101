from fastapi import FastAPI
from dotenv import load_dotenv
import os
import requests

# Load environment variables
load_dotenv('.env.local')

METEOSOURCE_API_KEY = os.getenv("VITE_METEOSOURCE_API_KEY")
AGROMONITORING_API_KEY = os.getenv("VITE_AGROMONITORING_API_KEY")

# Initialize the FastAPI app
app = FastAPI(title="Mekong Smart Land API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Mekong Smart Land API! Go to /docs to see the interactive documentation."}

@app.get("/weather")
def get_weather(lat: float, lon: float):
    """
    Fetch live weather data from Meteosource for a specific latitude and longitude.
    """
    if not METEOSOURCE_API_KEY:
        return {"error": "Meteosource API key is missing!"}
        
    url = f"https://www.meteosource.com/api/v1/free/point?lat={lat}&lon={lon}&sections=current&key={METEOSOURCE_API_KEY}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

@app.get("/soil")
def get_soil(polyid: str):
    """
    Fetch live soil data from Agromonitoring for a specific polygon ID.
    (Note: You must create a polygon first using their API to get a polyid).
    """
    if not AGROMONITORING_API_KEY:
        return {"error": "Agromonitoring API key is missing!"}
        
    url = f"http://api.agromonitoring.com/agro/1.0/soil?polyid={polyid}&appid={AGROMONITORING_API_KEY}"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": str(e)}

# To run this server locally:
# uvicorn main:app --reload
