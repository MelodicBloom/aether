import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AETHER — Iridescent Shader Library',
  description: 'Premium iridescent GLSL shader components for React / Next.js. Semantic controls, live preview, free and paid tiers.',
  openGraph: {
    title: 'AETHER',
    description: 'Premium iridescent GLSL shader components for React / Next.js.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06060e] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
