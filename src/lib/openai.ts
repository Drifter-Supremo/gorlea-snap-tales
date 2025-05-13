import OpenAI from 'openai';

// In Vite applications, environment variables must be prefixed with VITE_
// to be exposed to client-side code
const apiKey = import.meta.env.VITE_OPENAI_API_KEY ||
               import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Initialize the OpenAI client with the API key
// SECURITY NOTE: Using dangerouslyAllowBrowser: true is not recommended for production
// Ideally, API requests should be proxied through a backend server
const openai = new OpenAI({
  apiKey: apiKey as string,
  maxRetries: 3, // Retry up to 3 times on transient errors
  dangerouslyAllowBrowser: true, // Required for browser environments
});

// Log API key status (without exposing the actual key)
if (!apiKey) {
  console.warn("⚠️ OpenAI API key is missing. Story generation will not work.");
  console.info("Please add your OpenAI API key to .env or .env.local as VITE_OPENAI_API_KEY");
} else {
  console.log("✅ OpenAI API key found");
}

export default openai;
