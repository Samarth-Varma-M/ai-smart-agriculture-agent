import axios from 'axios';
import { DecisionResult } from './types';

const API_URL = 'http://127.0.0.1:8000/api/v1';

export interface DiagnosticRequestPayload {
  farm_profile: {
    location_lat: number;
    location_lon: number;
    crop_variety: string;
    planting_date: string;
    soil_baseline_ph: number;
    soil_baseline_npk: string;
  };
  telemetry: {
    moisture_percent: number;
    current_ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  image_base64: string;
}

export const runDiagnostic = async (payload: DiagnosticRequestPayload): Promise<DecisionResult> => {
  try {
    const response = await axios.post<DecisionResult>(`${API_URL}/diagnose`, payload);
    return response.data;
  } catch (error) {
    console.error("Diagnostic API Error:", error);
    throw error;
  }
};
