# Engineering Rules & AI Guardrails

## Technical Standards
* Use strict Pydantic schemas for all agent inputs, inter-agent payloads, and API outputs.
* Async everywhere: All API endpoints and external calls must be non-blocking (`async def`).
* Comprehensive error handling: Wrap all third-party API and LLM calls in structured try/except blocks with fallback mock responses.

## Decision & Explainability Rules
* Every recommendation returned to the user MUST include an explicit `reasoning` object citing concrete data (e.g., exact soil moisture % or mm of expected rainfall).
* Urgency levels are restricted to: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
* Provide step-by-step actionable remediation steps with chemical and organic alternatives.

## AI Execution Constraints
* Never generate unverified external dependencies. Stick to the curated requirements list.
* Keep frontend state cleanly decoupled from agent execution states.