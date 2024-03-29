import { Inter } from 'next/font/google';
import Dashboard from '@/components/Dashboard';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
      <html lang="en" className="h-full bg-white">
        <body className={`${inter.className} h-full`}>
          <Dashboard>{children}</Dashboard>
        </body>
      </html>
  );
}
