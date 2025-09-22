import { memo } from "react";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: { role: string; content: string };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white flex-shrink-0">
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        <div className={`mx-2 py-2 px-4 rounded-lg ${isUser ? "bg-green-100 dark:bg-green-900 text-gray-800 dark:text-gray-200 rounded-tr-none" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"}`}>
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
}

export default memo(ChatMessage);
