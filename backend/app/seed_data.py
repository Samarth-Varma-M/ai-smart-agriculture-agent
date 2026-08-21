MOCK_DECISION_PRESET_1 = {
    "primary_action": "DELAY_SPRAY",
    "urgency": "CRITICAL",
    "conflict_warnings": [{
        "rule_triggered": "Rule A (Rain vs. Spray)",
        "message": "Heavy rainfall expected in next 24h. Foliar spray will wash off immediately."
    }],
    "reasoning_trace": "Vision agent identified Early Blight requiring fungicide. However, Environment agent flagged 25mm rain expected soon. Action overridden to prevent wasted chemical cost.",
    "cited_metrics": {"rainfall_24h_mm": 25.0},
    "organic_alternative": "Use copper-based organic spray once the weather clears.",
    "estimated_cost_impact": "$150 saved on wasted chemicals"
}

MOCK_DECISION_PRESET_2 = {
    "primary_action": "IRRIGATION",
    "urgency": "HIGH",
    "conflict_warnings": [],
    "reasoning_trace": "Environment agent detected critical soil moisture deficit (15%) and no rain is expected. Immediate irrigation is necessary to prevent crop loss.",
    "cited_metrics": {"soil_moisture_percent": 15.0, "rainfall_24h_mm": 0.0},
    "organic_alternative": "Consider mulching to retain soil moisture.",
    "estimated_cost_impact": "$500 potential yield loss averted"
}

MOCK_DECISION_PRESET_3 = {
    "primary_action": "HARVEST",
    "urgency": "HIGH",
    "conflict_warnings": [{
        "rule_triggered": "Rule C (Market Timing)",
        "message": "Market price is peaking. Recommend immediate harvest to maximize profit."
    }],
    "reasoning_trace": "Market agent confirmed crop is mature and local APMC trends indicate a price peak. Harvest now to secure best rates.",
    "cited_metrics": {"harvest_urgency_index": 95.0},
    "organic_alternative": None,
    "estimated_cost_impact": "+$1200 projected revenue increase"
}
