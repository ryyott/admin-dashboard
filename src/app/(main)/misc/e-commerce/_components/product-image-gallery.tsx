"use client";

import { useRef, useEffect, useState } from "react";

import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  code: string;
  selectedImage: number;
  onSelectImage: (index: number) => void;
}

export function ProductImageGallery({ images, code, selectedImage, onSelectImage }: ProductImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);

        // Snap to closest image after scroll ends
        const scrollTop = container.scrollTop;
        const imageHeight = container.clientHeight;
        const closestIndex = Math.round(scrollTop / imageHeight);

        onSelectImage(Math.min(Math.max(closestIndex, 0), images.length - 1));
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [images.length, onSelectImage]);

  // Scroll to selected image when it changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isScrolling) return;

    const imageHeight = container.clientHeight;
    container.scrollTo({
      top: selectedImage * imageHeight,
      behavior: "smooth",
    });
  }, [selectedImage, isScrolling]);

  const handlePrevious = () => {
    onSelectImage((selectedImage - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    onSelectImage((selectedImage + 1) % images.length);
  };

  return (
    <div className="relative h-[60vh] max-h-[500px]">
      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar relative h-full overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {images.map((image, idx) => (
          <div
            key={idx}
            className="relative h-[60vh] max-h-[500px] w-full flex-shrink-0"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative h-full overflow-hidden rounded-3xl">
              <Image
                src={image}
                alt={`${code} - Image ${idx + 1}`}
                fill
                className="object-contain"
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="group absolute top-1/2 left-4 z-10 -translate-y-1/2"
            aria-label="Previous image"
          >
            <div className="bg-background/80 border-border/40 hover:bg-background hover:border-border flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95">
              <ChevronLeft
                className="text-foreground h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                strokeWidth={2}
              />
            </div>
          </button>
          <button
            onClick={handleNext}
            className="group absolute top-1/2 right-4 z-10 -translate-y-1/2"
            aria-label="Next image"
          >
            <div className="bg-background/80 border-border/40 hover:bg-background hover:border-border flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95">
              <ChevronRight
                className="text-foreground h-5 w-5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </div>
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onSelectImage(idx)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                idx === selectedImage ? "bg-black" : "bg-black/30",
              )}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
