import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Lightbulb, Camera, MessageCircle } from "lucide-react";
import sustainabilityHero from "@/assets/sustainability-hero.jpg";

interface WelcomeScreenProps {
  onExampleClick: (message: string) => void;
}

export const WelcomeScreen = ({ onExampleClick }: WelcomeScreenProps) => {
  const examplePrompts = [
    {
      icon: Recycle,
      title: "Waste Reduction",
      prompt: "How can I reduce waste in my daily routine?"
    },
    {
      icon: Lightbulb,
      title: "Energy Efficiency",
      prompt: "What are some simple ways to make my home more energy efficient?"
    },
    {
      icon: Leaf,
      title: "Sustainable Fashion",
      prompt: "How can I build a more sustainable wardrobe?"
    },
    {
      icon: Camera,
      title: "Product Analysis",
      prompt: "Upload a photo of a product to get sustainability insights"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 nature-pattern">
      <div className="w-full max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8">
          <img 
            src={sustainabilityHero} 
            alt="Sustainable living" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Leaf className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Aura</h1>
                  <p className="text-lg opacity-90">Sustainability Copilot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Welcome to your AI sustainability guide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            I'm here to help you make more sustainable choices in every aspect of your life. 
            Ask me anything about eco-friendly living, upload photos for sustainability insights, 
            or explore topics through an environmental lens.
          </p>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {examplePrompts.map((example, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50 group"
              onClick={() => onExampleClick(example.prompt)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <example.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground">{example.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {example.prompt}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <MessageCircle className="h-5 w-5" />
          <span>Start a conversation below to begin your sustainability journey</span>
        </div>
      </div>
    </div>
  );
};