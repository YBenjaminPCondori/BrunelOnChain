
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "brunelOnChain",
  description: "Hackathon MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground font-sans`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight">brunelOnChain</span>
                </Link>
                <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium">
                  <Link href="/" className="transition-colors hover:text-primary">
                    Themes
                  </Link>
                  <Link href="/onboard" className="transition-colors hover:text-primary">
                    Onboard
                  </Link>
                  <Link href="/trade" className="transition-colors hover:text-primary">
                    Trade
                  </Link>
                  <Link href="/activity" className="transition-colors hover:text-primary">
                    Activity
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1 container py-8 px-4 md:px-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
