// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth-provider';
import { ReactQueryProvider } from '@/components/query-provider';
import Header from '@/components/Constants/Header';
import Footer from '@/components/Constants/Footer';
import Cart from '@/components/Cart';
import { StorageCleanupProvider } from '@/components/StorageCleanupProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Deploy Faster Ecommerce Website',
  description: 'Modern Ecommerce Store built by Deploy Faster',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <StorageCleanupProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Cart />
            </StorageCleanupProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
