
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 animate-fade-in", className)}>
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="inline-flex items-center space-x-2">
              <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground opacity-70">Paws &amp; Claws</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tighter">
              Pet Predictor
            </h1>
            <p className="max-w-[600px] text-center text-muted-foreground mt-2">
              Upload a photo and our AI will instantly identify if it's a cat or a dog.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
