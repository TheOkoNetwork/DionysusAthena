import { Outfit } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/context/ThemeContext';
import ClientLayout from "./client-layout";
import ConfigLoader from "./config-loader"; // adjust path if needed
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>

      {/* <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
      <script>eruda.init();</script> */}

        <ConfigLoader />
        
        <ThemeProvider>
        <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
