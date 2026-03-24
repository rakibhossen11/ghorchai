"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const { checkAuth, isLoading, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    // Check authentication when app loads
    checkAuth();
  }, [checkAuth]);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </body>
      </html>
    );
  }

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-right" />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useAuthStore } from "./store/authStore";
// import Navbar from "./components/Navbar";
// import { Toaster } from "react-hot-toast";
// import "./globals.css";

// export default function RootLayout({ children }) {
//   const { checkAuth, isLoading } = useAuthStore();

//   useEffect(() => {
//     // Check authentication when app loads
//     checkAuth();
//   }, [checkAuth]);

//   if (isLoading) {
//     return (
//       <html lang="en">
//         <body>
//           <div className="min-h-screen flex items-center justify-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//           </div>
//         </body>
//       </html>
//     );
//   }

//   return (
//     <html lang="en">
//       <body>
//         <Navbar />
//         {children}
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }

// import { Inter } from 'next/font/google';
// import './globals.css';
// import Navbar from './components/Navbar';
// import AuthProvider from './providers/AuthProvider';
// import { Toaster } from 'react-hot-toast';
// import Footer from './components/Footer';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata = {
//   title: 'GhorChai - Property Listing Platform',
//   description: 'Find your dream property in Bangladesh',
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* <AuthProvider> */}
//         <Toaster position="top-right" />
//         <div className="min-h-screen flex flex-col">
//           <Navbar />
//           <main className="flex-grow">
//             {children}
//           </main>
//           <Footer />
//         </div>
//         {/* </AuthProvider> */}
//       </body>
//     </html>
//   );
// }