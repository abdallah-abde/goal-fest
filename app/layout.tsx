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
      <body
        className={`${inter.className} flex flex-col bg-secondary h-screen`}
      >
        <header className='fixed z-50 w-full bg-secondary'>
          <NavigationMenu />
        </header>
        <div className='w-full mx-auto flex-1 px-8'>{children}</div>
        <footer className='w-full mx-auto px-8 py-4 border-t-2 bg-secondary fixed z-50 bottom-0'>
          <ul className='flex items-center justify-between'>
            <li>Footer</li>
            <li>&copy;{new Date().getFullYear().toString()}</li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
