import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runDiagnostic = async (payload: any) => {
  try {
    const response = await axios.post(`${API_URL}/diagnose`, payload);
    return response.data;
  } catch (error) {
    console.error("Diagnostic API Error:", error);
    throw error;
  }
};
