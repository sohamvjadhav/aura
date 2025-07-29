import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_CONFIG, isApiConfigured } from "@/config/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const MAX_HISTORY_LENGTH = 50;

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const generateAIResponse = async (
    userMessage: string,
    currentConversationHistory: Message[],
    image?: File
  ): Promise<string> => {
    if (!isApiConfigured()) {
      throw new Error("API key not configured. Please check the developer configuration.");
    }

    const contents: any[] = [];

    contents.push({
      role: 'user',
      parts: [{ text: API_CONFIG.SYSTEM_PROMPT }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "Okay, I understand. I will act as Aura, the Sustainability Copilot, and integrate sustainability into every topic." }]
    });

    currentConversationHistory.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    const userParts: any[] = [{ text: userMessage }];
    if (image) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(image);
      });

      userParts.push({
        inline_data: {
          mime_type: image.type,
          data: base64
        }
      });
    }
    contents.push({
      role: 'user',
      parts: userParts
    });

    const response = await fetch(`${API_CONFIG.GOOGLE_AI_ENDPOINT}?key=${API_CONFIG.GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
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

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      content: content || (image ? "📷 Image uploaded" : ""),
      sender: 'user',
      timestamp: new Date(),
      image: image ? URL.createObjectURL(image) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    
    setConversationHistory(prev => {
      const newHistory = [...prev, userMessage];
      return newHistory.slice(Math.max(newHistory.length - MAX_HISTORY_LENGTH, 0));
    });

    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(content, conversationHistory, image);
      
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => {
        const newHistory = [...prev, aiMessage];
        return newHistory.slice(Math.max(newHistory.length - MAX_HISTORY_LENGTH, 0));
      });

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
    if (!isApiConfigured()) {
      toast({
        title: "Configuration Required",
        description: "The API is not yet configured. Please check the developer setup.",
        variant: "destructive"
      });
      return;
    }
    handleSendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setConversationHistory([]);
    toast({
      title: "Chat Cleared",
      description: "Your conversation has been reset."
    });
  };

  const showConfigWarning = !isApiConfigured();

  return (
    <div className="min-h-screen flex flex-col bg-background">
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

      {showConfigWarning && (
        <div className="max-w-4xl mx-auto px-4 py-2">
          <Alert className="border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Developer Setup Required:</strong> Please configure your Google AI API key in <code>src/config/api.ts</code> to enable the chatbot.
              <br />
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Get your API key from Google AI Studio →
              </a>
            </AlertDescription>
          </Alert>
        </div>
      )}

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
