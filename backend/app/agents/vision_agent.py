import os
import base64
from google import genai
from typing import Optional
from app.models.schemas import VisionResult

async def process_image(image_base64: Optional[str]) -> VisionResult:
    if os.environ.get("USE_MOCK_DATA", "false").lower() == "true":
        return VisionResult(
            detected_disease="Early Blight",
            confidence_score=95.0,
            severity_stage="Moderate",
            visual_indicators=["Dark concentric rings", "Yellowing halo"],
            is_blurry=False,
            uncertainty_flag=False
        )

    if not image_base64:
        return VisionResult(
            detected_disease="None",
            confidence_score=0.0,
            severity_stage="None",
            visual_indicators=[],
            is_blurry=False,
            uncertainty_flag=True
        )
    
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    try:
        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]
        image_bytes = base64.b64decode(image_base64)
    except Exception as e:
        print(f"Failed to decode base64 image: {e}")
        return VisionResult(
            detected_disease="Unknown",
            confidence_score=0.0,
            severity_stage="Unknown",
            visual_indicators=["Failed to process image format"],
            is_blurry=True,
            uncertainty_flag=True
        )

    prompt = """
    Analyze this crop leaf image. Identify any diseases, pests, or nutrient deficiencies.
    Assess the severity stage. State visual indicators.
    If the image is blurry or unidentifiable, flag it as such with high uncertainty.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=[
                prompt,
                genai.types.Part.from_bytes(data=image_bytes, mime_type='image/jpeg'),
            ],
            config=genai.types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=VisionResult,
            ),
        )
        if hasattr(response, 'parsed') and response.parsed:
            if isinstance(response.parsed, VisionResult):
                return response.parsed
            return VisionResult.model_validate(response.parsed)
        else:
            return VisionResult.model_validate_json(response.text)
    except Exception as e:
        print(f"Vision API failed: {e}")
        return VisionResult(
            detected_disease="Unknown (API Error)",
            confidence_score=0.0,
            severity_stage="Unknown",
            visual_indicators=[],
            is_blurry=False,
            uncertainty_flag=True
        )
