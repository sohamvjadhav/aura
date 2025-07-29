import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Leaf, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div className={cn(
      "flex w-full gap-3 chat-message",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 bg-primary">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <Card className={cn(
        "max-w-[80%] p-4 rounded-2xl shadow-sm",
        isUser 
          ? "bg-primary text-primary-foreground ml-auto" 
          : "bg-card border-border"
      )}>
        {message.image && (
          <img 
            src={message.image} 
            alt="User uploaded" 
            className="w-full max-w-xs rounded-lg mb-3"
          />
        )}
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : ""
        )}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </Card>

      {isUser && (
        <Avatar className="h-8 w-8 bg-secondary">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
