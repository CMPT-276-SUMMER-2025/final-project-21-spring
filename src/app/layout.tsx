import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { FavoritesProvider } from "./context/FavoritesContext";

const primaryFont = Funnel_Display({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CloudCue",
  description: "We put the What, When and Where in your Planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${primaryFont.className} antialiased h-full bg-white`}>
        <div className="min-h-screen flex flex-col bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <Navigation />
          <main className="flex-1">
            <FavoritesProvider>{children}</FavoritesProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
