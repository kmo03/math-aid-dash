import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  Search, 
  BookOpen, 
  PlusCircle,
  User,
  Settings,
  MoreHorizontal,
  Calculator,
  Atom,
  Laptop,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface SimpleChatLayoutProps {
  children: ReactNode;
}

const chatHistory: string[] = [];

const subjects = [
  { id: 'math', name: 'Maths', icon: Calculator },
  { id: 'physics', name: 'Physics', icon: Atom },
  { id: 'it', name: 'IT', icon: Laptop },
];

export function SimpleChatLayout({ children }: SimpleChatLayoutProps) {
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('math');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-muted/30 border-r border-gray-300 flex flex-col fixed left-0 top-0 h-screen z-10">
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground text-lg">Universably</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          
          <Button variant="outline" className="w-full justify-start hover:bg-accent/50 rounded-xl border-0.5 border-black mb-4">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New chat
          </Button>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search chats"
              className="pl-9 rounded-xl border-0.5 border-black"
            />
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="px-4 space-y-1">
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Button
                key={subject.id}
                variant={selectedSubject === subject.id ? "secondary" : "ghost"}
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl"
                onClick={() => setSelectedSubject(subject.id)}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {subject.name}
              </Button>
            );
          })}
        </div>

        {/* Chat History */}
        <div className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-1">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 h-auto p-3 rounded-xl"
                >
                  <div className="truncate text-left">{chat}</div>
                </Button>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageSquarePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No chat history yet</p>
                <p className="text-xs mt-1">Start a conversation to see it here</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl">
            <PlusCircle className="w-4 h-4 mr-2" />
            New project
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <User className="w-3 h-3" />
              </div>
              <span className="text-sm text-muted-foreground">Katleho Morethi</span>
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
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Sidebar Toggle Button */}
        {!sidebarOpen && (
          <div className="fixed top-4 left-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}