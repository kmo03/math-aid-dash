import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { MathRenderer } from "./MathRenderer";
import { MathSymbolPalette } from "./MathSymbolPalette";
import { MathPreview } from "./MathPreview";
import { toast } from "@/hooks/use-toast";
import { useConversation } from "@/hooks/useConversation";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const messageSchema = z.object({
  message: z.string()
    .trim()
    .min(1, { message: "Message cannot be empty" })
    .max(4000, { message: "Message must be less than 4000 characters" })
});


export function ChatGPTIntegration() {
  const { 
    messages, 
    setMessages, 
    addMessage, 
    clearConversation, 
    exportConversation, 
    isLoading, 
    setIsLoading 
  } = useConversation();
  const [inputValue, setInputValue] = useState("");

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

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user" as const,
      timestamp: new Date()
    };

    addMessage(userMessage);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      console.log('Calling edge function with message:', messageToSend);
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('chat-gpt', {
        body: { 
          message: messageToSend,
          conversationHistory: messages
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      console.log('Edge function response:', data);
      
      const aiResponse = data?.response;
      
      if (!aiResponse) {
        throw new Error('No response received from AI');
      }

      console.log('AI response received:', aiResponse);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai' as const,
        timestamp: new Date(),
      };

      addMessage(aiMessage);
    } catch (error) {
      console.error('OpenAI API error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
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
    { text: "Help me solve", math: "x^2 + 5x - 6 = 0" },
    { text: "Explain derivatives in calculus", math: null },
    { text: "Help with triangle proofs", math: null }, 
    { text: "Explain probability concepts", math: null }
  ];

  const handleSymbolClick = (symbol: string) => {
    setInputValue(prev => prev + symbol);
  };

  const handleClearConversation = () => {
    clearConversation();
    toast({
      title: "Conversation cleared",
      description: "Your chat history has been cleared."
    });
  };

  const handleExportConversation = () => {
    exportConversation();
    toast({
      title: "Conversation exported",
      description: "Your conversation has been downloaded as a text file."
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-12">
              <h2 className="text-lg font-medium text-foreground mb-2">
                Ask anything
              </h2>
              <p className="text-sm text-muted-foreground">
                Math, physics, or computer science
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
              {getWelcomePrompts().map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(prompt.text + (prompt.math ? `: ${prompt.math}` : ''))}
                  className="p-3 text-left border border-border/20 hover:border-border/40 transition-colors text-sm"
                >
                  <p className="text-foreground">{prompt.text}</p>
                  {prompt.math && (
                    <div className="mt-2 text-muted-foreground">
                      <MathRenderer content={`$${prompt.math}$`} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 text-sm ${
                  message.sender === "user"
                    ? "bg-foreground text-background"
                    : "text-foreground"
                }`}
              >
                <MathRenderer content={message.content} />
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-4 py-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border/10 p-6">
        <MathSymbolPalette onSymbolClick={handleSymbolClick} />
        <MathPreview content={inputValue} />
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="border-border/20 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border/40"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}