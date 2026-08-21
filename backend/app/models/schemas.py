from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class UrgencyLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ActionType(str, Enum):
    IRRIGATION = "IRRIGATION"
    FERTILIZER = "FERTILIZER"
    FOLIAR_SPRAY = "FOLIAR_SPRAY"
    DELAY_SPRAY = "DELAY_SPRAY"
    HARVEST = "HARVEST"
    MONITOR = "MONITOR"

class FarmProfile(BaseModel):
    location_lat: float
    location_lon: float
    crop_variety: str
    planting_date: str
    soil_baseline_ph: float
    soil_baseline_npk: str

class SoilTelemetry(BaseModel):
    moisture_percent: float
    current_ph: float
    nitrogen: float
    phosphorus: float
    potassium: float

class DiagnosticRequest(BaseModel):
    farm_profile: FarmProfile
    telemetry: SoilTelemetry
    image_base64: Optional[str] = None

class VisionResult(BaseModel):
    detected_disease: str
    confidence_score: float
    severity_stage: str
    visual_indicators: List[str]
    is_blurry: bool
    uncertainty_flag: bool

class EnvironmentResult(BaseModel):
    soil_water_deficit: float
    spray_window_feasible: bool
    weather_summary: str
    rainfall_mm_24h: float
    rainfall_mm_6h: float
    wind_speed_kmh: float

class MarketResult(BaseModel):
    harvest_urgency_index: float
    projected_price_trend: str
    crop_maturity_status: str

class ConflictWarning(BaseModel):
    rule_triggered: str
    message: str

class DecisionCard(BaseModel):
    primary_action: ActionType
    urgency: UrgencyLevel
    conflict_warnings: List[ConflictWarning]
    reasoning_trace: str
    cited_metrics: Dict[str, Any]
    organic_alternative: Optional[str]
    estimated_cost_impact: str

class FeedbackRequest(BaseModel):
    decision_id: Optional[str] = None
    status: str
    notes: Optional[str] = None
