# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for AI-powered image generation and editing using Google Gemini 2.0 Flash. The project has been modified to support OpenRouter API integration for accessing additional AI models (Gemini 2.5 Flash Image Preview and Gemini 2.0 Flash).

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with Turbopack
npm run dev --turbopack

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Environment Variables

Required in `.env`:
```
GEMINI_API_KEY=<your_google_api_key>  # For original Gemini 2.0 Flash functionality
OPEN_ROUTER_API_KEY=<your_openrouter_key>  # For OpenRouter integration (Gemini 2.5 Flash Image Preview)
```

## Architecture

### API Layer (`/app/api/`)
- **`image/route.ts`**: Original Gemini 2.0 Flash endpoint using Google SDK
  - Handles image generation and editing via conversation history
  - Accepts JSON with `prompt`, `image`, and `history` fields
  - Returns base64 encoded images with optional descriptions

### Frontend Components (`/components/`)
- **`ImageUpload.tsx`**: Drag-and-drop file upload with base64 conversion
- **`ImagePromptInput.tsx`**: Text prompt input for image generation/editing
- **`ImageResultDisplay.tsx`**: Display generated images with download functionality
- **UI Components** (`ui/`): shadcn/ui components (Button, Card, Input, etc.)

### Type Definitions (`/lib/types.ts`)
```typescript
interface HistoryItem {
  role: "user" | "model";
  parts: HistoryPart[];
}

interface HistoryPart {
  text?: string;
  image?: string; // data URL format
}
```

### Key Implementation Details

1. **Conversation History Management**: The app maintains conversation history to enable iterative image editing with context preservation.

2. **Image Data Flow**: 
   - Images are converted to base64 data URLs on upload
   - Sent to API as inline data with MIME type
   - Returned as base64 strings from Gemini API

3. **Model Configuration**:
   - Original: `gemini-2.0-flash-exp-image-generation` via Google SDK
   - OpenRouter models accessible via `google/gemini-2.5-flash-image-preview` and `google/gemini-2.0-flash-001`

## OpenRouter Integration Examples

### Gemini 2.5 Flash Image Preview (from docs/open_router.md)
```typescript
import OpenAI from 'openai';
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

// Model: "google/gemini-2.5-flash-image-preview"
```

### Gemini 2.0 Flash (from docs/gemini2_flash.md)
```typescript
// Model: "google/gemini-2.0-flash-001"
// Same OpenRouter setup, different model ID
```

## Project Goals

The current development focus is transforming this into an AI clothing try-on application with:
- Dual image upload (user photo + clothing item)
- URL support for clothing images from e-commerce sites
- Multiple scene/pose presets
- AI-powered outfit analysis using Gemini 2.0 Flash
- Background and mood customization via prompts

## TypeScript Configuration

- **Target**: ES2017
- **Strict Mode**: Disabled (`strict: false`)
- **Path Aliases**: `@/*` maps to root directory
- **Module Resolution**: Bundler mode for Next.js compatibility