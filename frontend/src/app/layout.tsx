import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { AuthProvider } from '@/lib/context/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminBar from '@/components/AdminBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VELOCITY | Premium Minimalist Sneakers & Running Shoes',
  description: 'Engineered for speed, built for comfort, and crafted with carbon-neutral materials. Discover the new standard in performance running and lifestyle sneakers by VELOCITY.',
  keywords: 'sneakers, running shoes, eco-friendly shoes, velocity sneakers, minimalist footwear, performance runners',
  openGraph: {
    title: 'VELOCITY | Premium Minimalist Sneakers',
    description: 'Explore high-performance, carbon-neutral activewear and running shoes designed for ultimate speed and durability.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <AdminBar />
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
