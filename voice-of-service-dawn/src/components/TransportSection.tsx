"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Bus } from "lucide-react";
import { toast } from "@/components/ui/use-toast"; // You can use Sonner or your custom toast

const TransportSection = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const isValidCoords = (value) => /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(value.trim());

  const geocodeLocation = async (location) => {
    if (!location) return null;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data?.length > 0) {
        const { lat, lon } = data[0];
        return `${lat},${lon}`;
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Error", description: "Geolocation not supported." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setOrigin(`${latitude},${longitude}`);
      },
      (err) => {
        console.error(err);
        toast({ title: "Error", description: "Unable to get your location." });
      }
    );
  };

  const handleFindRoutes = async () => {
  if (!origin || !destination) {
    toast({ title: "Missing Info", description: "Please enter both origin and destination." });
    return;
  }

  setLoading(true);
  setRoutes([]);

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination }),
    });

    const result = await res.json();

    if (!result.data) {
      toast({ title: "No Routes", description: "No bus routes found for this journey." });
      return;
    }

    // Assuming the response is a JSON string with route details
    const routesData = JSON.parse(result.data);
    setRoutes(routesData.routes);
  } catch (err) {
    console.error(err);
    toast({ title: "Error", description: "Something went wrong while fetching routes." });
  } finally {
    setLoading(false);
  }
};


  const generateGoogleMapsLink = (from, to) => {
    return `https://www.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`;
  };

  const isYelahankaToMajestic =
    origin.toLowerCase().includes("yelahanka") &&
    destination.toLowerCase().includes("majestic");

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From / ಇಂದ
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To / ಗೆ
                </label>
                <Input
                  placeholder="Enter destination or coordinates..."
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleFindRoutes}
                disabled={loading}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {loading ? "Finding Routes..." : "Find Routes / ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ"}
              </Button>

              <div className="mt-6 space-y-3">
                {routes.length > 0 && (
                  <>
                    <h4 className="font-semibold text-gray-900">Bus Routes:</h4>
                    {routes.map((route, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium">Distance: {route.distance}</p>
                        <p className="text-sm text-gray-600">Duration: {route.duration}</p>
                        <p className="text-xs text-gray-500">{route.instructions}</p>
                      </div>
                    ))}

                    <a
                      href={generateGoogleMapsLink(origin, destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline text-blue-700 block mt-2"
                    >
                      View route on Google Maps
                    </a>
                  </>
                )}

                {!routes.length && origin && destination && (
                  <div className="text-sm text-blue-600 mt-4">
                    <a
                      href={generateGoogleMapsLink(origin, destination)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View route on Google Maps
                    </a>
                  </div>
                )}

                {isYelahankaToMajestic && (
                  <div className="bg-yellow-100 text-sm p-3 rounded-md mt-3">
                    <strong>BMTC Update:</strong> Direct buses from Yelahanka to Majestic run every 15–20 mins via
                    route no. 283/285. Estimated travel time: <strong>1 hour 12 minutes</strong>.
                  </div>
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
