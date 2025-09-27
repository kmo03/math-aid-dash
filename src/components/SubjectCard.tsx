import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface SubjectCardProps {
  title: string;
  icon: LucideIcon;
  description: string;
  progress: number;
  problemCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
  color: string;
}

export function SubjectCard({
  title,
  icon: Icon,
  description,
  progress,
  problemCount,
  difficulty,
  color
}: SubjectCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-success text-success-foreground";
      case "Medium": return "bg-warning text-warning-foreground";
      case "Hard": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-hover transition-smooth group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="w-5 h-5 text-card-foreground" />
          </div>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${color.replace('bg-', 'bg-')}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {problemCount} problems
          </span>
          <Button variant="card" size="sm" className="group-hover:shadow-glow">
            Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}