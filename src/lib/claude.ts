import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client with the API key
const apiKey = import.meta.env.VITE_CLAUDE_API_KEY ||
               import.meta.env.NEXT_PUBLIC_CLAUDE_API_KEY;

// Log API key status (without exposing the actual key)
if (!apiKey) {
  console.warn("⚠️ Claude API key is missing. Story generation will not work.");
  console.info("Please add your Claude API key to .env or .env.local as VITE_CLAUDE_API_KEY");
} else {
  console.log("✅ Claude API key found");
}

// Initialize the Anthropic client with the API key
// SECURITY NOTE: Using dangerouslyAllowBrowser: true is not recommended for production
// Ideally, API requests should be proxied through a backend server
const claude = new Anthropic({
  apiKey: apiKey as string,
  dangerouslyAllowBrowser: true, // Required for browser environments
});

export default claude;
