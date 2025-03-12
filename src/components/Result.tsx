
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Repeat, Volume2 } from 'lucide-react';

interface ResultProps {
  result: string | null;
  confidence?: number; 
  error?: string;
  onReset: () => void;
  className?: string;
}

const Result: React.FC<ResultProps> = ({ 
  result, 
  confidence, 
  error, 
  onReset,
  className
}) => {
  const [show, setShow] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  
  useEffect(() => {
    // Reset animation when result changes
    setShow(false);
    setAudioPlayed(false);
    
    // Small delay to ensure animation plays
    const timer = setTimeout(() => {
      if (result || error) {
        setShow(true);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [result, error]);

  useEffect(() => {
    // Play sound effect when result shows
    if (show && result && !audioPlayed) {
      playResultSound(result);
      setAudioPlayed(true);
    }
  }, [show, result, audioPlayed]);

  const playResultSound = (result: string) => {
    const audio = new Audio();
    
    if (result === 'cat') {
      audio.src = '/cat-meow-8-fx-306184.mp3';
      console.log("Playing cat sound (meow)");
    } else if (result === 'dog') {
      audio.src = '/dog-bark-179915.mp3';
      console.log("Playing dog sound (bark)");
    }
    
    // Set volume to higher level
    audio.volume = 0.8;
    
    // Try playing the audio with user interaction to avoid browser restrictions
    audio.play().catch(e => {
      console.error("Audio playback failed:", e);
    });
  };

  if (!result && !error) return null;
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 ease-out", 
      show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    )}>
      <div className="p-6">
        {error ? (
          <div className="text-center space-y-3">
            <h3 className="text-xl font-medium text-destructive">Oops! Something went wrong</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={onReset} className="mt-4">
              <Repeat className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className={`text-5xl font-semibold ${result === 'cat' ? 'text-purple-500' : 'text-amber-500'}`}>
              {result === 'cat' ? '🐱' : '🐶'}
            </div>
            
            <h2 className="text-2xl font-medium capitalize">
              {result && `It's a ${result}!`}
            </h2>
            
            {confidence !== undefined && (
              <div className="w-full max-w-xs mx-auto mt-2">
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ease-out ${result === 'cat' ? 'bg-purple-500' : 'bg-amber-500'}`}
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {Math.round(confidence * 100)}%
                </p>
              </div>
            )}
            
            <div className="bg-muted/50 p-4 rounded-md mt-2">
              <p className="text-sm font-medium text-muted-foreground">
                <strong>Note:</strong> This model is trained only on cats and dogs. Other objects, including humans, may be classified as either a cat or dog.
              </p>
            </div>
            
            <div className="flex justify-center space-x-2 mt-4">
              <Button onClick={onReset}>
                <Repeat className="mr-2 h-4 w-4" />
                Try Another Photo
              </Button>
              
              {result && (
                <Button 
                  variant="outline" 
                  onClick={() => playResultSound(result)}
                  title={`Play ${result} sound`}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  Play Sound
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Result;
