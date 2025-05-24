import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Bus, RefreshCw } from "lucide-react";

const TransportSection = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert location name to coordinates using Nominatim
  const geocodeLocation = async (location) => {
    if (!location) return null;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return `${lat},${lon}`;
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  // Use user's current location
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOrigin(`${latitude},${longitude}`);
      },
      (error) => {
        alert("Unable to retrieve your location.");
        console.error(error);
      }
    );
  };

  // Find routes between origin and destination
  const handleFindRoutes = async () => {
    setError("");
    if (!origin || !destination) {
      setError("Please provide both origin and destination.");
      return;
    }

    setLoading(true);
    setRoutes([]);

    try {
      const isOriginCoords = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(origin);
      const isDestinationCoords = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(destination);

      const originCoords = isOriginCoords ? origin : await geocodeLocation(origin);
      const destinationCoords = isDestinationCoords ? destination : await geocodeLocation(destination);

      if (!originCoords || !destinationCoords) {
        setError("Could not find coordinates for origin or destination.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3001/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: originCoords, destination: destinationCoords }),
      });

      if (!res.ok) throw new Error("Route API failed");

      const data = await res.json();
      setRoutes(data.routes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch route details.");
    } finally {
      setLoading(false);
    }
  };

  // Swap origin and destination
  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ಸ್ಮಾರ್ಟ್ ಸಾರಿಗೆ ಮಾಹಿತಿ / Smart Transport Info
          </h2>
          <p className="text-lg text-gray-600">
            Find the best routes and timings for your journey
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bus className="w-6 h-6 text-blue-600" />
                <span>Plan Your Journey</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From / ಇಂದ</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter starting point or coordinates..."
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUseLocation} variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    My Location
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To / ಗೆ</label>
                <Input
                  placeholder="Enter destination or coordinates..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleFindRoutes}
                  disabled={loading}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {loading ? "Finding Routes..." : "Find Routes / ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ"}
                </Button>

                <Button
                  className="ml-2"
                  variant="ghost"
                  onClick={handleSwap}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Swap
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-600 mt-2" aria-live="polite">
                  {error}
                </p>
              )}

              {/* Dynamic Route Results */}
              <div className="mt-6 space-y-3">
                {routes.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900">Routes:</h4>
                    {routes.map((route, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium">Distance: {route.distance} km</p>
                        <p className="text-sm text-gray-600">Duration: {route.duration} mins</p>
                        {route.instructions && (
                          <p className="text-xs text-gray-500">{route.instructions}</p>
                        )}
                        {route.steps &&
                          route.steps.map((step, i) => (
                            <p key={i} className="text-xs text-gray-600">
                              → {step}
                            </p>
                          ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TransportSection;
