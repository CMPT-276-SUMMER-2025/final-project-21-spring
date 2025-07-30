"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-12 px-8 mt-25">
        <div className="font-bold text-gray-600 border-t  mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © 2025 CloudCue. Made in Beautiful British Columbia.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-sm">Follow the weather:</span>
            <div className="flex gap-2">
              <span className="text-xl">🌤️</span>
              <span className="text-xl">🌧️</span>
              <span className="text-xl">❄️</span>
              <span className="text-xl">☀️</span>
            </div>
          </div>
        </div>
    </footer>
  );
}
