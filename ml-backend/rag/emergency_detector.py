import re
from typing import Tuple, Optional

# Multi-lingual Emergency Red-Flag Catalog
EMERGENCY_PATTERNS = {
    "cardiac": [
        r"chest\s*pain", r"heart\s*attack", r"left\s*arm\s*pain", r"chest\s*pressure", r"crushing\s*chest",
        r"सीने\s*में\s*दर्द", r"हार्ट\s*अटैक", r"दिल\s*का\s*दौरा", r"छाती\s*में\s*दर्द",
        r"ଛାତି\s*ବିନ୍ଧା", r"ହୃଦଘାତ", r"ହାର୍ଟ\s*ଆଟାକ୍", r"ଛାତିରେ\s*ଚାପ"
    ],
    "stroke": [
        r"stroke", r"paralysis", r"face\s*droop", r"slurred\s*speech", r"one\s*side\s*weakness",
        r"लकवा", r"स्ट्रोक", r"मुंह\s*टेढ़ा", r"आधा\s*शरीर\s*सुन्न",
        r"ପକ୍ଷାଘାତ", r"ଷ୍ଟ୍ରୋକ୍", r"ମୁହଁ\s*ବଙ୍କା", r"ହାତ\s*ଗୋଡ଼\s*ଅବଶ"
    ],
    "snakebite": [
        r"snake\s*bite", r"snakebite", r"cobra", r"krait", r"viper",
        r"सांप\s*ने\s*काट", r"सांप\s*काटा", r"सर्पदंश", r"विष",
        r"ସାପ\s*କାମୁଡ଼ି", r"ସାପ\s*କାମୁଡ଼ା", r"ବିଷାକ୍ତ\s*ସାପ"
    ],
    "severe_trauma_bleed": [
        r"severe\s*bleed", r"unconscious", r"collapsed", r"convulsion", r"seizure",
        r"बेहोश", r"खून\s*बह\s*रहा", r"दौरा\s*पड़",
        r"ଚେତା\s*ହରାଇ", r"ପ୍ରବଳ\s*ରକ୍ତସ୍ରାବ", r"ବାତ\s*ମାରିବା"
    ]
}

def detect_emergency(text: str) -> Tuple[bool, Optional[str]]:
    """
    Rapid zero-latency emergency guardrail.
    Returns (is_emergency, emergency_type).
    """
    cleaned = text.lower().strip()
    
    for category, patterns in EMERGENCY_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, cleaned, re.IGNORECASE):
                return True, category
                
    return False, None
