import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import AuthProvider from './providers/AuthProvider';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GhorChai - Property Listing Platform',
  description: 'Find your dream property in Bangladesh',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        </AuthProvider>
      </body>
    </html>
  );
}