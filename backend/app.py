from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import dwani
import requests

# Configure Dwani API keys
dwani.api_key = os.getenv("DWANI_API_KEY")
dwani.api_base = os.getenv("DWANI_API_BASE_URL")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/api/chat", methods=["POST"])
def api_chat():
    prompt = request.json.get("message", "")
    try:
        # Chat API: translate or respond in Kannada
        response = dwani.Chat.create(prompt=prompt+"if it is not related government services, transport routes, or schemes dont respond", src_lang="eng_Latn", tgt_lang="kan_Knda")
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

    # Google Maps Directions API endpoint
    endpoint = "https://maps.googleapis.com/maps/api/directions/json"

    params = {
        "origin": origin,
        "destination": destination,
        "mode": "transit",           # use transit mode to get bus info
        "transit_mode": "bus",       # limit to bus only
        "key": GOOGLE_MAPS_API_KEY,
        "language": "kn"             # Kannada language if needed
    }

    response = requests.get(endpoint, params=params)
    if response.status_code != 200:
        return jsonify({"error": "Failed to get data from Google Maps"}), 500

    data = response.json()

    # Extract useful info from Google response
    routes = []
    for route in data.get("routes", []):
        legs = route.get("legs", [])
        for leg in legs:
            steps = leg.get("steps", [])
            bus_steps = []
            for step in steps:
                travel_mode = step.get("travel_mode", "")
                if travel_mode == "TRANSIT":
                    transit_details = step.get("transit_details", {})
                    bus_line = transit_details.get("line", {})
                    bus_number = bus_line.get("short_name", "N/A")
                    arrival_stop = transit_details.get("arrival_stop", {}).get("name", "")
                    departure_stop = transit_details.get("departure_stop", {}).get("name", "")
                    arrival_time = transit_details.get("arrival_time", {}).get("text", "")
                    departure_time = transit_details.get("departure_time", {}).get("text", "")

                    bus_steps.append({
                        "bus_number": bus_number,
                        "arrival_stop": arrival_stop,
                        "departure_stop": departure_stop,
                        "arrival_time": arrival_time,
                        "departure_time": departure_time,
                        "instructions": step.get("html_instructions", ""),
                        "duration": step.get("duration", {}).get("text", ""),
                        "num_stops": transit_details.get("num_stops", 0)
                    })

            routes.append({
                "summary": route.get("summary", ""),
                "bus_steps": bus_steps,
                "distance": leg.get("distance", {}).get("text", ""),
                "duration": leg.get("duration", {}).get("text", "")
            })

    return jsonify({"routes": routes})

if __name__ == "__main__":
    app.run(port=3001, debug=True)
