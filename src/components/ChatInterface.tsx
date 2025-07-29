import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { RotateCcw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, image?: File): Promise<string> => {
    if (!apiKey) {
      throw new Error("Please enter your Google AI API key first");
    }

    // Prepare the request body
    const parts: any[] = [
      {
        text: `As Aura, the Sustainability Copilot, respond to this message with practical, encouraging sustainability advice. Always reframe topics through an environmental lens and provide actionable suggestions. Message: "${userMessage}"`
      }
    ];

    // If there's an image, convert it to base64 and add to parts
    if (image) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(image);
      });

      parts.push({
        inline_data: {
          mime_type: image.type,
          data: base64
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }

    return data.candidates[0].content.parts[0].text;
  };

  const handleSendMessage = async (content: string, image?: File) => {
    if (!content.trim() && !image) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      content: content || (image ? "📷 Image uploaded" : ""),
      sender: 'user',
      timestamp: new Date(),
      image: image ? URL.createObjectURL(image) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(content, image);
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google AI API key first to start chatting.",
        variant: "destructive"
      });
      return;
    }
    handleSendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "Your conversation has been reset."
    });
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
      toast({
        title: "API Key Set",
        description: "You can now start chatting with Aura!"
      });
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 nature-pattern">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Setup Required</h2>
            <p className="text-sm text-muted-foreground">
              Enter your Google AI API key to start chatting with Aura
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Google AI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApiKeySubmit()}
            />
          </div>
          
          <Button 
            onClick={handleApiKeySubmit}
            className="w-full"
            disabled={!apiKey.trim()}
          >
            Start Chatting
          </Button>
          
          <div className="text-xs text-muted-foreground text-center">
            <p>Get your API key from the Google AI Studio dashboard.</p>
            <p>Your key is stored locally and never shared.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🌱</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Aura</h1>
              <p className="text-xs text-muted-foreground">Sustainability Copilot</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiKeyInput(true)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {messages.length === 0 ? (
          <WelcomeScreen onExampleClick={handleExampleClick} />
        ) : (
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 p-4 bg-card rounded-2xl border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Aura is thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input */}
        <div className="p-4">
          <ChatInput 
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};