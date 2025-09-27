import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, Clock } from "lucide-react";

interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const stats: StatItem[] = [
  {
    title: "Problems Solved",
    value: "127",
    change: "+12 this week",
    icon: Target,
    color: "bg-primary text-primary-foreground"
  },
  {
    title: "Average Score",
    value: "89%",
    change: "+5% from last week",
    icon: TrendingUp,
    color: "bg-success text-success-foreground"
  },
  {
    title: "Streak Days",
    value: "7",
    change: "Current streak",
    icon: Award,
    color: "bg-warning text-warning-foreground"
  },
  {
    title: "Study Time",
    value: "12.5h",
    change: "This week",
    icon: Clock,
    color: "bg-accent text-accent-foreground"
  }
];

export function ProgressStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-hover transition-smooth">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}