# Product Requirements Document (PRD)

## Project Title
AI Smart Agriculture Decision Agent

## Overview
A multi-agent decision system combining crop images, soil telemetry, local weather forecasts, crop stage, and commodity market prices to deliver explainable, contextual farm-management recommendations.

## Target Users
* Small-to-medium farm operators and agronomists.
* Agricultural extension workers seeking rapid diagnostic and advisory support.

## Core Feature Scope
1. **Crop & Field Profile Management:** Setup field profiles with location, soil baseline (pH, NPK), crop variety, and planting date.
2. **Crop-Image Diagnostics:** Multimodal disease, pest, and nutrient deficiency detection using Gemini Vision.
3. **Weather-Aware Irrigation & Spray Advisory:** Recommendations dynamically evaluated against 7-day rainfall, temperature, and wind speed.
4. **Soil & Nutrient Analysis:** Soil telemetry ingestion and dynamic fertilizer recommendation.
5. **Market Intelligence:** Live/mock APMC commodity price trends to suggest optimal harvest and selling windows.
6. **Integrated Farm Decision Engine:** Central synthesis aggregating inputs into structured, explainable action cards.
7. **Farmer Feedback Loop:** Interactive confirmation mechanism (applied / not applied / user notes) to refine historical advice.