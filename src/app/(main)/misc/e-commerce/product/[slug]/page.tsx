"use client";

import { useState, use } from "react";

import { notFound, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { getProductBySlug } from "@/data/shop/products";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

import { ProductImageGallery } from "../../_components/product-image-gallery";
import { ProductInfoDrawer } from "../../_components/product-info-drawer";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeDrawerOpen, setSizeDrawerOpen] = useState(false);
  const [showActualSizes, setShowActualSizes] = useState(false);
  const [hoveredSize, setHoveredSize] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    notFound();
  }

  const handleSizeClick = (size: string) => {
    addItem({
      productId: product.id,
      code: product.code,
      slug: product.slug,
      price: product.price,
      size: size,
      qty: 1,
      image: product.images[0],
    });

    toast.success("Added to cart", {
      description: `${product.code} - SIZE ${size}`,
      duration: 2000,
    });

    setSizeDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-[13px] left-4 z-50 text-black transition-opacity hover:opacity-60"
        aria-label="Go back"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
      </button>

      <div className="flex h-screen items-center justify-center p-4 md:p-8">
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl md:max-h-[calc(100vh-4rem)]">
          <ProductImageGallery
            images={product.images}
            code={product.code}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
          />

          <div className="relative mt-2 text-center">
            {/* SKU / SELECT SIZE */}
            <div className="relative mb-3 h-5">
              <AnimatePresence mode="wait">
                {sizeDrawerOpen ? (
                  <>
                    <motion.p
                      key="select-size"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium tracking-widest uppercase"
                    >
                      SELECT SIZE
                    </motion.p>
                    <div
                      className="absolute top-0 right-0 left-0 flex justify-between"
                      style={{ paddingLeft: "calc(16.666% - 10px)", paddingRight: "calc(16.666% - 10px)" }}
                    >
                      <button
                        onMouseEnter={() => setShowActualSizes(true)}
                        onMouseLeave={() => setShowActualSizes(false)}
                        className="transition-opacity hover:opacity-60"
                      >
                        <svg
                          width="10"
                          height="13"
                          viewBox="0 0 11 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="block"
                        >
                          <path d="M5.5 8L5.5 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
                          <path
                            d="M1.5 4.5C1.5 2 4 1 5.5 1C7 1 9.5 2 9.5 4.5C9.5 7 5.5 8 5.5 8"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.5 13.5C5.3619 13.5 5.25 13.3881 5.25 13.25C5.25 13.1119 5.3619 13 5.5 13"
                            stroke="black"
                            strokeWidth="2"
                          />
                          <path
                            d="M5.5 13.5C5.6381 13.5 5.75 13.3881 5.75 13.25C5.75 13.1119 5.6381 13 5.5 13"
                            stroke="black"
                            strokeWidth="2"
                          />
                        </svg>
                      </button>
                      <button onClick={() => setSizeDrawerOpen(false)} className="transition-opacity hover:opacity-60">
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="block"
                        >
                          <path d="M1.5 1.5L13.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                          <path d="M13.5 1.5L1.5 13.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.p
                    key="sku"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium tracking-widest uppercase"
                  >
                    {product.code}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Price */}
            <p className="mb-4 text-center text-xl">${product.price}</p>

            {/* Plus button / Size grid */}
            <AnimatePresence mode="wait">
              {!sizeDrawerOpen ? (
                <motion.button
                  key="plus"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSizeDrawerOpen(true)}
                  className="text-4xl font-light transition-transform hover:scale-105"
                >
                  +
                </motion.button>
              ) : (
                <motion.div
                  key="sizes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    {product.sizes.slice(0, 3).map((size, idx) => (
                      <div key={size.value} className="relative">
                        <button
                          onClick={() => handleSizeClick(size.value)}
                          disabled={!size.available}
                          className={cn(
                            "relative flex h-10 w-full items-center justify-center overflow-hidden text-sm tracking-widest uppercase transition-opacity",
                            size.available ? "hover:opacity-60" : "cursor-not-allowed opacity-30",
                          )}
                        >
                          <span
                            className="relative inline-block min-w-8 overflow-hidden"
                            onMouseEnter={() => setHoveredSize(idx)}
                            onMouseLeave={() => setHoveredSize(null)}
                          >
                            <motion.span
                              initial={false}
                              animate={{
                                y: showActualSizes || hoveredSize === idx ? -24 : 0,
                                opacity: showActualSizes || hoveredSize === idx ? 0 : 1,
                              }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="block h-6 text-center"
                            >
                              {idx + 1}
                            </motion.span>
                            <motion.span
                              initial={false}
                              animate={{
                                y: showActualSizes || hoveredSize === idx ? -24 : 0,
                                opacity: showActualSizes || hoveredSize === idx ? 1 : 0,
                              }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-6 right-0 left-0 block h-6 text-center"
                            >
                              {size.value}
                            </motion.span>
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowInfo(true)}
                    className="w-full text-center text-xs tracking-widest uppercase transition-opacity hover:opacity-60"
                  >
                    INFORMATION
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showInfo && <ProductInfoDrawer product={product} onClose={() => setShowInfo(false)} />}
      </AnimatePresence>
    </div>
  );
}
