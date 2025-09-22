import { useState } from "react";
import { Leaf, Recycle, Sun, Wind } from "lucide-react";

interface WelcomeScreenProps {
  onExampleClick: (message: string) => void;
}

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const examplePrompts = [
    {
      icon: Leaf,
      text: "How can I reduce my carbon footprint at home?"
    },
    {
      icon: Recycle,
      text: "What are some sustainable alternatives to plastic?"
    },
    {
      icon: Sun,
      text: "How do I start a compost bin?"
    },
    {
      icon: Wind,
      text: "What renewable energy options are available for homeowners?"
    }
  ];

  const handlePromptClick = (text: string) => {
    setIsAnimating(true);
    onExampleClick(text);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-800 dark:text-green-400">
          Aura - Your Sustainability Copilot
        </h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Ask me anything about sustainable living, eco-friendly practices, and environmental conservation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {examplePrompts.map((prompt, index) => {
            const Icon = prompt.icon;
            return (
              <div 
                key={index}
                className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${isAnimating ? "animate-pulse" : ""}`}
                onClick={() => handlePromptClick(prompt.text)}
              >
                <div className="flex items-center mb-2">
                  <Icon className="mr-2 text-green-600 dark:text-green-400" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">Try this</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{prompt.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
