import os
import requests
from dotenv import load_dotenv

load_dotenv()

RIME_API_KEY = os.getenv("RIME_API_KEY")


def generate_voice(text):

    url = "https://users.rime.ai/v1/rime-tts"

    headers = {
        "Authorization": f"Bearer {RIME_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    print("====================")
    print("TEXT SENT TO RIME:")
    print(text)
    print("====================")


    payload = {
        "modelId": "coda",
        "speaker": "astra",
        "text": text,
        "language": "eng"
    }


    response = requests.post(
        url,
        headers=headers,
        json=payload
    )


    print("RIME STATUS:", response.status_code)

    if response.status_code != 200:
        print(response.text)
        raise Exception(response.text)


    return response.content