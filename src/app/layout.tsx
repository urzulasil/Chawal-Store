import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/Toaster';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Premium Rice Store | URUZ UL ASIL',
  description: 'Farm fresh premium quality Basmati rice at your doorstep. Quality you can trust, purity you can taste.',
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5 };

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase not configured or unreachable; show app without user
  }

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fb] via-[#f8f9fa] to-[#f5f7fb] text-gray-900 font-sans antialiased">
        <SmoothScrollProvider>
          <Header user={user} />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
