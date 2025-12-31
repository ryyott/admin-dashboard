"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const categories = [
  { value: "new", label: "NEW" },
  { value: "mens", label: "MENS" },
  { value: "womens", label: "WOMENS" },
  { value: "slides", label: "SLIDES" },
  { value: "accessories", label: "ACCESSORIES" },
];

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
}

export function CategoryNav({ activeCategory, onCategoryChange, isFilterOpen, onFilterToggle }: CategoryNavProps) {
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-40 bg-white">
      <div className="relative flex items-center justify-center px-4 py-3">
        {/* Animated Plus icon - left side */}
        <motion.button
          onClick={onFilterToggle}
          className="absolute left-4 text-black transition-opacity hover:opacity-60"
          whileTap={{ scale: 0.92 }}
          animate={{ rotate: isFilterOpen ? 45 : 0 }}
          transition={{
            duration: 0.25,
            ease: [0.21, 0.8, 0.25, 1],
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="10" y1="5" x2="10" y2="15" />
            <line x1="5" y1="10" x2="15" y2="10" />
          </svg>
        </motion.button>

        {/* Centered categories - two lines */}
        <div className="flex flex-col items-center gap-2">
          {/* First line: NEW MENS WOMENS */}
          <div className="flex items-center gap-6">
            {categories.slice(0, 3).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={cn(
                  "text-sm tracking-wider whitespace-nowrap uppercase transition-colors duration-150",
                  activeCategory === cat.value ? "text-black" : "text-[#E5E5E5] hover:text-black/60",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* Second line: SLIDES ACCESSORIES */}
          <div className="flex items-center gap-6">
            {categories.slice(3).map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={cn(
                  "text-sm tracking-wider whitespace-nowrap uppercase transition-colors duration-150",
                  activeCategory === cat.value ? "text-black" : "text-[#E5E5E5] hover:text-black/60",
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spacer for cart icon on right (handled by CartIcon component) */}
      </div>
    </nav>
  );
}
