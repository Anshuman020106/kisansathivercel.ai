import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


SYSTEM_PROMPT = """You are kisansathi.ai, an agriculture assistant helping Indian farmers.

Rules:
- Answer in simple English.
- Keep answers SHORT (2-3 sentences max) because they are converted to speech.
- Be warm and conversational, like a helpful neighbor.
- If the farmer refers to something from earlier in the conversation, use the context to understand.
- Never say "as I mentioned" or "as discussed" — just answer naturally.
"""


def ask_gemini(question):
    """Single-turn Gemini call (backward compatible with /chat endpoint)."""

    prompt = f"""{SYSTEM_PROMPT}

Farmer question:
{question}

Answer:
"""

    response = model.generate_content(prompt)

    return response.text


def ask_gemini_with_history(question, history=None):
    """Multi-turn Gemini call with conversation history for continuous calls.
    
    Args:
        question: Current farmer question
        history: List of dicts [{"role": "user"/"model", "text": "..."}]
    
    Returns:
        AI response text
    """

    if not history:
        return ask_gemini(question)

    # Build conversation context from history (last 10 messages max)
    recent_history = history[-10:]

    conversation_lines = []
    for msg in recent_history:
        if msg["role"] == "user":
            conversation_lines.append(f"Farmer: {msg['text']}")
        else:
            conversation_lines.append(f"kisansathi.ai: {msg['text']}")

    history_text = "\n".join(conversation_lines)

    prompt = f"""{SYSTEM_PROMPT}

Previous conversation:
{history_text}

Farmer's new question:
{question}

Answer:
"""

    response = model.generate_content(prompt)

    return response.text