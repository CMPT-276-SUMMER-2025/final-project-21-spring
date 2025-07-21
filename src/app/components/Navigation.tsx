"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <nav className="flex flex-row justify-between items-center pl-50 pr-50 h-15 pt-10">
      <h1 className="font-bold text-5xl">CloudCue</h1>
      <div>
        <ul className="flex gap-20 text-md font-bold ">
          <li>
            <motion.div
              className="flex flex-col"
              onHoverStart={() => setHoveredItem("home")}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href="#">Home</Link>
              <div
                className={`border-t-4 border-blue-300 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
                  hoveredItem === "home" ? "w-10/12" : "w-0"
                }`}
              ></div>
            </motion.div>
          </li>
          <li>
            <motion.div
              className="flex flex-col"
              onHoverStart={() => setHoveredItem("activities")}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link href="#">Activities</Link>
              <div
                className={`border-t-4 border-blue-300 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
                  hoveredItem === "activities" ? "w-10/12" : "w-0"
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
                className={`border-t-4 border-blue-300 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
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
                className={`border-t-4 border-blue-300 rounded-xl relative bottom-1 transition-all duration-300 ease-in-out ${
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
