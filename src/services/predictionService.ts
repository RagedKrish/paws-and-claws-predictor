
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
    
    // Parse the result - assuming the model returns something like "cat" or "dog"
    return {
      data: result.data,
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
