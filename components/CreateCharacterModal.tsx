/**
 * Create Character Modal Component
 * 
 * This component provides a character creation interface from scratch with the following features:
 * - Character information input (name, personality, scenario, etc.)
 * - Avatar upload or generation option
 * - Form validation and error handling
 * - Real-time character creation
 * - Modal-based creation workflow
 * - Responsive design with animations
 * 
 * The component handles:
 * - Character data input and validation
 * - Character creation and persistence
 * - Modal state management and animations
 * - Error handling and user feedback
 * - Form state management and cleanup
 * - Avatar upload or generation placeholder
 */

"use client";

import React, { useState, useRef, useCallback } from "react";
import { useLanguage } from "@/app/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { trackButtonClick } from "@/utils/google-analytics";
import { Toast } from "@/components/Toast";
import ImageGenerationModal from "@/components/ImageGenerationModal";

/**
 * Interface definitions for the component's props
 */
interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

/**
 * Create character modal component
 * 
 * Provides a comprehensive character creation interface with:
 * - Character information input
 * - Avatar upload/generation
 * - Form validation and error handling
 * - Real-time creation and persistence
 * - Modal-based workflow management
 * 
 * @param {CreateCharacterModalProps} props - Component props
 * @returns {JSX.Element | null} The create character modal or null if closed
 */
const CreateCharacterModal: React.FC<CreateCharacterModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t, fontClass, serifFontClass } = useLanguage();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [scenario, setScenario] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [creatorComment, setCreatorComment] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageGenModalOpen, setIsImageGenModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Toast state
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

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName("");
      setPersonality("");
      setScenario("");
      setFirstMessage("");
      setCreatorComment("");
      setDescription("");
      setAvatarFile(null);
      setAvatarPreview("");
    }
  }, [isOpen]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please upload an image file");
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGenerated = (imageFile: File) => {
    setAvatarFile(imageFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
    
    showToast("Avatar generated successfully!", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      showToast("Character name is required");
      return;
    }
    
    if (!personality.trim()) {
      showToast("Character personality is required");
      return;
    }

    setIsLoading(true);
    
    try {
      trackButtonClick("create_character_submit", "Submit Create Character");
      
      // Create character data
      const characterId = `char_${Date.now()}`;
      const imagePath = avatarFile ? `${characterId}.png` : "default-avatar.png";
      
      // Create the raw character data structure
      const rawCharacterData = {
        spec: "chara_card_v2",
        spec_version: "2.0",
        data: {
          name: name.trim(),
          description: description.trim(),
          personality: personality.trim(),
          scenario: scenario.trim(),
          first_mes: firstMessage.trim() || `Hello, I'm ${name.trim()}.`,
          mes_example: "",
          creator_notes: creatorComment.trim(),
          system_prompt: "",
          post_history_instructions: "",
          alternate_greetings: [],
          character_book: null,
          tags: [],
          creator: "",
          character_version: "1.0",
          extensions: {},
        },
        creatorcomment: creatorComment.trim(),
      };

      // Import the character creation function
      const { LocalCharacterRecordOperations } = await import("@/lib/data/roleplay/character-record-operation");
      const { setBlob } = await import("@/lib/data/local-storage");
      
      // Create character record
      await LocalCharacterRecordOperations.createCharacter(
        characterId,
        rawCharacterData,
        imagePath,
      );
      
      // Save avatar if provided
      if (avatarFile) {
        await setBlob(imagePath, avatarFile);
      }
      
      showToast("Character created successfully!", "success");
      
      // Wait a bit to show success message
      setTimeout(() => {
        onCreate();
        onClose();
      }, 1000);
      
    } catch (error: any) {
      console.error("Failed to create character:", error);
      showToast(error.message || "Failed to create character");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1410] rounded-lg shadow-2xl border border-[#534741] ${fontClass}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-[#1a1410] border-b border-[#534741] p-6">
            <h2 className={`text-2xl font-bold text-[#f4e8c1] mb-2 ${serifFontClass}`}>
              Create Character from Scratch
            </h2>
            <p className="text-[#c0a480] text-sm">
              Fill in the details to create your custom character
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[#252220] border-2 border-[#534741] flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#c0a480] text-sm text-center px-4">No avatar</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors"
                >
                  Upload Avatar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    trackButtonClick("generate_avatar_btn", "Generate Avatar");
                    setIsImageGenModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#f9c86d] hover:bg-[#f4d68f] text-[#1a1410] font-semibold rounded transition-colors"
                >
                  Generate Avatar
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Character Name */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Character Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d]"
                placeholder="Enter character name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="Brief description of the character's appearance and traits"
              />
            </div>

            {/* Personality */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Personality <span className="text-red-500">*</span>
              </label>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="Describe the character's personality traits, behaviors, and quirks"
                required
              />
            </div>

            {/* Scenario */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Scenario
              </label>
              <textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="The setting or context where conversations take place"
              />
            </div>

            {/* First Message */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                First Message
              </label>
              <textarea
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="The character's greeting message (optional, will auto-generate if empty)"
              />
            </div>

            {/* Creator Comment */}
            <div>
              <label className="block text-[#f4e8c1] mb-2">
                Creator Notes
              </label>
              <textarea
                value={creatorComment}
                onChange={(e) => setCreatorComment(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-[#252220] text-[#f4e8c1] border border-[#534741] rounded focus:outline-none focus:border-[#f9c86d] resize-none"
                placeholder="Optional notes about this character"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-[#534741]">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 bg-[#252220] hover:bg-[#342f25] text-[#f4e8c1] rounded border border-[#534741] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#f9c86d] hover:bg-[#f4d68f] text-[#1a1410] font-semibold rounded transition-colors disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Character"}
              </button>
            </div>
          </form>

          <Toast
            type={toast.type}
            message={toast.message}
            isVisible={toast.isVisible}
            onClose={hideToast}
          />
        </motion.div>
        
        <ImageGenerationModal
          isOpen={isImageGenModalOpen}
          onClose={() => setIsImageGenModalOpen(false)}
          onImageGenerated={handleImageGenerated}
          suggestedPrompt={name && description ? `${description} - character portrait` : ""}
          title="Generate Character Avatar"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateCharacterModal;
