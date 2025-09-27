import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function SimpleMathChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'd be happy to help you with that math problem! Let me break it down step by step for you. Could you please provide more details about the specific problem you're working on?",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <Button 
                variant="outline" 
                className="h-auto p-4 text-left justify-start"
                onClick={() => setInputValue("Help me solve x² + 5x - 6 = 0")}
              >
                <div>
                  <div className="font-medium text-sm">Solve equation</div>
                  <div className="text-xs text-muted-foreground">Quadratic equations</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 text-left justify-start"
                onClick={() => setInputValue("Explain derivatives in calculus")}
              >
                <div>
                  <div className="font-medium text-sm">Learn calculus</div>
                  <div className="text-xs text-muted-foreground">Derivatives & limits</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 text-left justify-start"
                onClick={() => setInputValue("Help with triangle proofs")}
              >
                <div>
                  <div className="font-medium text-sm">Geometry proofs</div>
                  <div className="text-xs text-muted-foreground">Triangles & angles</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 text-left justify-start"
                onClick={() => setInputValue("Explain probability concepts")}
              >
                <div>
                  <div className="font-medium text-sm">Statistics help</div>
                  <div className="text-xs text-muted-foreground">Probability & data</div>
                </div>
              </Button>
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
                <p className="text-sm leading-relaxed">{message.content}</p>
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
      <div className="p-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="pr-20 min-h-[44px] py-3"
                disabled={isLoading}
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
  );
}