from app.models.schemas import FarmProfile, MarketResult
from app.services.market_service import get_market_trends

async def process_market(farm_profile: FarmProfile) -> MarketResult:
    market_data = await get_market_trends(farm_profile.crop_variety)
    
    maturity_status = "MATURE"
    
    return MarketResult(
        harvest_urgency_index=market_data.get("harvest_urgency_index", 50.0),
        projected_price_trend=market_data.get("projected_price_trend", "STABLE"),
        crop_maturity_status=maturity_status
    )
