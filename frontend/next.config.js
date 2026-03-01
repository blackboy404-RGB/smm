/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'via.placeholder.com', 'socialflow-ai.up.railway.app'],
  },
  // For local development, proxy API calls to backend
  async rewrites() {
    // In production, don't use rewrites - use direct URLs
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    // In development, proxy to local backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  // Set trailing slash for Netlify compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
