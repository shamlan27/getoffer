import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GetOffer",
  description: "Sri Lanka's premier destination for exclusive discounts.",
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents zooming which can sometimes reveal background
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent', // or 'black'
  },
};

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/ui/Navbar';
import TopTicker from '@/components/ui/TopTicker';

import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function() {
                  try {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.backgroundColor = '#000000';
                    localStorage.setItem('theme', 'dark');
                  } catch (e) {}
                })();
              `,
          }}
        />
      </head>
      <body
        style={{ backgroundColor: '#000000' }}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <div className="absolute top-0 left-0 w-full z-50">
              <TopTicker />
              <Navbar />
            </div>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
