import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Image, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string, image?: File) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;
    
    onSendMessage(message.trim(), selectedImage || undefined);
    setMessage("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="p-4 border-t bg-card/95 backdrop-blur-sm">
      {imagePreview && (
        <div className="relative mb-3 inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-w-32 max-h-32 rounded-lg border border-border"
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aura about sustainable living, share an image, or get eco-friendly suggestions..."
            className="min-h-[50px] max-h-32 resize-none pr-12 rounded-xl border-border focus:ring-primary"
            disabled={isLoading}
          />
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-accent"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        
        <Button 
          type="submit" 
          size="lg"
          className={cn(
            "h-[50px] px-6 rounded-xl bg-primary hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          disabled={(!message.trim() && !selectedImage) || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Card>
  );
};