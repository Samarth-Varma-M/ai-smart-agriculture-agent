from app.models.schemas import FarmProfile, SoilTelemetry, EnvironmentResult
from app.services.weather_service import get_weather_forecast

async def process_environment(farm_profile: FarmProfile, telemetry: SoilTelemetry) -> EnvironmentResult:
    weather_data = await get_weather_forecast(farm_profile.location_lat, farm_profile.location_lon)
    
    rainfall_6h = weather_data.get("rainfall_mm_6h", 0.0)
    rainfall_24h = weather_data.get("rainfall_mm_24h", 0.0)
    avg_temp = weather_data.get("avg_temperature_c", 25.0)
    avg_wind = weather_data.get("avg_wind_speed_kmh", 10.0)
    
    soil_water_deficit = 100.0 - telemetry.moisture_percent
    
    spray_window_feasible = (avg_wind < 15.0) and (rainfall_6h < 2.0)
    
    weather_summary = f"Temp: {avg_temp:.1f}C, Rain(24h): {rainfall_24h:.1f}mm, Wind: {avg_wind:.1f}km/h"
    
    return EnvironmentResult(
        soil_water_deficit=soil_water_deficit,
        spray_window_feasible=spray_window_feasible,
        weather_summary=weather_summary,
        rainfall_mm_24h=rainfall_24h,
        rainfall_mm_6h=rainfall_6h,
        wind_speed_kmh=avg_wind
    )
