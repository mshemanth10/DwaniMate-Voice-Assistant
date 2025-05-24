
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mic, Play, Users, Award, Shield, Heart } from "lucide-react";
import AIAssistantSection from "@/components/AIAssistantSection";
import TransportSection from "@/components/TransportSection";
import SchemesSection from "@/components/SchemesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DwaniMate - ದ್ವನಿಮಿತ್ರ</h1>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">ಕನ್ನಡ</Button>
              <Button variant="outline" size="sm">English</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with AI Assistant */}
      <AIAssistantSection />

      {/* Smart Transport Section */}
      <TransportSection />

      {/* Government Schemes Section */}
      <SchemesSection />
      
    </div>
  );
};

export default Index;
