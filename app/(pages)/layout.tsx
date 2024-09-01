import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import NavigationMenu from "@/components/menus/NavigationMenu";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goal Fest",
  description: "Goal Fest App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='en' suppressHydrationWarning>
        <body className={`${inter.className} bg-secondary h-screen`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <header className='fixed z-50 w-full bg-secondary'>
              <div className='border-b-2 border-primary/50'>
                <NavigationMenu />
              </div>
            </header>
            <main className='mx-auto px-4 md:container'>{children}</main>
            <Toaster />
            <footer className='fixed z-50 bottom-0 w-full bg-secondary'>
              <div className='border-t-2 border-primary/50'>
                <ul className='mx-auto px-4 md:container flex justify-between py-6'>
                  <li>Footer</li>
                  <li>&copy;{new Date().getFullYear().toString()}</li>
                </ul>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
