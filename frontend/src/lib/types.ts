export interface FarmState {
  cropType: string;
  growthStage: string;
  locationName: string;
  locationLat: number;
  locationLon: number;
  soilMoisture: number;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  base64Image: string;
}

export interface ConflictWarning {
  message: string;
}

export interface DecisionResult {
  id?: string;
  primary_action: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  conflict_warnings?: ConflictWarning[];
  reasoning_trace: string;
  organic_alternative?: string | null;
  estimated_cost_impact?: string;
  cited_metrics?: Record<string, number | string>;
}

export interface HistoryEntry {
  id: string;
  date: string;
  crop: string;
  action: string;
  urgency: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "ANNOTATED" | string;
  notes?: string;
  decision: DecisionResult;
}

export interface WeatherDay {
  day: string;
  condition: "Sunny" | "Rain" | "Cloudy" | string;
  high: number;
  low: number;
  rain: number;
  wind: number;
  humidity?: number;
}

export interface MarketCommodity {
  price: string;
  retailPrice?: string;
  trend: string;
  trendDesc: string;
  direction?: string;
  advice: string;
  arrivals?: string;
}
