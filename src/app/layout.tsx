import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AETHER — Iridescent Shader Library',
  description: 'Production-ready iridescent GLSL surfaces for React and Next.js.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
