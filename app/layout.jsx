import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';

import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Productivity Hub',
  description: 'Your all-in-one productivity companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <AppProvider>{children}</AppProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
