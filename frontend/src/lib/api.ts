// API utility that handles backend URL for both local and production environments

const getApiBaseUrl = (): string => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Priority: NEXT_PUBLIC_API_URL env var > PythonAnywhere > Railway fallback
    return process.env.NEXT_PUBLIC_API_URL || 
           'https://yourusername.pythonanywhere.com' ||
           'https://socialflow-ai.up.railway.app';
  }
  // In development, use relative path (Next.js rewrites handle this)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }

  return response.json();
}
