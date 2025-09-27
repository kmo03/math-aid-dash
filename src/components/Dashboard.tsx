import { DashboardLayout } from "./DashboardLayout";
import { ProgressStats } from "./ProgressStats";
import { SubjectCard } from "./SubjectCard";
import { RecentHomework } from "./RecentHomework";
import { AIChat } from "./AIChat";
import { 
  Calculator, 
  Triangle, 
  TrendingUp, 
  Sigma,
  PieChart,
  Zap
} from "lucide-react";

const subjects = [
  {
    title: "Algebra",
    icon: Calculator,
    description: "Linear equations, quadratics, polynomials, and algebraic expressions",
    progress: 78,
    problemCount: 45,
    difficulty: "Medium" as const,
    color: "bg-primary"
  },
  {
    title: "Geometry", 
    icon: Triangle,
    description: "Shapes, angles, proofs, and spatial relationships",
    progress: 65,
    problemCount: 32,
    difficulty: "Easy" as const,
    color: "bg-success"
  },
  {
    title: "Calculus",
    icon: TrendingUp,
    description: "Limits, derivatives, integrals, and differential equations",
    progress: 42,
    problemCount: 28,
    difficulty: "Hard" as const,
    color: "bg-destructive"
  },
  {
    title: "Statistics",
    icon: PieChart,
    description: "Data analysis, probability, and statistical inference",
    progress: 88,
    problemCount: 38,
    difficulty: "Medium" as const,
    color: "bg-warning"
  },
  {
    title: "Trigonometry",
    icon: Zap,
    description: "Sine, cosine, tangent functions and their applications",
    progress: 55,
    problemCount: 25,
    difficulty: "Medium" as const,
    color: "bg-accent"
  },
  {
    title: "Pre-Calculus",
    icon: Sigma,
    description: "Functions, sequences, series, and mathematical modeling",
    progress: 73,
    problemCount: 41,
    difficulty: "Medium" as const,
    color: "bg-primary-glow"
  }
];

export function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
          <p className="text-primary-foreground/90">
            Ready to tackle some math problems? You've solved 12 problems this week. Keep it up!
          </p>
        </div>

        {/* Progress Stats */}
        <ProgressStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subjects Grid */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Your Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject, index) => (
                <div key={subject.title} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <SubjectCard {...subject} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentHomework />
            <AIChat />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}