import { useState, useEffect, useRef } from 'react';
import { MathRenderer } from './MathRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface MathPreviewProps {
  content: string;
  className?: string;
}

export function MathPreview({ content, className }: MathPreviewProps) {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [hasMathContent, setHasMathContent] = useState(false);

  useEffect(() => {
    // Check if content contains LaTeX math expressions
    const mathPatterns = [
      /\$\$.*?\$\$/gs,  // Display math
      /\\\[.*?\\\]/gs,  // Display math brackets
      /\$[^$]+\$/g,     // Inline math
      /\\\(.*?\\\)/g,   // Inline math brackets
    ];
    
    const hasMath = mathPatterns.some(pattern => pattern.test(content));
    setHasMathContent(hasMath);
  }, [content]);

  if (!hasMathContent || !content.trim()) {
    return null;
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsPreviewVisible(!isPreviewVisible)}
        className="mb-2"
      >
        {isPreviewVisible ? (
          <>
            <EyeOff className="w-4 h-4 mr-2" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Preview Math
          </>
        )}
      </Button>
      
      {isPreviewVisible && (
        <Card className="border-0.5 border-black rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Math Preview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="min-h-[60px] p-3 bg-muted/50 rounded-xl">
              <MathRenderer 
                content={content} 
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
