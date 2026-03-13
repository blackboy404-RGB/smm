// API Base URL - uses environment variable or falls back to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => ${API_BASE_URL};
