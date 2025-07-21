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
          <div className="absolute top-0 z-[-2] h-screen w-screen  transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(180,240,250,.5)_100%)]

">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  );
}
