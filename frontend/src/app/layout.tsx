import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SocialFlow AI - AI-Powered Social Media Manager',
  description: 'Generate engaging social media content with AI. Create posts, captions, and images for your brand.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-satoshi antialiased">{children}</body>
    </html>
  );
}
