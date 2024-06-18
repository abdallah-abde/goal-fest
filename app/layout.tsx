import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavigationMenu from "@/components/NavigationMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goal Fest",
  description: "Goal Fest App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} flex flex-col h-screen`}>
        <header>
          <NavigationMenu />
        </header>
        <main className='w-full mx-auto px-8 my-8 flex-1 h-screen'>
          {children}
        </main>
        <footer className='w-full mx-auto px-8 py-4 border-t-2'>
          <ul className='flex items-center justify-between'>
            <li>Footer</li>
            <li>&copy;{new Date().getFullYear().toString()}</li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
