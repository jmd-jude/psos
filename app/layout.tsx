// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Local Imports
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// Server Action Import
import { getVerticals } from './actions';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- Metadata ---
export const metadata: Metadata = {
  title: 'PSOS Prototype',
  description: 'Product Strategy & Opportunity Scoring Application',
};

// --- Layout Component (Server Component) ---
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. FETCH DATA: This runs on the server (during rendering)
  const verticals = await getVerticals();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          {/* 2. PASS DATA: Pass the fetched data to the Sidebar */}
          <Sidebar verticals={verticals} />

          <div className="ml-[280px] flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-6 bg-background">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
