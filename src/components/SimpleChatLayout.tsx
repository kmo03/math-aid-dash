import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  Search, 
  BookOpen, 
  Calculator,
  PlusCircle,
  User,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface SimpleChatLayoutProps {
  children: ReactNode;
}

const chatHistory = [
  "Quadratic equations help",
  "Geometry proofs explained", 
  "Calculus derivatives",
  "Statistics homework",
  "Trigonometry identities"
];

export function SimpleChatLayout({ children }: SimpleChatLayoutProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">MathGPT</span>
          </div>
          
          <Button variant="outline" className="w-full justify-start">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search chats"
              className="pl-9"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
            <BookOpen className="w-4 h-4 mr-2" />
            Library
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {chatHistory.map((chat, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 h-auto p-2"
              >
                <div className="truncate">{chat}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <PlusCircle className="w-4 h-4 mr-2" />
            New project
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span className="text-sm text-muted-foreground">Alex</span>
            </div>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <Settings className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}