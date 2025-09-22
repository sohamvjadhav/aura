import { useState, useRef, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ChatMessage } from "./ChatMessage";

interface ChatInterfaceProps {
  messages: Array<{ role: string; content: string }>;
  setMessages: React.Dispatch<React.SetStateAction<Array<{ role: string; content: string }>>>;
}

export function ChatInterface({ messages, setMessages }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: apiResponse, refetch } = useQuery({
    queryKey: ["chatResponse", messages],
    queryFn: async () => {
      if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
        return null;
      }

      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = `I received your message: "${messages[messages.length - 1].content}". This is a simulated response from the sustainability copilot.`;
        return response;
      } catch (error) {
        return "Sorry, I encountered an error processing your request. Please try again.";
      } finally {
        setIsLoading(false);
      }
    },
    enabled: false,
  });

  useEffect(() => {
    if (apiResponse) {
      setMessages(prev => [...prev, { role: "assistant", content: apiResponse }]);
    }
  }, [apiResponse, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === "" || isLoading) return;

    const userMessage = { role: "user", content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Trigger API call
    refetch();
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">Aura</h1>
        <button 
          onClick={handleClearChat}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Trash2 className="mr-2" size={18} />
          Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-xs md:max-w-md">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about sustainable living..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={isLoading || inputValue.trim() === ""}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
