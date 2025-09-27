import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  content: string;
  className?: string;
}

export function MathRenderer({ content, className }: MathRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Process the content to render LaTeX
      let processedContent = content;
      
      // Render display math ($$...$$)
      processedContent = processedContent.replace(
        /\$\$(.*?)\$\$/g,
        (match, latex) => {
          try {
            return katex.renderToString(latex, {
              displayMode: true,
              throwOnError: false,
              trust: false,
            });
          } catch (error) {
            console.error('KaTeX display math error:', error);
            return match;
          }
        }
      );

      // Render inline math ($...$)
      processedContent = processedContent.replace(
        /\$([^$]+)\$/g,
        (match, latex) => {
          try {
            return katex.renderToString(latex, {
              displayMode: false,
              throwOnError: false,
              trust: false,
            });
          } catch (error) {
            console.error('KaTeX inline math error:', error);
            return match;
          }
        }
      );

      // Convert newlines to <br> tags for better formatting
      processedContent = processedContent.replace(/\n/g, '<br>');

      containerRef.current.innerHTML = processedContent;
    }
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className={`math-renderer ${className || ''}`}
    />
  );
}