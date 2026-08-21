from fastapi import APIRouter, HTTPException
import asyncio
from app.models.schemas import DiagnosticRequest, DecisionCard, FeedbackRequest
from app.agents.vision_agent import process_image
from app.agents.environment_agent import process_environment
from app.agents.market_agent import process_market
from app.agents.synthesis_agent import process_synthesis

router = APIRouter()

@router.post("/diagnose", response_model=DecisionCard)
async def run_diagnostics(request: DiagnosticRequest):
    try:
        vision_task = process_image(request.image_base64)
        environment_task = process_environment(request.farm_profile, request.telemetry)
        market_task = process_market(request.farm_profile)
        
        vision_result, environment_result, market_result = await asyncio.gather(
            vision_task, environment_task, market_task
        )
        
        decision_card = await process_synthesis(vision_result, environment_result, market_result)
        
        return decision_card
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    print(f"Feedback received: {request.status} - Notes: {request.notes}")
    return {"message": "Feedback recorded successfully.", "status": "success"}
