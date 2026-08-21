import os
from google import genai
from app.models.schemas import VisionResult, EnvironmentResult, MarketResult, DecisionCard
from app.seed_data import MOCK_DECISION_PRESET_1, MOCK_DECISION_PRESET_2, MOCK_DECISION_PRESET_3

async def process_synthesis(
    vision: VisionResult, 
    environment: EnvironmentResult, 
    market: MarketResult
) -> DecisionCard:
    if os.environ.get("USE_MOCK_DATA", "false").lower() == "true":
        if environment.rainfall_mm_24h > 20:
            return DecisionCard(**MOCK_DECISION_PRESET_1)
        elif environment.soil_water_deficit > 80:
            return DecisionCard(**MOCK_DECISION_PRESET_2)
        elif market.projected_price_trend == "PEAKING":
            return DecisionCard(**MOCK_DECISION_PRESET_3)
        else:
            return DecisionCard(**MOCK_DECISION_PRESET_1)

    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = f"""
    You are a Principal AI Systems Architect in Agriculture. Synthesize the following agent outputs into a final DecisionCard.
    Apply the following cross-agent validation rules:
    * Rule A (Rain vs. Spray): If Vision suggests foliar spray/pesticide, but Rain > 5mm in next 24h -> Flag "CRITICAL CONFLICT", delay spray, and explain why.
    * Rule B (Irrigation vs. Soil/Rain): If Soil Moisture < 30% but Rain > 15mm expected in 6h -> Recommend holding irrigation.
    * Rule C (Market Timing): If crop is mature and price is peaking -> Recommend immediate harvest before forecasted adverse weather.

    Data:
    [Vision]
    Disease: {vision.detected_disease} (Conf: {vision.confidence_score}%)
    Severity: {vision.severity_stage}
    Indicators: {', '.join(vision.visual_indicators)}
    Uncertain: {vision.uncertainty_flag}

    [Environment]
    Soil Deficit: {environment.soil_water_deficit}%
    Spray Window: {'Open' if environment.spray_window_feasible else 'Closed'}
    Rain 24h: {environment.rainfall_mm_24h}mm, Rain 6h: {environment.rainfall_mm_6h}mm
    Summary: {environment.weather_summary}

    [Market]
    Maturity: {market.crop_maturity_status}
    Price Trend: {market.projected_price_trend}
    Harvest Urgency: {market.harvest_urgency_index}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=DecisionCard,
            ),
        )
        if hasattr(response, 'parsed') and response.parsed:
            if isinstance(response.parsed, DecisionCard):
                return response.parsed
            return DecisionCard.model_validate(response.parsed)
        else:
            return DecisionCard.model_validate_json(response.text)
    except Exception as e:
        print(f"Synthesis API failed: {e}")
        from app.models.schemas import ActionType, UrgencyLevel
        return DecisionCard(
            primary_action=ActionType.MONITOR,
            urgency=UrgencyLevel.LOW,
            conflict_warnings=[],
            reasoning_trace=f"Failed to synthesize due to error: {e}",
            cited_metrics={},
            organic_alternative=None,
            estimated_cost_impact="Unknown"
        )
