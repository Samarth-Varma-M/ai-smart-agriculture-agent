# System Architecture

## Tech Stack
* **Backend:** Python 3.11+, FastAPI, Pydantic, Uvicorn
* **AI Orchestration & Vision:** Google GenAI SDK (Gemini 2.5 / 2.0 Flash Multimodal), LangGraph / lightweight asynchronous task runner
* **Data Sources:** Open-Meteo API (Weather), Mock APMC Market API, Simulated Soil Telemetry Engine
* **Frontend:** Next.js (React 19), Tailwind CSS, Lucide Icons, Shadcn UI

## Multi-Agent Workflow
1. **VisionAgent:** Processes uploaded leaf/field images -> extracts disease state, severity, and visual health score.
2. **EnvironmentAgent:** Ingests soil metrics (moisture, pH, NPK) and pulls weather forecasts -> outputs environmental risks.
3. **MarketAgent:** Fetches commodity price trends -> outputs market timing flags.
4. **SynthesisAgent:** Ingests payloads from Vision, Environment, and Market agents -> produces an integrated JSON decision card.

## Backend Directory Structure
backend/
├── app/
│   ├── api/
│   │   ├── routes.py
│   ├── agents/
│   │   ├── vision_agent.py
│   │   ├── environment_agent.py
│   │   ├── market_agent.py
│   │   └── synthesis_agent.py
│   ├── models/
│   │   └── schemas.py
│   ├── services/
│   │   ├── weather_service.py
│   │   └── market_service.py
│   └── main.py
├── requirements.txt
└── .env