# CloudGPT RP - New Features Guide

## Overview

CloudGPT RP has been enhanced with powerful new features including character creation from scratch and AI-powered image generation. This guide explains how to use these new capabilities.

## New Features

### 1. Character Creation from Scratch

Create custom characters without importing PNG files:

1. **Navigate to Character Cards page**
   - Click on "Character Cards" in the sidebar

2. **Click "Create Character" button**
   - New button appears alongside "Import Character" and "Community Download"

3. **Fill in character details:**
   - **Character Name** (required): The name of your character
   - **Description**: Brief description of appearance and traits
   - **Personality** (required): Detailed personality traits and behaviors
   - **Scenario**: The context/setting for conversations
   - **First Message**: Character's greeting (auto-generated if empty)
   - **Creator Notes**: Optional notes about the character

4. **Add or Generate Avatar:**
   - **Upload Avatar**: Click to upload an image file
   - **Generate Avatar**: Use AI to create a character portrait (see Image Generation below)

5. **Save**: Click "Create Character" to save your new character

### 2. AI-Powered Image Generation

Generate images using the CloudGPT API for character avatars and scenes.

#### Prerequisites

Before using image generation, configure your CloudGPT API:
1. Click the Settings icon (top right)
2. Enter your CloudGPT API Key (format: `cgpt_sk_...`)
3. Enter CloudGPT Base URL: `https://meridianlabsapp.website/v1`
4. Save settings

#### Generating Character Avatars

When creating or editing a character:

1. Click **"Generate Avatar"** button
2. Enter a description of your character's appearance
   - Example: "A fierce warrior woman with red hair and golden armor"
3. Choose image size:
   - Square (1024×1024) - Best for profile pictures
   - Portrait (1024×1792) - Vertical orientation
   - Landscape (1792×1024) - Horizontal orientation
4. Click **"Generate Image"**
5. Wait 10-30 seconds for generation
6. Preview the generated image
7. Click **"Use This Image"** to set as avatar, or **"Generate Another"** to try again

#### Image Generation in Chat (Component Ready)

The ChatImageGenerator component is ready for integration into chat conversations:
- Quick button to trigger image generation
- Context-aware prompt suggestions
- Inline image display in messages

### 3. Technical Details

#### Image Generation API

The image generation uses CloudGPT's DALL-E compatible API:
- **Endpoint**: `{baseUrl}/images/generations`
- **Supported Models**: DALL-E 3, Stable Diffusion, and others
- **Sizes**: 256x256, 512x512, 1024x1024, 1024x1792, 1792x1024
- **Quality**: Standard or HD

#### Character Data Structure

Created characters follow the SillyTavern v2 format:
```json
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "data": {
    "name": "Character Name",
    "description": "...",
    "personality": "...",
    "scenario": "...",
    "first_mes": "...",
    "character_book": null,
    "extensions": {}
  }
}
```

### 4. Usage Tips

#### Character Creation
- **Be Descriptive**: The more detailed your personality description, the better AI conversations will be
- **Include Examples**: Use the description field to give visual details for avatar generation
- **Test Greetings**: A good first message sets the tone for conversations

#### Image Generation
- **Be Specific**: Detailed prompts generate better images
  - Good: "A young elf wizard with silver hair, blue robes, and holding a glowing staff"
  - Poor: "An elf"
- **Include Style**: Mention art style for consistency
  - "Digital art", "Anime style", "Realistic portrait", "Fantasy illustration"
- **Character Focus**: For avatars, focus on face and upper body
- **Generation Time**: First generation may take longer; subsequent ones are faster

#### API Costs
- Image generation consumes API credits
- DALL-E 3 HD quality (1024x1024): ~$0.08 per image
- Check your CloudGPT dashboard for current pricing
- Consider using standard quality for testing

### 5. Troubleshooting

#### Image Generation Fails
- **Error: "API key is required"**
  - Solution: Configure CloudGPT API in Settings
  
- **Error: "API request failed"**
  - Check your API key is valid
  - Verify base URL is correct
  - Ensure you have API credits available

- **Generation Takes Too Long**
  - Normal wait time: 10-30 seconds
  - If >60 seconds, try again
  - Check your internet connection

#### Character Creation Issues
- **Character Not Appearing**
  - Refresh the character cards page
  - Check browser console for errors

- **Avatar Not Displaying**
  - Verify image file is valid
  - Try re-uploading or regenerating

### 6. Future Enhancements

Planned improvements:
- [ ] Image generation directly in chat conversations
- [ ] Multiple greeting messages support
- [ ] Character templates/presets
- [ ] Batch character creation
- [ ] Advanced image editing and refinement
- [ ] Custom image prompting templates

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/CloudCompile/CloudGPTRP/issues)
- Review CloudGPT API documentation
- Consult the community forums

## License

This project maintains its original licensing:
- Code: AGPL-3.0
- Content: CC BY-NC-SA 4.0
- Attribution required for web deployments
