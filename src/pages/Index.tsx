
import React, { useState } from 'react';
import { toast } from 'sonner';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Result from '@/components/Result';
import { predictImage, PredictionResult } from '@/services/predictionService';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const handleImageSelected = async (file: File) => {
    setSelectedImage(file);
    setPrediction(null);
    setIsLoading(true);
    
    try {
      const result = await predictImage(file);
      setPrediction(result);
      
      if (result.success) {
        toast.success(`Prediction complete!`);
      } else {
        toast.error('Failed to analyze the image');
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      setPrediction({
        data: '',
        success: false,
        error: 'An unexpected error occurred during analysis'
      });
      toast.error('Failed to analyze the image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      <div className="flex-1 container max-w-4xl px-4 py-8 md:py-12">
        <Header />
        
        <main className="mt-8 space-y-8">
          <ImageUpload 
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
          />
          
          {prediction && (
            <Result
              result={prediction.success ? prediction.data : null}
              confidence={prediction.confidence}
              error={prediction.error}
              onReset={handleReset}
              className="mt-8"
            />
          )}
          
          <div className="text-center text-sm text-muted-foreground mt-12 opacity-70">
            <p>Powered by machine learning. Upload a clear photo for the best results.</p>
          </div>
        </main>
      </div>
      
      <footer className="py-6 border-t border-border/30 bg-background/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pet Predictor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
