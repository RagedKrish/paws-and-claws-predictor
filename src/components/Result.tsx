
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Repeat } from 'lucide-react';

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
      const audio = new Audio();
      
      if (result === 'cat') {
        audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+NAwAAAAAAAAAAAAFhpbmcAAAAPAAAAAwAAA2YAVlZWVlZWVlZWVlZWVlZWVlZWVlbp6enp6enp6enp6enp6enp6enp6en///////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYqAAAAAAAAA2YkFChYAAAA/+RAwIa0WHoFnmAAJZMmbRHJFc2hGBWNBgMBgMBg7+fP/5/6BgP5/vg+/ggCAIAgmCYP0f4IAgCAfB8/B+bB8H5//L2YPnwfTgwAAAAAGAYJgmD4JgmCYPgwAAAAAGAYP/8Hz8vYPggmCYJgwAAwAAAwGAwGD/5cf4Pn+D58H0+iGYJg/wwAAwDAYDChMEwfBOEwIAg+D4Jg/N/+XH/YPnwfTvf5uqKGLKQ6iDlQoGBAYDAYDAYMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMBgMF9WoMjKQyOFCgYEAbGhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MwwAr0O6YNXmAQAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MQwLcbw4YQ3gBQAAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      } else if (result === 'dog') {
        audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+NAwAAAAAAAAAAAAFhpbmcAAAAPAAAABgAABPcAICAgICAgICAgICBVVVVVVVVVVVVVVVWAgICAgICAgICAgIDLy8vLy8vLy8vLy8v19fX19fX19fX19fX///////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAhpAAAAAAAABPc9NuToAAAA/+RAwLmWdIkNnmAAEGSzM/JeQQ6z2rAqKlDixEpGhYZGFQiHzQgHxMYEPx9TCSN9OjJz0TK4cWJgpC8DQPhsTAwfgyLAgE4xw3Bf8EAQCAIB8H5MPn/+fBAQfggX/h8H4ICAICAfP/Lg+fBhgQBAGH/Lg+fBeMCAgCAfP/5c2D58EAwQfCfIAQaFvbgUcEw6YEwMFg8PFheHiGCwOMDAwUD4vGAwWGAwYJ8YHx8YGiQfGBMKFhQMDYiFigTExMMBgP8QcQUREHEcHw+Q+RAREQfIiIiDkRB8h8REHIiD4h9//yPyIORn//5H//8uIcRiYmDkXhcuAwGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4zAAr0wEo83ngQAAAAA0gAAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/4xDAtxvDhgjeAFAAAAEAAEgAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
      }
      
      audio.play().catch(e => console.error("Audio playback failed:", e));
      setAudioPlayed(true);
    }
  }, [show, result, audioPlayed]);

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
            
            <p className="text-xs text-muted-foreground mt-1 px-4">
              Note: This model is trained only on cats and dogs. Other objects, including humans, may be classified as either a cat or dog.
            </p>
            
            <Button onClick={onReset} className="mt-4">
              <Repeat className="mr-2 h-4 w-4" />
              Try Another Photo
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Result;
