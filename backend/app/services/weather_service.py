import httpx
from typing import Dict, Any

async def get_weather_forecast(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetches 5-day weather data from Open-Meteo API.
    Extracts key metrics for the next 6h and 24h.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&forecast_days=5"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            
            hourly = data.get("hourly", {})
            precipitation = hourly.get("precipitation", [])
            wind_speed = hourly.get("wind_speed_10m", [])
            temp = hourly.get("temperature_2m", [])
            
            rainfall_6h = sum(precipitation[:6]) if len(precipitation) >= 6 else 0.0
            rainfall_24h = sum(precipitation[:24]) if len(precipitation) >= 24 else 0.0
            avg_wind_speed = sum(wind_speed[:24]) / 24 if len(wind_speed) >= 24 else 10.0
            avg_temp = sum(temp[:24]) / 24 if len(temp) >= 24 else 25.0
            
            return {
                "rainfall_mm_6h": rainfall_6h,
                "rainfall_mm_24h": rainfall_24h,
                "avg_wind_speed_kmh": avg_wind_speed,
                "avg_temperature_c": avg_temp,
                "raw_data": data
            }
    except Exception as e:
        print(f"Weather API failed: {e}")
        return {
            "rainfall_mm_6h": 0.0,
            "rainfall_mm_24h": 0.0,
            "avg_wind_speed_kmh": 10.0,
            "avg_temperature_c": 25.0,
            "raw_data": {}
        }
