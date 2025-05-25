from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import dwani
import requests
import google.generativeai as genai

# Configure keys
dwani.api_key = os.getenv("DWANI_API_KEY")
dwani.api_base = os.getenv("DWANI_API_BASE_URL")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-pro")

app = Flask(__name__)
CORS(app)

# ----------------------------------
# CHAT + VOICE (general use)
# ----------------------------------
@app.route("/api/chat", methods=["POST"])
def api_chat():
    prompt = request.json.get("message", "")
    try:
        # Chat API: translate or respond in Kannada
        response = dwani.Chat.create(prompt=prompt, src_lang="eng_Latn", tgt_lang="kan_Knda")
        reply_text = response.get("response", "No response")

        audio_bytes = dwani.Audio.speech(input=reply_text, response_format="mp3")
        with open("output.mp3", "wb") as f:
            f.write(audio_bytes)

        return jsonify({"reply": reply_text, "audioUrl": "http://localhost:3001/api/audio"})

    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500


@app.route("/api/audio", methods=["GET"])
def get_audio():
    return send_file("output.mp3", mimetype="audio/mpeg")


# ----------------------------------
# ROUTE USING GEMINI + DWANI
# ----------------------------------
@app.route("/api/route", methods=["POST"])
def get_bus_route_with_ai():
    data = request.json
    origin = data.get("origin")
    destination = data.get("destination")

    if not origin or not destination:
        return jsonify({"error": "Origin and destination are required"}), 400

    # Prompt for Gemini in Kannada
    gemini_prompt = f"From '{origin}' to '{destination}', provide Karnataka bus numbers and timings. Respond only in Kannada."

    try:
        gemini_response = gemini_model.generate_content(gemini_prompt)
        reply_text = gemini_response.text.strip()

        # Generate speech from Gemini response
        audio_bytes = dwani.Audio.speech(input=reply_text, response_format="mp3")
        with open("output.mp3", "wb") as f:
            f.write(audio_bytes)

        return jsonify({
            "reply": reply_text,
            "audioUrl": "http://localhost:3001/api/audio"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=3001, debug=True)
