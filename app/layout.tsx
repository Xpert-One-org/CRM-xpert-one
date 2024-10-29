import { Khand, Fira_Sans } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import type { Viewport } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Xpert One CRM',
  description: 'Voici le CRM de Xpert One',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const khand = Khand({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-khand',
});

const firaSans = Fira_Sans({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-fira-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="fr"
      className={`${khand.variable} ${firaSans.variable} overflow-hidden`}
    >
      <body className="bg-dark text-foreground">
        <main className="flex min-h-screen flex-col items-center">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
