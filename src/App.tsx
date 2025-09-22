import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatInterface } from "./components/ChatInterface";

const queryClient = new QueryClient();

function App() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const handleExampleClick = (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        {messages.length === 0 ? (
          <WelcomeScreen onExampleClick={handleExampleClick} />
        ) : (
          <ChatInterface messages={messages} setMessages={setMessages} />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
