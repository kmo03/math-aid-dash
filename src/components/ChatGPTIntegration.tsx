import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip, Download, Trash2 } from "lucide-react";
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
    <div className="flex-1 flex flex-col">
      {/* Welcome message when no chats */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Where should we begin?
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
              I'm here to help you with your math homework. Ask me about algebra, calculus, geometry, or any other math topic!
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {getWelcomePrompts().map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto min-h-[120px] p-6 text-center justify-center rounded-xl border-0.5 border-gray-300 hover:bg-accent/50"
                    onClick={() => setInputValue(prompt.text + (prompt.math ? ` ${prompt.math}` : ''))}
                  >
                    <div className="w-full text-wrap">
                      <div className="font-medium text-sm mb-2 break-words">{prompt.text}</div>
                      {prompt.math && (
                        <div className="text-xs text-muted-foreground">
                          <MathRenderer content={prompt.math} className="text-xs" />
                        </div>
                      )}
                    </div>
                  </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Chat Messages */
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`w-full ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground px-6 py-3 rounded-full max-w-md ml-auto"
                      : "bg-transparent text-foreground"
                  }`}
                >
                  {message.sender === "ai" ? (
                    <div className="text-left">
                      <MathRenderer 
                        content={message.content}
                        className="text-base leading-relaxed"
                      />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-full">
                  <div className="bg-muted/50 px-6 py-3 rounded-full inline-block">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background">
        <div className="p-2">
          <div className="max-w-4xl mx-auto">
            {/* Math Preview */}
            <MathPreview content={inputValue} className="mb-1" />
            
            <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask anything"
                    className="pr-20 min-h-[52px] py-4 text-base rounded-2xl border-0.5 border-gray-300 focus:border-primary/50 focus:ring-0"
                    disabled={isLoading}
                    maxLength={4000}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <MathSymbolPalette onSymbolClick={handleSymbolClick} />
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      size="icon"
                      className="w-8 h-8 rounded-full"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
            </div>
            
              {/* Action buttons */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex space-x-2">
                  {messages.length > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportConversation}
                        className="text-xs rounded-xl border-0.5 border-gray-300 hover:bg-accent/50"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearConversation}
                        className="text-xs rounded-xl border-0.5 border-gray-300 hover:bg-accent/50"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Centered disclaimer */}
              <div className="flex justify-center mt-1">
                <p className="text-xs text-muted-foreground">
                  Universably can make mistakes. Check important info.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}