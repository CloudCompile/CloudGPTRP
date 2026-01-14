/**
 * Chat Image Generator Component
 * 
 * This component provides inline image generation in chat conversations.
 * Features include:
 * - Quick access button for image generation
 * - Context-aware prompt suggestions from chat
 * - Inline image display in chat messages
 * - Integration with chat message flow
 * 
 * The component handles:
 * - Image generation triggers in chat
 * - Generated image insertion into conversation
 * - Image message formatting and display
 * - User interaction and feedback
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Interface for the component's props
 */
interface ChatImageGeneratorProps {
  onImageGenerate: (imagePrompt: string) => void;
  isGenerating?: boolean;
  suggestedPrompt?: string;
}

/**
 * Chat image generator component
 * 
 * Provides a button to trigger image generation in chat
 * 
 * @param {ChatImageGeneratorProps} props - Component props
 * @returns {JSX.Element} The chat image generator button
 */
const ChatImageGenerator: React.FC<ChatImageGeneratorProps> = ({
  onImageGenerate,
  isGenerating = false,
  suggestedPrompt = "",
}) => {
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [imagePrompt, setImagePrompt] = useState(suggestedPrompt);

  const handleGenerate = () => {
    if (imagePrompt.trim()) {
      onImageGenerate(imagePrompt.trim());
      setShowPromptInput(false);
      setImagePrompt("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!showPromptInput ? (
        <motion.button
          type="button"
          onClick={() => {
            setShowPromptInput(true);
            setImagePrompt(suggestedPrompt);
          }}
          disabled={isGenerating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1.5 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
          title="Generate an image for this conversation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Generate Image
        </motion.button>
      ) : (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            placeholder="Describe the image to generate..."
            className="flex-1 px-3 py-1.5 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!imagePrompt.trim() || isGenerating}
            className="px-3 py-1.5 bg-[#f9c86d] hover:bg-[#f4d68f] text-[#1a1410] font-semibold rounded transition-colors disabled:opacity-50 text-sm"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPromptInput(false);
              setImagePrompt("");
            }}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors disabled:opacity-50 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatImageGenerator;
