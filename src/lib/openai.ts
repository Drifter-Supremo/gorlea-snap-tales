import OpenAI from 'openai';

// In Vite applications, environment variables must be prefixed with VITE_
// to be exposed to client-side code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY ||
               import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Validate API key format (basic check)
const isValidApiKey = apiKey && typeof apiKey === 'string' && apiKey.startsWith('sk-');

// Initialize the OpenAI client with the API key
// SECURITY NOTE: Using dangerouslyAllowBrowser: true is not recommended for production
// Ideally, API requests should be proxied through a backend server
const openai = new OpenAI({
  apiKey: isValidApiKey ? apiKey as string : '',
  maxRetries: 3, // Retry up to 3 times on transient errors
  dangerouslyAllowBrowser: true, // Required for browser environments
  timeout: 30000, // 30 second timeout
});

// Log API key status (without exposing the actual key)
if (!isValidApiKey) {
  console.warn("⚠️ OpenAI API key is missing or invalid. Text-to-speech will not work.");
  console.info("Please add your OpenAI API key to .env or .env.local as VITE_OPENAI_API_KEY");
  console.info("API key should start with 'sk-'");
} else {
  console.log("✅ OpenAI API key found");
}

export default openai;
