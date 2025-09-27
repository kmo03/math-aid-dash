import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip } from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const messageSchema = z.object({
  message: z.string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(4000, { message: "Message must be less than 4000 characters" })
});

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatGPTIntegration() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    // Validate input
    const validation = messageSchema.safeParse({ message: inputValue });
    if (!validation.success) {
      toast({
        title: "Invalid message",
        description: validation.error.issues[0].message,
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      console.log('Calling ChatGPT API with message:', messageToSend);
      
      const { data: functionData, error: functionError } = await supabase.functions.invoke('chat-gpt', {
        body: { message: messageToSend }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to get AI response");
      }

      if (!functionData || !functionData.response) {
        throw new Error("No response received from AI");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: functionData.response,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('ChatGPT API error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getWelcomePrompts = () => [
    "Help me solve x² + 5x - 6 = 0",
    "Explain derivatives in calculus",
    "Help with triangle proofs", 
    "Explain probability concepts"
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Welcome message when no chats */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              What's on the agenda today?
            </h1>
            <p className="text-muted-foreground mb-6">
              I'm here to help you with your math homework. Ask me about algebra, calculus, geometry, or any other math topic!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {getWelcomePrompts().map((prompt, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => setInputValue(prompt)}
                >
                  <div>
                    <div className="font-medium text-sm">{prompt.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="text-xs text-muted-foreground">{prompt.split(' ').slice(3).join(' ')}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Chat Messages */
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.sender === "ai" ? (
                  <MathRenderer 
                    content={message.content}
                    className="text-sm leading-relaxed"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border">
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me any math question..."
                  className="pr-20 min-h-[44px] py-3"
                  disabled={isLoading}
                  maxLength={4000}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon" 
                    className="w-8 h-8"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              MathGPT can make mistakes. Check important info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}