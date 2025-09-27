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
      let processedContent = content;
      
      try {
        // First, handle display math with $$ ... $$
        processedContent = processedContent.replace(
          /\$\$(.*?)\$\$/gs,
          (match, latex) => {
            try {
              const rendered = katex.renderToString(latex.trim(), {
                displayMode: true,
                throwOnError: false,
                trust: false,
                strict: false,
              });
              return `<div class="katex-display-wrapper">${rendered}</div>`;
            } catch (error) {
              console.warn('KaTeX display math error:', error);
              return `<div class="katex-error">$$${latex.trim()}$$</div>`;
            }
          }
        );

        // Handle display math with \[ ... \]
        processedContent = processedContent.replace(
          /\\\[(.*?)\\\]/gs,
          (match, latex) => {
            try {
              const rendered = katex.renderToString(latex.trim(), {
                displayMode: true,
                throwOnError: false,
                trust: false,
                strict: false,
              });
              return `<div class="katex-display-wrapper">${rendered}</div>`;
            } catch (error) {
              console.warn('KaTeX display math error:', error);
              return `<div class="katex-error">\\[${latex.trim()}\\]</div>`;
            }
          }
        );

        // Handle inline math with $ ... $ (but not if it's part of $$)
        processedContent = processedContent.replace(
          /(?<!\$)\$([^$]+?)\$(?!\$)/g,
          (match, latex) => {
            try {
              const rendered = katex.renderToString(latex.trim(), {
                displayMode: false,
                throwOnError: false,
                trust: false,
                strict: false,
              });
              return `<span class="katex-inline-wrapper">${rendered}</span>`;
            } catch (error) {
              console.warn('KaTeX inline math error:', error);
              return `<span class="katex-error">$${latex.trim()}$</span>`;
            }
          }
        );

        // Handle inline math with \( ... \)
        processedContent = processedContent.replace(
          /\\\((.*?)\\\)/g,
          (match, latex) => {
            try {
              const rendered = katex.renderToString(latex.trim(), {
                displayMode: false,
                throwOnError: false,
                trust: false,
                strict: false,
              });
              return `<span class="katex-inline-wrapper">${rendered}</span>`;
            } catch (error) {
              console.warn('KaTeX inline math error:', error);
              return `<span class="katex-error">\\(${latex.trim()}\\)</span>`;
            }
          }
        );

        // Convert newlines to <br> tags for better formatting
        processedContent = processedContent.replace(/\n/g, '<br>');

        containerRef.current.innerHTML = processedContent;
      } catch (error) {
        console.error('MathRenderer error:', error);
        // Fallback to plain text if rendering fails
        containerRef.current.textContent = content;
      }
    }
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className={`math-renderer ${className || ''}`}
      style={{
        lineHeight: '1.6',
      }}
    />
  );
}