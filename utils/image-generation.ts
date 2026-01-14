/**
 * Image Generation Utility
 * 
 * This module provides image generation capabilities using the CloudGPT API.
 * It supports generating images from text prompts for:
 * - Character profile pictures/avatars
 * - Chat conversation images
 * - Scene illustrations
 * 
 * The module handles:
 * - API integration with CloudGPT image generation endpoint
 * - Error handling and retry logic
 * - Image data processing and conversion
 * - Base64 encoding for display
 */

interface ImageGenerationOptions {
  prompt: string;
  apiKey: string;
  baseUrl: string;
  model?: string;
  size?: "256x256" | "512x512" | "1024x1024" | "1024x1792" | "1792x1024";
  quality?: "standard" | "hd";
  n?: number;
}

interface ImageGenerationResult {
  success: boolean;
  imageUrl?: string;
  imageData?: string; // Base64 encoded image data
  error?: string;
}

/**
 * Generate an image using the CloudGPT API
 * 
 * @param options - Image generation options including prompt and API credentials
 * @returns Promise with the generated image URL or base64 data
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const {
    prompt,
    apiKey,
    baseUrl,
    model = "dall-e-3",
    size = "1024x1024",
    quality = "standard",
    n = 1,
  } = options;

  try {
    // Validate inputs
    if (!prompt || !prompt.trim()) {
      return {
        success: false,
        error: "Image prompt is required",
      };
    }

    if (!apiKey || !apiKey.trim()) {
      return {
        success: false,
        error: "API key is required",
      };
    }

    if (!baseUrl || !baseUrl.trim()) {
      return {
        success: false,
        error: "API base URL is required",
      };
    }

    // Clean up base URL
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
    const endpoint = `${cleanBaseUrl}/images/generations`;

    // Make API request
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt: prompt.trim(),
        n,
        size,
        quality,
        response_format: "url", // Can be "url" or "b64_json"
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error?.message ||
        `API request failed with status ${response.status}`;
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();

    // Extract image URL from response
    if (data.data && data.data.length > 0 && data.data[0].url) {
      return {
        success: true,
        imageUrl: data.data[0].url,
      };
    } else if (data.data && data.data.length > 0 && data.data[0].b64_json) {
      return {
        success: true,
        imageData: data.data[0].b64_json,
      };
    } else {
      return {
        success: false,
        error: "No image data in response",
      };
    }
  } catch (error: any) {
    console.error("Image generation error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate image",
    };
  }
}

/**
 * Generate a character avatar/profile picture
 * 
 * @param characterDescription - Description of the character for image generation
 * @param apiKey - CloudGPT API key
 * @param baseUrl - CloudGPT API base URL
 * @returns Promise with the generated avatar image
 */
export async function generateCharacterAvatar(
  characterDescription: string,
  apiKey: string,
  baseUrl: string
): Promise<ImageGenerationResult> {
  // Create an optimized prompt for character avatars
  const avatarPrompt = `Create a high-quality portrait illustration of: ${characterDescription}. Professional digital art style, detailed facial features, appropriate for a character profile picture. Focus on the character's face and upper body.`;

  return await generateImage({
    prompt: avatarPrompt,
    apiKey,
    baseUrl,
    model: "dall-e-3",
    size: "1024x1024",
    quality: "hd",
  });
}

/**
 * Generate a scene illustration for chat
 * 
 * @param sceneDescription - Description of the scene to illustrate
 * @param apiKey - CloudGPT API key
 * @param baseUrl - CloudGPT API base URL
 * @returns Promise with the generated scene image
 */
export async function generateSceneIllustration(
  sceneDescription: string,
  apiKey: string,
  baseUrl: string
): Promise<ImageGenerationResult> {
  // Create an optimized prompt for scene illustrations
  const scenePrompt = `Illustrate this scene: ${sceneDescription}. High-quality digital art, detailed environment, atmospheric lighting, cinematic composition.`;

  return await generateImage({
    prompt: scenePrompt,
    apiKey,
    baseUrl,
    model: "dall-e-3",
    size: "1792x1024",
    quality: "hd",
  });
}

/**
 * Convert an image URL to a File object for upload
 * 
 * @param imageUrl - URL of the image to convert
 * @param filename - Desired filename for the File object
 * @returns Promise with File object
 */
export async function imageUrlToFile(
  imageUrl: string,
  filename: string = "generated-image.png"
): Promise<File> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Convert base64 image data to a File object
 * 
 * @param base64Data - Base64 encoded image data
 * @param filename - Desired filename for the File object
 * @returns File object
 */
export function base64ToFile(
  base64Data: string,
  filename: string = "generated-image.png"
): File {
  // Remove data URL prefix if present
  const base64String = base64Data.replace(/^data:image\/\w+;base64,/, "");
  
  // Convert base64 to binary
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const blob = new Blob([bytes], { type: "image/png" });
  return new File([blob], filename, { type: "image/png" });
}
