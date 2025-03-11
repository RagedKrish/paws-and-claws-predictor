
import { Client } from "@gradio/client";

export type PredictionResult = {
  data: string;
  confidence?: number;
  success: boolean;
  error?: string;
};

/**
 * Predicts whether an image contains a cat or a dog
 */
export const predictImage = async (imageFile: File): Promise<PredictionResult> => {
  try {
    console.log("Connecting to Gradio client...");
    const client = await Client.connect("RagedKrish/Cat_vs_dog");
    
    console.log("Sending prediction request...");
    const result = await client.predict("/predict", { 
      img: imageFile, 
    });
    
    console.log("Prediction result:", result.data);
    
    // Parse the result based on the expected format
    let predictionData = "";
    let confidence: number | undefined = undefined;
    
    // Handle the array response format: [{ "result": "dog", "confidence": 99.81 }]
    if (Array.isArray(result.data) && result.data.length > 0) {
      const data = result.data[0];
      
      if (data.result && typeof data.result === 'string') {
        predictionData = data.result;
      }
      
      if (data.confidence && typeof data.confidence === 'number') {
        confidence = data.confidence / 100; // Convert percentage to decimal for consistency
      }
    } else if (result.data && typeof result.data === 'object') {
      // Fallback for direct object response
      const data = result.data as Record<string, any>;
      
      if ('result' in data && typeof data.result === 'string') {
        predictionData = data.result;
      }
      
      if ('confidence' in data && typeof data.confidence === 'number') {
        confidence = data.confidence / 100;
      }
    } else if (typeof result.data === 'string') {
      // Fallback if result is directly a string
      predictionData = result.data;
    }
    
    return {
      data: predictionData,
      confidence: confidence,
      success: true
    };
  } catch (error) {
    console.error("Prediction error:", error);
    return {
      data: "",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
