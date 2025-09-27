import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Users, TrendingUp, Zap } from "lucide-react";
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
    {
      text: "Looking for the most relevant answers?",
      subtext: "Get precise help with your specific math problems",
      icon: Search,
      prompt: "Help me understand this math concept step by step"
    },
    {
      text: "Too much data to analyze?", 
      subtext: "Break down complex problems into manageable parts",
      icon: TrendingUp,
      prompt: "Help me organize and solve this complex math problem"
    },
    {
      text: "Need the latest info?",
      subtext: "Get current methods and best practices",
      icon: Zap,
      prompt: "What's the best approach to solve this type of problem?"
    },
    {
      text: "Want everything connected?",
      subtext: "See how different math concepts relate",
      icon: Users,
      prompt: "How does this concept connect to other areas of math?"
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Welcome message when no chats */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-semibold text-foreground mb-4">
                Hello, Marc
              </h1>
              <p className="text-2xl text-muted-foreground">
                Find What Matters, Faster.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {getWelcomePrompts().map((promptObj, index) => {
                const IconComponent = promptObj.icon;
                return (
                  <div
                    key={index}
                    className="group bg-card hover:bg-gradient-card border border-border rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:shadow-card hover:scale-[1.02]"
                    onClick={() => setInputValue(promptObj.prompt)}
                  >
                    <div className="h-32 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          {promptObj.text}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {promptObj.subtext}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:bg-accent-foreground/10 transition-colors">
                          <IconComponent className="w-5 h-5 text-accent-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="w-full h-14 pl-6 pr-14 text-base bg-card border border-border rounded-full shadow-card focus:shadow-hover transition-shadow"
              disabled={isLoading}
              maxLength={4000}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-foreground hover:bg-foreground/90 text-background"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            AI-generated results are based on available data and may not always be 100% accurate.
          </p>
        </div>
      </div>
    </div>
  );
}