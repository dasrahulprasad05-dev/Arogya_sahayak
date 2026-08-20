import os
import json
import re
from typing import List, Dict, Any, Tuple

KNOWLEDGE_DIR = os.path.join(os.path.dirname(__file__), "knowledge")

# ── Indic Medical Synonym Expansion Dictionary ──────────────────────────
INDIC_MEDICAL_SYNONYMS: Dict[str, List[str]] = {
    "fever": [
        "fever", "temperature", "pyrexia", "bukhar", "tap", "jwara", "jara", "chills",
        "ଜ୍ୱର", "ଗରମ", "କମ୍ପ ଜ୍ୱର", "ମିଆଦି ଜ୍ୱର", "बुखार", "ताप", "कंपकंपी", "मोतीझरा"
    ],
    "dengue": [
        "dengue", "dengu", "platelet", "mosquito", "breakbone",
        "ଡେଙ୍ଗୁ", "ପ୍ଲେଟଲେଟ୍", "ମଶା", "डेंगू", "प्लेटलेट्स"
    ],
    "malaria": [
        "malaria", "falciparum", "vivax", "anopheles",
        "ମ୍ୟାଲେରିଆ", "କମ୍ପ", "मलेरिया"
    ],
    "typhoid": [
        "typhoid", "enteric", "widal", "contaminated water",
        "ଟାଇଫଏଡ୍", "ମିଆଦି", "टाइफाइड", "मोतीझरा"
    ],
    "heatstroke": [
        "heatstroke", "heat stroke", "sunstroke", "loo", "heat wave",
        "ଅଂଶୁଘାତ", "ଖରା", "ତାତି", "लू", "हीट स्ट्रोक", "धूप"
    ],
    "diabetes": [
        "diabetes", "sugar", "glucose", "hba1c", "insulin", "diabetic",
        "ମଧୁମେହ", "ଡାଇବେଟିସ୍", "ଚିନି ରୋଗ", "मधुमेह", "शुगर", "डायबिटीज"
    ],
    "hypertension": [
        "hypertension", "high bp", "blood pressure", "bp",
        "ଉଚ୍ଚ ରକ୍ତଚାପ", "ବିପି", "उच्च रक्तचाप", "बीपी"
    ],
    "anemia": [
        "anemia", "hemoglobin", "fatigue", "iron", "paleness",
        "ରକ୍ତହୀନତା", "ହିମୋଗ୍ଲୋବିନ୍", "ଏନିମିଆ", "एनीमिया", "खून की कमी"
    ],
    "maternal": [
        "pregnancy", "maternal", "mamata", "janani", "anc", "pregnant",
        "ଗର୍ଭବତୀ", "ମମତା", "ପ୍ରସବ", "गर्भवती", "ममता", "प्रसव"
    ],
    "cardiac": [
        "chest pain", "heart attack", "left arm pain", "cardiac", "infarction",
        "ଛାତି ବିନ୍ଧା", "ହୃଦଘାତ", "ହାର୍ଟ ଆଟାକ୍", "सीने में दर्द", "हार्ट अटैक", "दिल का दौरा"
    ],
    "stroke": [
        "stroke", "paralysis", "face drooping", "slurred speech",
        "ପକ୍ଷାଘାତ", "ଷ୍ଟ୍ରୋକ୍", "ମୁହଁ ବଙ୍କା", "लकवा", "स्ट्रोक"
    ],
    "snakebite": [
        "snakebite", "snake", "krait", "cobra", "viper", "venom",
        "ସାପ କାମୁଡ଼ା", "ସାପ", "ବିଷ", "सांप", "सर्पदंश", "विष"
    ],
    "bsky": [
        "bsky", "biju swasthya", "odisha scheme", "swasthya mitra",
        "ବିଏସକେୱାଇ", "ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ", "ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ"
    ],
    "ayushman": [
        "ayushman", "pmjay", "pm-jay", "health card", "csc",
        "ଆୟୁଷ୍ମାନ", "ଆୟୁଷ୍ମାନ ଭାରତ", "आयुष्मान", "आयुष्मान भारत"
    ],
    "helpline": [
        "helpline", "ambulance", "108", "112", "104", "tele-manas",
        "ହେଲ୍ପଲାଇନ୍", "ଆମ୍ବୁଲାନ୍ସ", "୧୦୮", "୧୧୨", "୧୦୪", "हेल्पलाइन", "एम्बुलेंस"
    ]
}

class MedicalRetriever:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        self.documents = []
        if not os.path.exists(KNOWLEDGE_DIR):
            return

        for fname in os.listdir(KNOWLEDGE_DIR):
            if fname.endswith(".json"):
                fpath = os.path.join(KNOWLEDGE_DIR, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if isinstance(data, list):
                            self.documents.extend(data)
                except Exception as e:
                    print(f"Error loading {fname}: {e}")

        print(f"Medical Knowledge Base initialized: {len(self.documents)} verified clinical records.")

    def expand_query_synonyms(self, query: str) -> List[str]:
        """Expands user query with Indic and medical synonyms."""
        query_lower = query.lower()
        expanded_terms = set(re.findall(r"\w+", query_lower))

        for concept, synonyms in INDIC_MEDICAL_SYNONYMS.items():
            if any(syn in query_lower for syn in synonyms):
                expanded_terms.update(synonyms)

        return list(expanded_terms)

    def search_with_confidence(self, query: str, top_k: int = 3) -> Tuple[List[Dict[str, Any]], float]:
        """
        Hybrid retrieval scoring using synonym expansion, n-gram matching,
        and multilingual aliases across Odia, Hindi, and English.
        
        Returns:
            (matching_docs, retrieval_confidence) where confidence is in [0.0, 1.0]
        """
        if not self.documents:
            return [], 0.0

        query_clean = query.lower()
        expanded_tokens = set(self.expand_query_synonyms(query))
        scored_docs = []

        for doc in self.documents:
            score = 0.0
            
            # 1. Match Keywords
            keywords = [k.lower() for k in doc.get("keywords", [])]
            for kw in keywords:
                if kw in query_clean:
                    score += 4.5
                elif any(kw_part in expanded_tokens for kw_part in kw.split()):
                    score += 2.5

            # 2. Match Disease Name
            dname = doc.get("disease_name", "").lower()
            if any(token in dname for token in expanded_tokens if len(token) > 2):
                score += 3.5

            # 3. Match Overview Text (EN / HI / OR)
            overview_all = (
                doc.get("overview_en", "") + " " +
                doc.get("overview_hi", "") + " " +
                doc.get("overview_or", "")
            ).lower()
            
            for token in expanded_tokens:
                if len(token) > 3 and token in overview_all:
                    score += 0.8

            if score > 0:
                scored_docs.append((score, doc))

        if not scored_docs:
            return [], 0.0

        scored_docs.sort(key=lambda x: x[0], reverse=True)
        top_score = scored_docs[0][0]
        
        # Normalize score into confidence [0.0, 1.0]
        # Score >= 8.0 indicates high confidence (>0.8)
        confidence = min(1.0, round(top_score / 10.0, 2))
        
        top_docs = [doc for score, doc in scored_docs[:top_k]]
        return top_docs, confidence

# Singleton instance
retriever = MedicalRetriever()
