import os
import json
import re
import urllib.request
import urllib.error
from typing import Dict, Any, List
from rag.state import GraphState
from rag.emergency_detector import detect_emergency
from rag.retriever import retriever

GROQ_API_KEY = os.environ.get("GROQ_API_KEY") or os.environ.get("GEMINI_API_KEY") or ""

# Unauthorized drug patterns to block in post-generation safety check
PRESCRIPTION_DRUG_PATTERNS = [
    r"\b(amoxicillin|azithromycin|ciprofloxacin|doxycycline|metronidazole|augmentin|cefixime|paracetamol\s*\d+mg|ibuprofen\s*\d+mg|prednisolone|dexamethasone)\b",
    r"\b(एंटीबायोटिक|स्टेरॉयड|पेरासिटामोल\s*\d+एमजी)\b",
    r"\b(ଆଣ୍ଟିବାୟୋଟିକ୍|ଷ୍ଟେରଏଡ୍)\b"
]

def call_groq_llm(system_prompt: str, user_message: str) -> str:
    """Helper to invoke Groq LLaMA-3.1 API if key is configured."""
    if not GROQ_API_KEY:
        return ""

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}"
    }
    payload = {
        "model": "openai/gpt-oss-20b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        "temperature": 0.2,
        "max_tokens": 800
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Groq API Error: {e}")
        return ""


# ── LangGraph Clinical State Machine Nodes ───────────────────────────────

def retrievalNode(state: GraphState) -> GraphState:
    """Node 1: Medical Synonym Expansion & Knowledge Base Retrieval."""
    docs, confidence = retriever.search_with_confidence(state.userMessage, top_k=3)
    state.ragContext = docs
    state.retrievalConfidence = confidence
    return state


def triageNode(state: GraphState) -> GraphState:
    """Node 2: Language detection and clinical intent triage."""
    query = state.userMessage.strip()

    # Detect Odia
    if any("\u0b00" <= ch <= "\u0b7f" for ch in query):
        state.language = "or"
    # Detect Devanagari (Hindi)
    elif any("\u0900" <= ch <= "\u097f" for ch in query):
        state.language = "hi"

    return state


def safetyNode(state: GraphState) -> GraphState:
    """Node 3: Pre-generation emergency red-flag interceptor."""
    is_emerg, emerg_type = detect_emergency(state.userMessage)
    if is_emerg:
        state.safetyStatus = "emergency"
        state.emergencyType = emerg_type
    else:
        state.safetyStatus = "safe"
    return state


def decideNextStep(state: GraphState) -> str:
    """Conditional Edge: Routes based on emergency flag and RAG confidence score."""
    if state.safetyStatus == "emergency":
        return "fastPath"
    elif state.retrievalConfidence >= 0.3:
        return "responseNode"
    else:
        return "fallbackNode"


def fastPathNode(state: GraphState) -> GraphState:
    """Fast-Path Emergency Node: Zero-latency 108/112 ambulance protocol."""
    lang = state.language
    
    if lang == "or":
        content = "🚨 ଜରୁରୀକାଳୀନ ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା! ଏହି ଲକ୍ଷଣ ହୃଦଘାତ, ଷ୍ଟ୍ରୋକ୍ କିମ୍ବା ଗମ୍ଭୀର ଜରୁରୀକାଳୀନ ଅବସ୍ଥା ହୋଇପାରେ। ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ।"
        recs = [
            "ତୁରନ୍ତ ୧୦୮ କିମ୍ବା ୧୧୨ ଆମ୍ବୁଲାନ୍ସକୁ କଲ୍ କରନ୍ତୁ।",
            "ରୋଗୀଙ୍କୁ ଶୁଆଇବା ବଦଳରେ ପିଠିକୁ ଆଉଜାଇ ବସାନ୍ତୁ। ଚଲାବୁଲା କରିବାକୁ ଦିଅନ୍ତୁ ନାହିଁ।",
            "ବେକ ଓ ଅଣ୍ଟା ପାଖ ଲୁଗାପଟା ଢିଲା କରନ୍ତୁ।"
        ]
        warns = ["ଅସହ୍ୟ ଛାତି ଯନ୍ତ୍ରଣା, ବାମ ହାତକୁ ଯନ୍ତ୍ରଣା ବ୍ୟାପିବା, ଚେତା ହରାଇବା କିମ୍ବା ଶ୍ୱାସକ୍ରିୟା ବନ୍ଦ ହେବା।"]
        follow_up = "ଆପଣ କ'ଣ ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ ଡାକ୍ତରଖାନା ଯିବା ପାଇଁ ଆମ୍ବୁଲାନ୍ସ ଡାକିସାରିଛନ୍ତି?"
    elif lang == "hi":
        content = "🚨 आपातकालीन स्वास्थ्य चेतावनी! यह लक्षण हार्ट अटैक, स्ट्रोक या गंभीर आपातकाल के हो सकते हैं। तुरंत 108 एम्बुलेंस बुलाएं।"
        recs = [
            "तुरंत 108 या 112 एम्बुलेंस को कॉल करें।",
            "मरीज को पीठ के सहारे अर्ध-बैठी अवस्था में रखें। चलने-फिरने बिल्कुल न दें।",
            "सीधे नजदीकी आपातकालीन अस्पताल ले जाएं।"
        ]
        warns = ["सीने में तेज दबाव, बाएं हाथ में दर्द, सांस लेने में तकलीफ या बेहोशी।"]
        follow_up = "क्या आपने आपातकालीन एम्बुलेंस 108 को कॉल कर दिया है?"
    else:
        content = "🚨 EMERGENCY HEALTH ALERT: These symptoms indicate a life-threatening acute cardiac, neurological, or trauma emergency. Dial 108 immediately."
        recs = [
            "Call 108 or 112 for an emergency ambulance immediately.",
            "Keep patient seated in a supported semi-reclined position. Do not allow walking or physical exertion.",
            "Transport immediately to the nearest 24x7 emergency department."
        ]
        warns = ["Crushing chest pain, radiating pain, breathlessness, slurred speech, or loss of consciousness."]
        follow_up = "Have you dialed 108 or alerted nearby family members for transport?"

    state.finalResponse = {
        "content": content,
        "confidence": 0.98,
        "recommendations": recs,
        "warnings": warns,
        "sources": ["National Emergency Response Protocol (108/112)", "ICMR Critical Care Guidelines"],
        "followUp": follow_up,
        "emergency_sos": True,
        "specialist": "Cardiologist / Emergency Medicine"
    }
    return state


def responseNode(state: GraphState) -> GraphState:
    """Node 4: Grounded RAG LLM using verified Odisha & Indian clinical context."""
    lang = state.language
    top_doc = state.ragContext[0] if state.ragContext else {}

    disease_name = top_doc.get("disease_name", "Health Guidance")
    overview = top_doc.get(f"overview_{lang}") or top_doc.get("overview_en", "")
    home_care = top_doc.get(f"safe_home_care_{lang}") or top_doc.get("safe_home_care_en", [])
    red_flags = top_doc.get(f"red_flags_{lang}") or top_doc.get("red_flags_en", [])
    specialist = top_doc.get("recommended_specialist", "General Physician")

    # If Groq is configured, generate contextualized natural phrasing
    if GROQ_API_KEY and overview:
        prompt = f"""You are Arogya Sahayak, an Indian clinical triage assistant.
Target Language: {lang} (Respond STRICTLY in natural {lang}).
Grounded Context: {overview}
Home Care: {'; '.join(home_care)}
Red Flags: {'; '.join(red_flags)}

Provide a structured, compassionate explanation in {lang} covering disease overview, safe home remedies (ORS, coconut water, dalia), and when to see a doctor."""
        llm_text = call_groq_llm(prompt, f"User symptom query: {state.userMessage}")
        if llm_text:
            overview = llm_text.strip()

    follow_up_map = {
        "or": "ଆପଣ କ'ଣ ନିକଟସ୍ଥ ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ସହିତ ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ କରିବାକୁ ଚାହାଁନ୍ତି?",
        "hi": "क्या आप नजदीकी विशेषज्ञ डॉक्टर के साथ अपॉइंटमेंट बुक करना चाहते हैं?",
        "en": "Would you like to book an appointment with a nearby specialist doctor?"
    }

    state.finalResponse = {
        "content": overview,
        "confidence": state.retrievalConfidence,
        "recommendations": home_care,
        "warnings": red_flags,
        "sources": ["Odisha Public Health Guidelines", "ICMR Clinical Treatment Guidelines"],
        "followUp": follow_up_map.get(lang, follow_up_map["en"]),
        "emergency_sos": False,
        "specialist": specialist
    }
    return state


def fallbackNode(state: GraphState) -> GraphState:
    """Node 5: General Health LLM Fallback (for queries outside the local KB)."""
    lang = state.language

    fallback_content = {
        "or": "ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ଅନୁଯାୟୀ ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ନିୟମିତ ପାଣି ଓ ତରଳ ଖାଦ୍ୟ ଗ୍ରହଣ କରନ୍ତୁ। ସଠିକ୍ ପରୀକ୍ଷା ପାଇଁ ଜଣେ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।",
        "hi": "अपने लक्षणों के अनुसार पर्याप्त आराम करें और शरीर में पानी की कमी न होने दें। सही जांच के लिए योग्य डॉक्टर से परामर्श करें।",
        "en": "Based on your inquiry, ensure adequate rest, maintain hydration, and observe symptom progression. For an accurate diagnosis, consult a qualified physician."
    }

    recs_map = {
        "or": ["ପ୍ରଚୁର ପାଣି, ଡାବ ପାଣି ଏବଂ ସୁପାଚ୍ୟ ଖାଦ୍ୟ ଖାଆନ୍ତୁ।", "କୌଣସି ଅଜଣା ଔଷଧ ନିଜ ଇଚ୍ଛାରେ ଖାଆନ୍ତୁ ନାହିଁ।"],
        "hi": ["खूब पानी और सुपाच्य भोजन लें।", "बिना डॉक्टर की सलाह के कोई दवा न लें।"],
        "en": ["Maintain good hydration with water, ORS, and warm soups.", "Avoid unprescribed self-medication."]
    }

    warns_map = {
        "or": ["ଲକ୍ଷଣ ୩ ଦିନରୁ ଅଧିକ ରହିଲେ କିମ୍ବା ବୃଦ୍ଧି ପାଇଲେ ଡାକ୍ତରଙ୍କୁ ଦେଖାନ୍ତୁ।"],
        "hi": ["लक्षण 3 दिन से अधिक रहने पर तुरंत डॉक्टर से मिलें।"],
        "en": ["Seek medical attention if symptoms persist for more than 3 days or worsen."]
    }

    # Call LLM for general inquiry
    if GROQ_API_KEY:
        prompt = f"""You are Arogya Sahayak, an AI health triage companion.
Target Language: {lang}.
The query is not in the local state database. Provide a general, medically safe explanation in {lang}.
STRICT RULES:
1. Do NOT prescribe antibiotics or specific drug dosages.
2. Focus on safe hydration, Indian dietary care, and when to see a physician."""
        llm_text = call_groq_llm(prompt, state.userMessage)
        if llm_text:
            fallback_content[lang] = llm_text.strip()

    state.finalResponse = {
        "content": fallback_content.get(lang, fallback_content["en"]),
        "confidence": 0.45,
        "recommendations": recs_map.get(lang, recs_map["en"]),
        "warnings": warns_map.get(lang, warns_map["en"]),
        "sources": ["General Medical Knowledge (Arogya Sahayak AI)"],
        "followUp": "Would you like to speak to a doctor or check hospital services?",
        "emergency_sos": False,
        "specialist": "General Physician"
    }
    return state


def finalSafetyCheckNode(state: GraphState) -> GraphState:
    """Node 6: Post-generation clinical validator (Strips prescription drugs & diagnosis claims)."""
    resp = state.finalResponse
    content = resp.get("content", "")

    # 1. Strip unauthorized prescription drug mentions
    for pattern in PRESCRIPTION_DRUG_PATTERNS:
        content = re.sub(pattern, "[Prescription Medication - Consult Doctor]", content, flags=re.IGNORECASE)

    # 2. Block false doctor diagnosis claims
    content = re.sub(r"I diagnose you with", "Clinical assessment suggests possible indicators of", content, flags=re.IGNORECASE)

    # 3. Append legal disclaimer
    disclaimer_map = {
        "or": "\n\n⚕️ ସତର୍କତା: ଏହା ଏକ AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ, କୌଣସି ଡାକ୍ତରୀ ଚିକିତ୍ସା ନୁହେଁ। ଚିକିତ୍ସା ପାଇଁ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।",
        "hi": "\n\n⚕️ अस्वीकरण: यह एक AI स्वास्थ्य सहायक है, डॉक्टरी निदान नहीं। सटीक इलाज के लिए डॉक्टर से मिलें।",
        "en": "\n\n⚕️ DISCLAIMER: This is an AI health triage assistant, not a clinical diagnosis. Always consult a certified healthcare professional."
    }
    content += disclaimer_map.get(state.language, disclaimer_map["en"])

    resp["content"] = content
    state.finalResponse = resp
    return state


# ── Graph Execution Pipeline ─────────────────────────────────────────────

def run_chat_pipeline(query: str, target_lang: str = "en") -> Dict[str, Any]:
    """
    Executes the LangGraph Clinical State Machine:
    retrievalNode -> triageNode -> safetyNode -> decideNextStep -> (responseNode | fallbackNode | fastPathNode) -> finalSafetyCheckNode
    """
    state = GraphState(
        userMessage=query,
        language=target_lang if target_lang in ["en", "hi", "or"] else "en"
    )

    # 1. Retrieval
    state = retrievalNode(state)

    # 2. Triage & Language
    state = triageNode(state)

    # 3. Safety Check
    state = safetyNode(state)

    # 4. Conditional Branching
    next_step = decideNextStep(state)

    if next_step == "fastPath":
        state = fastPathNode(state)
    elif next_step == "responseNode":
        state = responseNode(state)
    else:
        state = fallbackNode(state)

    # 5. Final Post-Generation Validator
    if next_step != "fastPath":
        state = finalSafetyCheckNode(state)

    return state.finalResponse
