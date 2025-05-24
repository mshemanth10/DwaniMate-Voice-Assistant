import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, Volume2, Bot } from "lucide-react";

const AIAssistantSection = () => {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");
    setAudioUrl(null);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const data = await res.json();
      setResponse(data.reply || "No reply from server");
      setAudioUrl(data.audioUrl || null);
    } catch (err) {
      setResponse("Failed to get response. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  const exampleQueries = [
    { label: "Old-age Pension", query: "How to apply for old-age pension?" },
    { label: "PM-Kisan Scheme", query: "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆಗೆ ಅರ್ಜಿ ಹೇಗೆ ಸಲ್ಲಿಸುವುದು?" },
    { label: "Ration Card", query: "How to get a new ration card in Karnataka?" },
    { label: "Bus Pass", query: "ವಿದ್ಯಾರ್ಥಿ ಬಸ್ ಪಾಸ್ ಯಾವಾಗ ಮತ್ತು ಎಲ್ಲಿ ಲಭ್ಯ?" },
    { label: "Voter ID", query: "How to apply for a Voter ID online?" },
    { label: "Aadhaar Correction", query: "How can I correct my Aadhaar details?" },
    { label: "Income Certificate", query: "Where to apply for income certificate?" },
    { label: "Crop Insurance", query: "How to claim crop insurance in Karnataka?" },
    { label: "Namma Metro Timings", query: "ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಸಮಯಗಳು ಯಾವುವು?" },
    { label: "Senior Citizen ID", query: "Senior citizen ID card apply process?" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* AI Robot Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                <Bot className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full animate-bounce flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              ನಮಸ್ಕಾರ! <span className="text-blue-600">ದ್ವನಿಮಿತ್ರ</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ask me anything about government services, transport routes, or schemes in Kannada or English. 
              I'm here to help you navigate public services easily!
            </p>
          </div>

          {/* Input Section */}
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="p-6">
              <div className="flex space-x-2 mb-4">
                <Input
                  placeholder="ನನಗೆ ಸಹಾಯ ಬೇಕು... / I need help with..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                  aria-label="Send Query"
                  disabled={loading}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Response Display */}
              <div className="min-h-[4rem] p-4 bg-gray-100 rounded-md text-left text-gray-800 mb-4">
                {loading ? "Loading..." : response || "AI assistant response will appear here."}
              </div>

              {/* Audio playback */}
              {audioUrl && (
                <audio controls autoPlay className="mx-auto block">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {/* Example Queries */}
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {exampleQueries.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(item.query)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIAssistantSection;
