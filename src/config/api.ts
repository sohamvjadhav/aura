// Developer Configuration
// TODO: For production, move this to Supabase Edge Functions for security
// Get your API key from: https://aistudio.google.com/app/apikey

export const API_CONFIG = {
  // Replace with your Google AI API key
  GOOGLE_AI_API_KEY: "YOUR_GOOGLE_AI_API_KEY_HERE",
  
  // API endpoints
  GOOGLE_AI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
};

// Check if API key is configured
export const isApiConfigured = () => {
  return API_CONFIG.GOOGLE_AI_API_KEY !== "YOUR_GOOGLE_AI_API_KEY_HERE" && 
         API_CONFIG.GOOGLE_AI_API_KEY.length > 0;
};