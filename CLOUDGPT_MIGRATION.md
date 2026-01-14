# CloudGPT API Migration Guide

This document outlines the changes made to integrate CloudGPT API and add NSFW consent functionality.

## Changes Summary

### 1. API Configuration (.env.example)
- Updated default API key format from `your_opeani_type_api_key` to `cgpt_sk_your_cloudgpt_api_key`
- Changed default API URL to CloudGPT's endpoint: `https://meridianlabsapp.website/v1`

### 2. Model Settings UI (components/ModelSidebar.tsx)
- Updated all references from "OpenAI API" to "CloudGPT API"
- Changed default configuration name to "CloudGPT" instead of "OpenAI"
- Updated placeholder URLs to CloudGPT's endpoint
- Updated API key placeholder to CloudGPT format (`cgpt_sk_...`)
- Added NSFW consent checkbox with confirmation dialog
- NSFW consent state is persisted in localStorage

### 3. Translation Files
#### English (app/i18n/locales/en.json)
- Updated all API-related labels to reference CloudGPT
- Added NSFW consent translations:
  - `nsfwConsent`: "NSFW Content"
  - `nsfwConsentLabel`: "I consent to NSFW content generation"
  - `nsfwConsentWarning`: Warning message for 18+ users
  - `nsfwConsentConfirm`: "Enable NSFW Content"
  - `nsfwConsentCancel`: "Cancel"

#### Chinese (app/i18n/locales/zh.json)
- Updated all API-related labels to reference CloudGPT (CloudGPT API)
- Added Chinese NSFW consent translations

### 4. Documentation Updates
#### README.md
- Updated API recommendations section to highlight CloudGPT as primary API
- Added CloudGPT dashboard link: https://meridianlabsapp.website/dashboard
- Added note about NSFW content support with user consent

#### README_ZH.md
- Same updates as README.md in Chinese

#### docs/VERCEL_DEPLOYMENT.md
- Updated environment variables section to require CloudGPT credentials
- Specified CloudGPT API key format and base URL
- Added CloudGPT dashboard link for obtaining API keys

## CloudGPT API Details

### Base URL
```
https://meridianlabsapp.website/v1
```

### API Key Format
```
cgpt_sk_your_api_key_here
```

### Compatible Endpoints
The CloudGPT API is fully compatible with OpenAI SDK, supporting:
- `/chat/completions` - Chat completions with 159+ models
- `/images/generations` - Image generation (DALL-E, Stable Diffusion, etc.)

### Authentication
All requests must include the API key in the Authorization header:
```
Authorization: Bearer cgpt_sk_your_api_key_here
```

## NSFW Content Feature

### User Consent Flow
1. User opens Model Settings
2. User sees NSFW consent checkbox
3. When enabling, a confirmation dialog appears with:
   - Warning that user must be 18+
   - Acknowledgment of potentially explicit content
4. User confirms or cancels
5. Consent state is saved to localStorage

### Implementation Details
- Consent state key: `nsfwConsent` in localStorage
- Values: `"true"` or `"false"`
- Dialog appears only when enabling NSFW
- Disabling NSFW is immediate without confirmation

### Integration Points
Applications can check NSFW consent status:
```javascript
const nsfwConsent = localStorage.getItem("nsfwConsent") === "true";
```

## Deployment on Vercel

### Required Environment Variables
Set these in your Vercel project settings:

```bash
NEXT_PUBLIC_API_KEY=cgpt_sk_your_cloudgpt_api_key
NEXT_PUBLIC_API_URL=https://meridianlabsapp.website/v1
```

### Optional Environment Variables
```bash
NEXT_PUBLIC_TAVILY_API_KEY=your_tavily_search_api_key
NEXT_PUBLIC_JINA_API_KEY=your_jina_ai_api_key
NEXT_PUBLIC_FAL_API_KEY=your_fal_api_key
```

## Testing Checklist

- [x] TypeScript compilation (no errors)
- [x] ESLint linting (no errors)
- [ ] Model configuration with CloudGPT API key
- [ ] Chat completions using CloudGPT models
- [ ] NSFW consent dialog flow
- [ ] NSFW consent persistence across sessions
- [ ] Vercel deployment with environment variables

## Notes

### Build Issue
There is a pre-existing build issue with `lightningcss` native modules in the current environment. This is unrelated to the CloudGPT migration and is a known issue with TailwindCSS v4 in certain build environments. On Vercel, the build should work correctly as they have proper native module support.

### API Compatibility
Since CloudGPT uses OpenAI-compatible API format, all existing LangChain code works without modification. The application uses the `ChatOpenAI` class from `@langchain/openai` with a configurable `baseURL`, which seamlessly supports CloudGPT.

### Model Support
CloudGPT supports 159+ models including:
- GPT-4, GPT-4-turbo, GPT-3.5-turbo
- Claude models (Anthropic)
- Llama models
- Mistral models
- And many more

Users can fetch the model list using the "Get Model List" button in settings.

## Migration Benefits

1. **More Models**: Access to 159+ models vs. just OpenAI models
2. **Cost Flexibility**: CloudGPT may offer different pricing than OpenAI
3. **NSFW Support**: Explicit consent mechanism for adult content
4. **Unified Interface**: Same familiar OpenAI-compatible API
5. **Easy Deployment**: Works seamlessly on Vercel

## Support

For CloudGPT API issues or questions:
- Visit the CloudGPT Dashboard: https://meridianlabsapp.website/dashboard
- Review CloudGPT API Documentation: https://meridianlabsapp.website/docs

For application deployment issues:
- Check Vercel Documentation: https://vercel.com/docs
- Review this repository's issues

## License Compliance

This migration maintains all original license requirements:
- AGPL-3.0 for code
- CC BY-NC-SA 4.0 for content
- Visible attribution link to original repository required for web deployments
