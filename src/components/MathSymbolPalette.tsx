import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calculator, Plus, Minus, X, Divide, Equal, Pi, Sum, Integral, SquareRoot, Alpha, Beta, Gamma, Delta } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface MathSymbolPaletteProps {
  onSymbolClick: (symbol: string) => void;
}

const mathSymbols = [
  // Basic operations
  { symbol: '$+$', label: 'Plus' },
  { symbol: '$-$', label: 'Minus' },
  { symbol: '$\\times$', label: 'Times' },
  { symbol: '$\\div$', label: 'Divide' },
  { symbol: '$=$', label: 'Equals' },
  { symbol: '$\\neq$', label: 'Not equal' },
  { symbol: '$<$', label: 'Less than' },
  { symbol: '$>$', label: 'Greater than' },
  { symbol: '$\\leq$', label: 'Less or equal' },
  { symbol: '$\\geq$', label: 'Greater or equal' },
  
  // Fractions and powers
  { symbol: '$^$', label: 'Power' },
  { symbol: '$\\sqrt{}$', label: 'Square root' },
  { symbol: '$\\sqrt[n]{}$', label: 'Nth root' },
  { symbol: '$\\frac{}{}$', label: 'Fraction' },
  
  // Greek letters
  { symbol: '$\\alpha$', label: 'Alpha' },
  { symbol: '$\\beta$', label: 'Beta' },
  { symbol: '$\\gamma$', label: 'Gamma' },
  { symbol: '$\\delta$', label: 'Delta' },
  { symbol: '$\\epsilon$', label: 'Epsilon' },
  { symbol: '$\\theta$', label: 'Theta' },
  { symbol: '$\\lambda$', label: 'Lambda' },
  { symbol: '$\\mu$', label: 'Mu' },
  { symbol: '$\\pi$', label: 'Pi' },
  { symbol: '$\\sigma$', label: 'Sigma' },
  { symbol: '$\\phi$', label: 'Phi' },
  { symbol: '$\\omega$', label: 'Omega' },
  
  // Functions
  { symbol: '$\\sin$', label: 'Sine' },
  { symbol: '$\\cos$', label: 'Cosine' },
  { symbol: '$\\tan$', label: 'Tangent' },
  { symbol: '$\\log$', label: 'Logarithm' },
  { symbol: '$\\ln$', label: 'Natural log' },
  { symbol: '$\\exp$', label: 'Exponential' },
  
  // Sets and logic
  { symbol: '$\\in$', label: 'Element of' },
  { symbol: '$\\notin$', label: 'Not element of' },
  { symbol: '$\\subset$', label: 'Subset' },
  { symbol: '$\\supset$', label: 'Superset' },
  { symbol: '$\\cup$', label: 'Union' },
  { symbol: '$\\cap$', label: 'Intersection' },
  { symbol: '$\\emptyset$', label: 'Empty set' },
  { symbol: '$\\infty$', label: 'Infinity' },
  
  // Calculus
  { symbol: '$\\int$', label: 'Integral' },
  { symbol: '$\\sum$', label: 'Sum' },
  { symbol: '$\\prod$', label: 'Product' },
  { symbol: '$\\lim$', label: 'Limit' },
  { symbol: '$\\frac{d}{dx}$', label: 'Derivative' },
  { symbol: '$\\frac{\\partial}{\\partial x}$', label: 'Partial derivative' },
  
  // Geometry
  { symbol: '$\\angle$', label: 'Angle' },
  { symbol: '$\\triangle$', label: 'Triangle' },
  { symbol: '$\\square$', label: 'Square' },
  { symbol: '$\\circ$', label: 'Circle' },
  { symbol: '$\\parallel$', label: 'Parallel' },
  { symbol: '$\\perp$', label: 'Perpendicular' },
];

export function MathSymbolPalette({ onSymbolClick }: MathSymbolPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-0.5 border-black hover:bg-accent/50">
          <Calculator className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 rounded-xl border-0.5 border-black" align="start">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Math Symbols</h4>
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {mathSymbols.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-10 w-10 text-xs justify-center items-center rounded-lg border-0.5 border-black hover:bg-accent/50"
                onClick={() => {
                  onSymbolClick(item.symbol);
                  setIsOpen(false);
                }}
                title={item.label}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <MathRenderer 
                    content={item.symbol} 
                    className="text-xs"
                  />
                </div>
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            Click a symbol to insert it into your message
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
