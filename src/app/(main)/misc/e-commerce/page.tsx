"use client";

import { useState, useMemo } from "react";

import { getProductsByCategory } from "@/data/shop/products";
import { filterGroups, type Filter } from "@/types/filters";

import { CategoryNav } from "./_components/category-nav";
import { FilterBar } from "./_components/filter-bar";
import { ProductCard } from "./_components/product-card";
import { ProductSearch } from "./_components/product-search";

export default function ShopPage() {
  const [category, setCategory] = useState("new");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allProducts = getProductsByCategory(category);

  // Apply filters and search to products
  const filteredProducts = useMemo(() => {
    let products = allProducts;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );
      });
    }

    // Apply filters
    if (activeFilters.length === 0) return products;

    return products.filter((product) => {
      // Size filter
      const sizeFilters = activeFilters.filter((f) => f.type === "size");
      if (sizeFilters.length > 0) {
        const hasMatchingSize = sizeFilters.some((filter) =>
          product.sizes.some((size) => size.value === filter.value && size.available),
        );
        if (!hasMatchingSize) return false;
      }

      // Price filter
      const priceFilters = activeFilters.filter((f) => f.type === "price");
      if (priceFilters.length > 0) {
        const matchesPrice = priceFilters.some((filter) => {
          if (filter.value === "0-100") {
            return product.price >= 0 && product.price <= 100;
          } else if (filter.value === "100-200") {
            return product.price > 100 && product.price <= 200;
          } else if (filter.value === "200-300") {
            return product.price > 200 && product.price <= 300;
          } else if (filter.value === "300+") {
            return product.price > 300;
          }
          return false;
        });
        if (!matchesPrice) return false;
      }

      // Availability filter
      const availabilityFilters = activeFilters.filter((f) => f.type === "availability");
      if (availabilityFilters.length > 0) {
        const matchesAvailability = availabilityFilters.some((filter) => {
          if (filter.value === "in-stock") {
            return product.inStock;
          } else if (filter.value === "out-of-stock") {
            return !product.inStock;
          }
          return false;
        });
        if (!matchesAvailability) return false;
      }

      return true;
    });
  }, [allProducts, activeFilters, searchQuery]);

  const handleFilterToggle = (filter: Filter) => {
    setActiveFilters((prev) => {
      const exists = prev.some((f) => f.id === filter.id);
      if (exists) {
        return prev.filter((f) => f.id !== filter.id);
      } else {
        return [...prev, filter];
      }
    });
  };

  const handleFilterRemove = (filterId: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Optionally clear filters when changing categories
    // setActiveFilters([]);
  };

  return (
    <>
      <CategoryNav
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
        isFilterOpen={isFilterOpen}
        onFilterToggle={() => setIsFilterOpen((prev) => !prev)}
      />
      <FilterBar
        isOpen={isFilterOpen}
        activeFilters={activeFilters}
        filterGroups={filterGroups}
        onFilterToggle={handleFilterToggle}
        onFilterRemove={handleFilterRemove}
        onClearAll={handleClearAllFilters}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <ProductSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-xs tracking-wide text-black/40 uppercase">NO PRODUCTS FOUND</p>
          </div>
        )}
      </div>
    </>
  );
}
