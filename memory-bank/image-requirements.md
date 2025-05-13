# Image Requirements for Gorlea Snaps

This document outlines the image requirements for the Gorlea Snaps application, specifically for the OpenAI GPT-4.1 API integration.

## Overview

For optimal story generation, images uploaded to Gorlea Snaps must meet specific requirements to be properly processed by the OpenAI GPT-4.1 API. These requirements ensure that the AI can effectively analyze the image content and generate relevant, high-quality stories.

## Image Requirements

### Supported File Types

- PNG (.png)
- JPEG (.jpeg and .jpg)
- WEBP (.webp)
- Non-animated GIF (.gif)

### Size Limits

- Maximum file size: 20MB per image
- Low-resolution: 512px x 512px
- High-resolution: 768px (short side) x 2000px (long side)

### Content Requirements

- No watermarks or logos
- No text
- No NSFW content
- Clear enough for a human to understand

## Implementation Details

These requirements are enforced in the application through:

1. **Frontend Validation:**
   - File type checking in the ImageUploader component
   - File size validation before upload
   - User-friendly error messages for invalid images

2. **Backend Validation:**
   - Secondary validation in the storyGenerator service
   - Proper error handling for invalid images
   - Fallback mechanisms for failed uploads

## User Guidance

To help users meet these requirements, the application should:

1. Display clear guidelines on the image upload page
2. Provide immediate feedback on invalid images
3. Offer suggestions for improving image quality if needed
4. Include examples of good images that work well with the AI

## Technical Considerations

- Images are processed by OpenAI's GPT-4.1 model with vision capabilities
- The model performs best with clear, well-lit images
- Complex or ambiguous images may result in less accurate story generation
- Multiple subjects in an image can lead to more creative stories but may dilute focus

## Future Enhancements

- Implement client-side image resizing to meet size requirements
- Add image enhancement options (brightness, contrast, etc.)
- Provide AI-assisted feedback on image quality
- Support for multiple image uploads for more complex story generation
