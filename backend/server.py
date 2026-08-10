import time
import uuid
import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from gemini import ask_gemini, ask_gemini_with_history
from rime import generate_voice


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# SESSION STORE
# In-memory conversation sessions
# ==============================

# { session_id: { "history": [...], "last_active": timestamp } }
sessions: dict = {}

SESSION_TTL_SECONDS = 30 * 60  # 30 minutes


def cleanup_expired_sessions():
    """Remove sessions that haven't been active for SESSION_TTL_SECONDS."""
    now = time.time()
    expired = [
        sid for sid, data in sessions.items()
        if now - data["last_active"] > SESSION_TTL_SECONDS
    ]
    for sid in expired:
        del sessions[sid]
        print(f"Session expired: {sid}")


def start_cleanup_timer():
    """Run session cleanup every 5 minutes."""
    cleanup_expired_sessions()
    timer = threading.Timer(300, start_cleanup_timer)
    timer.daemon = True
    timer.start()


# Start the cleanup timer on server boot
start_cleanup_timer()


# ==============================
# ROUTES
# ==============================

@app.get("/")
def home():
    return {
        "message": "kisansathi.ai Voice Backend Running"
    }



@app.post("/chat")
def chat(data: dict):
    """Original single-turn chat endpoint (unchanged)."""

    question = data.get("text")

    answer = ask_gemini(question)


    return {
        "question": question,
        "answer": answer
    }



@app.post("/voice")
def voice(data: dict):
    """Voice endpoint with optional session-based conversation memory.
    
    Request body:
        text: str - The farmer's question
        session_id: str (optional) - Session ID for conversation continuity
    
    Returns:
        audio/mpeg response
    """

    question = data.get("text")
    session_id = data.get("session_id")

    history = []

    # If session_id provided, retrieve or create session
    if session_id:
        if session_id not in sessions:
            sessions[session_id] = {
                "history": [],
                "last_active": time.time()
            }

        session = sessions[session_id]
        history = session["history"]
        session["last_active"] = time.time()

    # Get Gemini answer with conversation context
    if history:
        answer = ask_gemini_with_history(question, history)
    else:
        answer = ask_gemini(question)

    print("GEMINI ANSWER:")
    print(answer)

    # Save to session history
    if session_id and session_id in sessions:
        sessions[session_id]["history"].append(
            {"role": "user", "text": question}
        )
        sessions[session_id]["history"].append(
            {"role": "model", "text": answer}
        )

    # Limit Rime length
    short_answer = answer[:500]


    # Convert Gemini answer to speech
    audio = generate_voice(short_answer)


    import base64
    audio_b64 = base64.b64encode(audio).decode("utf-8")

    return {
        "answer": short_answer,
        "audio": audio_b64,
        "session_id": session_id
    }




@app.post("/session/end")
def end_session(data: dict):
    """End a conversation session and clear its history.
    
    Request body:
        session_id: str - The session to end
    """

    session_id = data.get("session_id")

    if session_id and session_id in sessions:
        del sessions[session_id]
        print(f"Session ended: {session_id}")

    return {"status": "ok"}



@app.post("/session/start")
def start_session():
    """Create a new conversation session.
    
    Returns:
        session_id: str - A new unique session ID
    """

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "history": [],
        "last_active": time.time()
    }

    print(f"Session started: {session_id}")

    return {"session_id": session_id}