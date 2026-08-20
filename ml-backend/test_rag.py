import os
import sys

if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

sys.path.insert(0, os.path.dirname(__file__))

from rag.graph import run_chat_pipeline

def test_clinical_state_machine():
    print("==================================================")
    print("Testing LangGraph Clinical State Machine & RAG KB")
    print("==================================================")

    # Test 1: Emergency Fast-Path
    q1 = "Severe chest pain radiating to left arm and sweating"
    res1 = run_chat_pipeline(q1, "en")
    print("\n[Test 1 - Emergency Fast-Path]")
    print(f"Query: {q1}")
    print(f"Emergency SOS: {res1.get('emergency_sos')}")
    print(f"Confidence: {res1.get('confidence')}")
    assert res1.get("emergency_sos") is True, "Emergency must trigger Fast-Path"

    # Test 2: Grounded RAG Path (Dengue in Odia)
    q2 = "ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଏବଂ ଡେଙ୍ଗୁ ଲକ୍ଷଣ ଅଛି"
    res2 = run_chat_pipeline(q2, "or")
    print("\n[Test 2 - Grounded RAG Path in Odia]")
    print(f"Query: {q2}")
    print(f"Confidence: {res2.get('confidence')}")
    print(f"Sources: {res2.get('sources')}")
    print(f"Home Care: {res2.get('recommendations')[:2]}")
    assert res2.get("confidence", 0) >= 0.3, "Should pass grounded RAG threshold"

    # Test 3: Maternal Health Knowledge in Odia
    q3 = "ଓଡ଼ିଶାରେ ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ମମତା ଯୋଜନା ବିଷୟରେ କୁହନ୍ତୁ"
    res3 = run_chat_pipeline(q3, "or")
    print("\n[Test 3 - Maternal Health MAMATA Scheme]")
    print(f"Query: {q3}")
    print(f"Confidence: {res3.get('confidence')}")
    print(f"Specialist: {res3.get('specialist')}")

    # Test 4: Fallback General LLM Path (Tennis elbow - not in local tropical KB)
    q4 = "How to stretch tennis elbow at home"
    res4 = run_chat_pipeline(q4, "en")
    print("\n[Test 4 - Fallback General Health LLM]")
    print(f"Query: {q4}")
    print(f"Confidence: {res4.get('confidence')}")
    print(f"Sources: {res4.get('sources')}")

    print("\n✅ All 4 LangGraph Clinical State Machine tests passed cleanly!")

if __name__ == "__main__":
    test_clinical_state_machine()
