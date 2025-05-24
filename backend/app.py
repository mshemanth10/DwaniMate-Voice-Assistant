from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import dwani

# Configure Dwani API keys
dwani.api_key = os.getenv("DWANI_API_KEY")
dwani.api_base = os.getenv("DWANI_API_BASE_URL")

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def api_chat():
    prompt = request.json.get("message", "")
    try:
        # Chat API: translate or respond in Kannada
        response = dwani.Chat.create(prompt=prompt, src_lang="eng_Latn", tgt_lang="kan_Knda")
        reply_text = response.get("response", "No response")

        # Generate speech audio from the Kannada reply text
        audio_bytes = dwani.Audio.speech(input=reply_text, response_format="mp3")
        audio_path = "output.mp3"
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)

        return jsonify({"reply": reply_text, "audioUrl": "http://localhost:3001/api/audio"})
    except Exception as e:
        return jsonify({"reply": f"Error: {str(e)}"}), 500

@app.route("/api/audio", methods=["GET"])
def get_audio():
    return send_file("output.mp3", mimetype="audio/mpeg")

@app.route("/api/route", methods=["POST"])
def get_route():
    data = request.json
    origin = data.get("origin")
    destination = data.get("destination")

    if not origin or not destination:
        return jsonify({"error": "Origin and destination are required"}), 400

    # For demonstration, return mock route data
    # In production, integrate a real map API (like Google Maps Directions API)
    mock_routes = [
        {
            "distance": 12.5,
            "duration": 25,
            "instructions": f"Start from {origin}, travel straight to {destination} via Main Street."
        },
        {
            "distance": 15.0,
            "duration": 30,
            "instructions": f"Take the highway from {origin} to {destination}, exit at Central Ave."
        }
    ]

    return jsonify({"routes": mock_routes})

if __name__ == "__main__":
    app.run(port=3001, debug=True)
