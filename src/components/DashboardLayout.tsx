import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  MessageCircle, 
  User,
  Bell,
  Settings
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">MathAssist</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-card border-r border-border shadow-card min-h-screen">
          <nav className="p-4 space-y-2">
            <Button variant="default" className="w-full justify-start">
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="w-4 h-4 mr-3" />
              Subjects
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <TrendingUp className="w-4 h-4 mr-3" />
              Progress
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageCircle className="w-4 h-4 mr-3" />
              AI Assistant
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}