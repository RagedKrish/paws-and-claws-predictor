
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelected, 
  isLoading,
  className 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      onImageSelected(file);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => inputRef.current?.click();

  const handleClear = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL('image/png');
      setPreview(imageDataUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'captured-image.png', { type: 'image/png' });
          onImageSelected(file);
        }
      }, 'image/png');

      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  return (
    <Card className={cn("relative overflow-hidden animate-fade-up", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8 transition-all duration-200 ease-in-out",
          dragActive ? "bg-primary/5" : "bg-background",
          preview ? "py-4" : "py-16"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*"
          disabled={isLoading}
        />

        {showCamera ? (
          <div className="relative w-full max-w-md">
            <video ref={videoRef} autoPlay className="border rounded-lg w-full"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={stopCamera} disabled={isLoading}>
                <X className="mr-2 h-4 w-4" />
                Close Camera
              </Button>
              <Button onClick={takePhoto} disabled={isLoading}>
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
        ) : preview ? (
          <div className="relative w-full max-w-md animate-scale-in">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="destructive"
                size="icon"
                onClick={handleClear}
                disabled={isLoading}
                className="h-8 w-8 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto object-contain"
                style={{ maxHeight: '400px' }}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="animate-pulse-soft text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-primary">Analyzing image...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">Upload an image</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Drag and drop an image, or click to select a file
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleButtonClick} disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              <Button variant="outline" onClick={startCamera} disabled={isLoading}>
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageUpload;
