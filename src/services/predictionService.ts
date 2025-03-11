
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
    
    // Type check and parse the result
    let predictionData = "";
    let confidence: number | undefined = undefined;
    
    // Handle different possible formats of the result data
    if (result.data && typeof result.data === 'object') {
      // If result.data is an object that might contain prediction details
      const data = result.data as Record<string, any>;
      
      // Check if there's a specific prediction field (adjust based on actual API response)
      if ('prediction' in data && typeof data.prediction === 'string') {
        predictionData = data.prediction;
      } else if ('label' in data && typeof data.label === 'string') {
        predictionData = data.label;
      }
      
      // Check for confidence value
      if ('confidence' in data && typeof data.confidence === 'number') {
        confidence = data.confidence;
      } else if ('probability' in data && typeof data.probability === 'number') {
        confidence = data.probability;
      }
    } else if (typeof result.data === 'string') {
      // If result is directly a string (e.g., "cat" or "dog")
      predictionData = result.data;
    } else {
      // Try to convert to string as fallback
      predictionData = String(result.data);
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
