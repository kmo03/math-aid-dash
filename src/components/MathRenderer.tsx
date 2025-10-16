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

        // Handle simple HTML formatting
        // Bold text
        processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text
        processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Headers (process before newline conversion)
        processedContent = processedContent.replace(/### (.*?)(?=\n|$)/g, '<h3 style="font-size: 1.125rem; font-weight: 600; margin: 1rem 0 0.5rem 0;">$1</h3>');
        processedContent = processedContent.replace(/## (.*?)(?=\n|$)/g, '<h2 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem 0;">$1</h2>');
        processedContent = processedContent.replace(/# (.*?)(?=\n|$)/g, '<h1 style="font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem 0;">$1</h1>');
        
        // Convert double newlines to paragraph breaks, single newlines to line breaks
        processedContent = processedContent.replace(/\n\n/g, '<p style="margin: 0.75rem 0;"></p>');
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
        lineHeight: '1.5',
      }}
    />
  );
}