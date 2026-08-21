import random
from typing import Dict, Any

async def get_market_trends(crop_variety: str) -> Dict[str, Any]:
    """
    Mock APMC commodity price trends.
    """
    trends = ["PEAKING", "DROPPING", "STABLE", "RISING"]
    trend = random.choice(trends)
    
    if trend == "PEAKING":
        urgency = random.uniform(80.0, 100.0)
    elif trend == "DROPPING":
        urgency = random.uniform(10.0, 40.0)
    elif trend == "RISING":
        urgency = random.uniform(50.0, 80.0)
    else:
        urgency = random.uniform(40.0, 60.0)
        
    return {
        "crop_variety": crop_variety,
        "projected_price_trend": trend,
        "harvest_urgency_index": round(urgency, 2)
    }
