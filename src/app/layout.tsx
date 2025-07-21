import type { Metadata } from "next";
import { Funnel_Display } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

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
    <html lang="en">
      <body className={`${primaryFont.className} antialiased`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#0af_100%)]">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
