import { Inter } from 'next/font/google';
import Dashboard from '@/components/Dashboard';
import NotificationHandler from '@/components/NotificationHandler';
import { ToastContainer } from 'react-toastify';
import { ClientProvider } from '@/context/ClientContext';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-bgGray">
      <body className={`${inter.className} h-full`}>
        <ClientProvider>
          <Dashboard>
            <NotificationHandler />
            <ToastContainer />
            {children}
          </Dashboard>
        </ClientProvider>
      </body>
    </html>
  );
}
