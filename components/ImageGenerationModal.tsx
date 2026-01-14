/**
 * Image Generation Modal Component
 * 
 * This component provides an interface for generating images using AI.
 * Features include:
 * - Text prompt input for image generation
 * - Real-time image generation using CloudGPT API
 * - Image preview and download options
 * - Loading states and error handling
 * - Support for different image sizes and styles
 * 
 * The component handles:
 * - User prompt input and validation
 * - API integration for image generation
 * - Generated image display and preview
 * - Error handling and user feedback
 * - Image selection and confirmation
 */

"use client";

import React, { useState, useCallback } from "react";
import { useLanguage } from "@/app/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { generateImage, imageUrlToFile } from "@/utils/image-generation";
import { Toast } from "@/components/Toast";

/**
 * Interface definitions for the component's props
 */
interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageFile: File) => void;
  suggestedPrompt?: string;
  title?: string;
}

/**
 * Image generation modal component
 * 
 * Provides an interface for AI image generation with:
 * - Prompt input and suggestions
 * - Real-time image generation
 * - Image preview and selection
 * - Error handling and feedback
 * 
 * @param {ImageGenerationModalProps} props - Component props
 * @returns {JSX.Element | null} The image generation modal or null if closed
 */
const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({
  isOpen,
  onClose,
  onImageGenerated,
  suggestedPrompt = "",
  title = "Generate Image",
}) => {
  const { t, fontClass, serifFontClass } = useLanguage();
  const [prompt, setPrompt] = useState(suggestedPrompt);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageSize, setImageSize] = useState<"1024x1024" | "1024x1792" | "1792x1024">("1024x1024");

  // Toast state
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "error" as "success" | "error" | "warning",
  });

  const showToast = useCallback((message: string, type: "success" | "error" | "warning" = "error") => {
    setToast({
      isVisible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast({
      isVisible: false,
      message: "",
      type: "error",
    });
  }, []);

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setPrompt(suggestedPrompt);
      setGeneratedImageUrl("");
    }
  }, [isOpen, suggestedPrompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast("Please enter an image description");
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl("");

    try {
      // Get API credentials from localStorage
      const apiKey = localStorage.getItem("openaiApiKey") || "";
      const baseUrl = localStorage.getItem("openaiBaseUrl") || "";

      if (!apiKey || !baseUrl) {
        showToast("Please configure your CloudGPT API settings first");
        setIsGenerating(false);
        return;
      }

      // Generate the image
      const result = await generateImage({
        prompt: prompt.trim(),
        apiKey,
        baseUrl,
        size: imageSize,
        quality: "hd",
      });

      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        showToast("Image generated successfully!", "success");
      } else {
        showToast(result.error || "Failed to generate image");
      }
    } catch (error: any) {
      console.error("Image generation error:", error);
      showToast(error.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseImage = async () => {
    if (!generatedImageUrl) {
      showToast("No image to use");
      return;
    }

    try {
      // Convert image URL to File object
      const imageFile = await imageUrlToFile(generatedImageUrl, "generated-avatar.png");
      onImageGenerated(imageFile);
      onClose();
    } catch (error: any) {
      console.error("Error processing image:", error);
      showToast("Failed to process generated image");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1410] rounded-lg shadow-2xl border border-[#534741] ${fontClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-[#1a1410] border-b border-[#534741] p-6">
            <h2 className={`text-2xl font-bold text-[#f4e8c1] mb-2 ${serifFontClass}`}>
              {title}
            </h2>
            <p className="text-[#c0a480] text-sm">
              Describe the image you want to generate using AI
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Image Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="Describe the image you want to create... (e.g., 'A fierce warrior woman with red hair and golden armor')"
                disabled={isGenerating}
              />
            </div>

            {/* Image Size Selection */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Image Size
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setImageSize("1024x1024")}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded border transition-colors ${
                    imageSize === "1024x1024"
                      ? "bg-[#f9c86d] text-[#1a1410] border-[#f9c86d]"
                      : "bg-[#252220] text-[#f4e8c1] border-[#534741] hover:bg-[#342f25]"
                  } disabled:opacity-50`}
                >
                  Square (1024×1024)
                </button>
                <button
                  type="button"
                  onClick={() => setImageSize("1024x1792")}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded border transition-colors ${
                    imageSize === "1024x1792"
                      ? "bg-[#f9c86d] text-[#1a1410] border-[#f9c86d]"
                      : "bg-[#252220] text-[#f4e8c1] border-[#534741] hover:bg-[#342f25]"
                  } disabled:opacity-50`}
                >
                  Portrait (1024×1792)
                </button>
                <button
                  type="button"
                  onClick={() => setImageSize("1792x1024")}
                  disabled={isGenerating}
                  className={`px-4 py-2 rounded border transition-colors ${
                    imageSize === "1792x1024"
                      ? "bg-[#f9c86d] text-[#1a1410] border-[#f9c86d]"
                      : "bg-[#252220] text-[#f4e8c1] border-[#534741] hover:bg-[#342f25]"
                  } disabled:opacity-50`}
                >
                  Landscape (1792×1024)
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full px-6 py-3 bg-[#f9c86d] hover:bg-[#f4d68f] text-[#1a1410] font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "Generating..." : "Generate Image"}
            </button>

            {/* Loading Indicator */}
            {isGenerating && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-t-[#f9c86d] border-r-[#c0a480] border-b-[#a18d6f] border-l-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-t-[#a18d6f] border-r-[#f9c86d] border-b-[#c0a480] border-l-transparent animate-spin-slow"></div>
                </div>
                <p className="text-[#c0a480]">Generating your image...</p>
                <p className="text-[#a18d6f] text-sm mt-2">This may take 10-30 seconds</p>
              </div>
            )}

            {/* Generated Image Preview */}
            {generatedImageUrl && !isGenerating && (
              <div className="space-y-4">
                <div className="border border-[#534741] rounded-lg overflow-hidden">
                  <img
                    src={generatedImageUrl}
                    alt="Generated image"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUseImage}
                    className="flex-1 px-6 py-2 bg-[#f9c86d] hover:bg-[#f4d68f] text-[#1a1410] font-semibold rounded transition-colors"
                  >
                    Use This Image
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-2 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!generatedImageUrl && (
              <div className="flex justify-end pt-4 border-t border-[#534741]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <Toast
            type={toast.type}
            message={toast.message}
            isVisible={toast.isVisible}
            onClose={hideToast}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGenerationModal;
