import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Eye } from "lucide-react";

interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "completed" | "pending" | "overdue";
  score?: number;
  problemCount: number;
}

const homeworkData: HomeworkItem[] = [
  {
    id: "1",
    title: "Quadratic Equations Practice",
    subject: "Algebra",
    dueDate: "2024-01-15",
    status: "completed",
    score: 92,
    problemCount: 15
  },
  {
    id: "2",
    title: "Triangle Properties",
    subject: "Geometry",
    dueDate: "2024-01-18",
    status: "pending",
    problemCount: 12
  },
  {
    id: "3",
    title: "Limits and Continuity",
    subject: "Calculus",
    dueDate: "2024-01-12",
    status: "overdue",
    problemCount: 20
  }
];

export function RecentHomework() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending": return <Clock className="w-4 h-4 text-warning" />;
      case "overdue": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "pending": return "bg-warning text-warning-foreground";
      case "overdue": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Recent Homework
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {homeworkData.map((homework) => (
          <div 
            key={homework.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:shadow-card transition-smooth"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(homework.status)}
              <div>
                <h4 className="font-medium text-foreground">{homework.title}</h4>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{homework.subject}</span>
                  <span>•</span>
                  <span>{homework.problemCount} problems</span>
                  {homework.score && (
                    <>
                      <span>•</span>
                      <span className="text-success font-medium">{homework.score}%</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(homework.status)}>
                {homework.status}
              </Badge>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full">
          View All Homework
        </Button>
      </CardContent>
    </Card>
  );
}