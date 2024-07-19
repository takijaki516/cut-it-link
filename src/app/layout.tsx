import "@/styles/globals.css";

import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

// REVIEW:
export const metadata: Metadata = {
  title: "My link shortener",
  description: "Next.js link shortener",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col`}
      >
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl flex-1 px-4">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
