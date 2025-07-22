"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="flex justify-between mt-10 items-center">
		<div className="pl-50">
      		<Image  src="/LOGO2.png" alt="Logo" width={150} height={100}></Image>
	 	</div>
      <div>
        <ul className="flex gap-20 text-md font-bold pr-50">
          <li>
            <motion.div
              className="flex flex-col"
              onHoverStart={() => setHoveredItem("home")}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href="#">Home</Link>
              <div
                className={`border-t-4 border-cyan-400 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
                  hoveredItem === "home" ? "w-10/12" : "w-0"
                }`}
              ></div>
            </motion.div>
          </li>
          <li>
            <motion.div
              className="flex flex-col"
              onHoverStart={() => setHoveredItem("favorites")}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href="#">Favorites</Link>
              <div
                className={`border-t-4 border-cyan-400 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
                  hoveredItem === "favorites" ? "w-10/12" : "w-0"
                }`}
              ></div>
            </motion.div>
          </li>
          <li>
            <motion.div
              className="flex flex-col"
              onHoverStart={() => setHoveredItem("help")}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href="#">Help</Link>
              <div
                className={`border-t-4 border-cyan-400 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
                  hoveredItem === "help" ? "w-10/12" : "w-0"
                }`}
              ></div>
            </motion.div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
