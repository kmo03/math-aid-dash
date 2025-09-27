import { ReactNode } from "react";

interface CenteredLayoutProps {
  children: ReactNode;
}

export function CenteredLayout({ children }: CenteredLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}