import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, FileText } from "lucide-react";

const SchemesSection = () => {
  const schemes = [
    {
      name: "PM-Kisan Samman Nidhi",
      nameKannada: "ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
      description: "Financial support to farmers",
      descriptionKannada: "ರೈತರಿಗೆ ಆರ್ಥಿಕ ಸಹಾಯ",
      amount: "₹6,000/year",
      eligibility: "Small & marginal farmers",
      documents: ["Aadhaar Card", "Bank Details", "Land Records"],
      category: "Agriculture",
      isNew: false,
      url: "https://pmkisan.gov.in/"
    },
    {
      name: "Ayushman Bharat",
      nameKannada: "ಆಯುಷ್ಮಾನ್ ಭಾರತ್",
      description: "Health insurance for families",
      descriptionKannada: "ಕುಟುಂಬಗಳಿಗೆ ಆರೋಗ್ಯ ವಿಮೆ",
      amount: "₹5 Lakh coverage",
      eligibility: "Below poverty line families",
      documents: ["Ration Card", "Aadhaar Card", "Income Certificate"],
      category: "Healthcare",
      isNew: false,
      url: "https://www.pmjay.gov.in/"
    },
    {
      name: "Digital Karnataka Initiative",
      nameKannada: "ಡಿಜಿಟಲ್ ಕರ್ನಾಟಕ ಉಪಕ್ರಮ",
      description: "Digital literacy program",
      descriptionKannada: "ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ ಕಾರ್ಯಕ್ರಮ",
      amount: "Free training",
      eligibility: "All citizens above 18",
      documents: ["Aadhaar Card", "Mobile Number"],
      category: "Education",
      isNew: true,
      url: "https://digital.karnataka.gov.in/"
    }
  ];

  const playAudio = (text: string) => {
    // Text-to-speech functionality would be implemented here
    console.log("Playing audio for:", text);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು / Government Schemes
          </h2>
          <p className="text-lg text-gray-600">
            Discover and apply for government benefits and schemes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {scheme.name}
                      <div className="text-sm font-normal text-gray-600 mt-1">
                        {scheme.nameKannada}
                      </div>
                    </CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{scheme.category}</Badge>
                      {scheme.isNew && <Badge className="bg-green-500">New</Badge>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => playAudio(scheme.nameKannada)}
                    className="ml-2"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-sm">
                  <div>{scheme.description}</div>
                  <div className="text-gray-500 mt-1">{scheme.descriptionKannada}</div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 text-lg">{scheme.amount}</h4>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Eligibility:</h5>
                  <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Required Documents:</h5>
                  <div className="space-y-1">
                    {scheme.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <FileText className="w-3 h-3 mr-2" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full">
                      Apply Now
                    </Button>
                  </a>
                  <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
       <div className="text-center mt-8">
        <a
          href="https://services.india.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="lg">
            View All Schemes / ಎಲ್ಲಾ ಯೋಜನೆಗಳನ್ನು ನೋಡಿ
          </Button>
        </a>
      </div>

      </div>
    </section>
  );
};

export default SchemesSection;
