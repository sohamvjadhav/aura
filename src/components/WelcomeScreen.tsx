import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Recycle, Lightbulb, Camera, MessageCircle } from "lucide-react";
import sustainabilityHero from "@/assets/sustainability-hero.jpg";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onExampleClick: (message: string) => void;
}

interface Prompt {
  icon: keyof typeof icons;
  title: string;
  prompt: string;
}

const icons = {
  Recycle,
  Lightbulb,
  Leaf,
};

export const WelcomeScreen = ({ onExampleClick }: WelcomeScreenProps) => {
  const [examplePrompts, setExamplePrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((prompts: Prompt[]) => {
        const shuffled = prompts.sort(() => 0.5 - Math.random());
        setExamplePrompts(shuffled.slice(0, 4));
      });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 nature-pattern">
      <div className="w-full max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-6 md:mb-8">
          <img 
            src={sustainabilityHero} 
            alt="Sustainable living" 
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex items-end">
            <div className="p-4 md:p-8 text-white">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Leaf className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Aura</h1>
                  <p className="text-base md:text-lg opacity-90">Sustainability Copilot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center space-y-3 md:space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">
            Welcome to your AI sustainability guide
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            I'm here to be helpful in sustainability to everything you say.
            Ask me anything about eco-friendly living, upload photos for sustainability insights, 
            or explore topics through an environmental lens.
          </p>
        </div>

        {/* Example Prompts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto px-4">
          {examplePrompts.map((example, index) => {
            const Icon = icons[example.icon];
            return (
              <Card 
                key={index}
                className="p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50 group"
                onClick={() => onExampleClick(example.prompt)}
              >
                <div className="flex flex-col items-center text-center space-y-2 md:space-y-3">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {Icon && <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />}
                  </div>
                  <h3 className="font-medium text-sm md:text-base text-foreground">{example.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {example.prompt}
                  </p>
                </div>
              </Card>
            );
          })}
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
