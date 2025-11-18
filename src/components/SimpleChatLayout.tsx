import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SimpleChatLayoutProps {
  children: ReactNode;
}

const chatHistory: string[] = [];

const subjects = [
  { id: 'math', name: 'Maths' },
  { id: 'physics', name: 'Physics' },
  { id: 'it', name: 'IT' },
];

export function SimpleChatLayout({ children }: SimpleChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('math');

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-56 border-r border-border/10 flex flex-col fixed left-0 top-0 h-screen z-10">
          {/* Header */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="font-medium text-foreground">Universably</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 hover:bg-transparent"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
            </div>
          
          <Button variant="ghost" className="w-full justify-start hover:bg-transparent text-muted-foreground hover:text-foreground">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New chat
          </Button>
        </div>

        {/* Subject Tabs */}
        <div className="px-6 space-y-1 border-b border-border/10 pb-4">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant="ghost"
              className={`w-full justify-start text-sm hover:bg-transparent ${
                selectedSubject === subject.id 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setSelectedSubject(subject.id)}
            >
              {subject.name}
            </Button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-1">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-transparent h-auto p-2"
                >
                  <div className="truncate text-left">{chat}</div>
                </Button>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-xs py-12">
                <p>No chats yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-4 border-t border-border/10 space-y-1">
          <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-transparent">
            <User className="w-3 h-3 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-xs text-muted-foreground hover:text-foreground hover:bg-transparent">
            <Settings className="w-3 h-3 mr-2" />
            Settings
          </Button>
        </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
        {/* Sidebar Toggle Button */}
        {!sidebarOpen && (
          <div className="fixed top-4 left-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 hover:bg-transparent"
              onClick={() => setSidebarOpen(true)}
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}