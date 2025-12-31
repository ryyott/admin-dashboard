"use client";

import { useState, useMemo } from "react";

import { Plus, Trash2, Package, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calculateItemTotal } from "@/lib/invoice-math";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsEditorProps {
  items: InvoiceItem[];
  currency: string;
  onChange: (items: InvoiceItem[]) => void;
}

// Prefilled product catalog with images
const PRODUCT_CATALOG = [
  {
    id: "prod-1",
    name: 'Monitor Bold G27 27" 240hz 4K',
    price: 306.41,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop",
  },
  {
    id: "prod-2",
    name: "Keyboard NEST75 TKL 75%",
    price: 126.44,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop",
  },
  {
    id: "prod-3",
    name: "Mouse Logitech MX Master 3S",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop",
  },
  {
    id: "prod-4",
    name: "Webcam 4K Pro Ultra HD",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=100&h=100&fit=crop",
  },
  {
    id: "prod-5",
    name: "Desk Lamp LED Smart",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop",
  },
  {
    id: "prod-6",
    name: "Headset Audio Pro Max",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&h=100&fit=crop",
  },
];

export function InvoiceItemsEditor({ items, currency, onChange }: InvoiceItemsEditorProps) {
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return PRODUCT_CATALOG;

    const query = productSearch.toLowerCase();
    return PRODUCT_CATALOG.filter((product) => product.name.toLowerCase().includes(query));
  }, [productSearch]);

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onChange([...items, newItem]);
  };

  const handleAddProductFromCatalog = (product: (typeof PRODUCT_CATALOG)[0]) => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: product.name,
      image: product.image,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    };
    onChange([...items, newItem]);
    setIsProductPickerOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Recalculate total when quantity or unit price changes
        if (field === "quantity" || field === "unitPrice") {
          updated.total = calculateItemTotal(updated.quantity, updated.unitPrice);
        }

        return updated;
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-foreground/90 text-sm font-medium">Items</label>
        <div className="flex gap-2">
          <Popover open={isProductPickerOpen} onOpenChange={setIsProductPickerOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="border-border/50 h-9 gap-2">
                <Package className="size-4" />
                Browse Products
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <div className="space-y-3 border-b p-3">
                <div>
                  <h4 className="font-medium">Product Catalog</h4>
                  <p className="text-muted-foreground text-xs">Select from available products</p>
                </div>
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-muted/30 h-9 pl-10"
                  />
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto p-2">
                <div className="space-y-1">
                  {filteredProducts.length === 0 ? (
                    <div className="text-muted-foreground p-8 text-center text-sm">No products found</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleAddProductFromCatalog(product)}
                        className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
                      >
                        <img src={product.image} alt={product.name} className="size-12 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{product.name}</p>
                          <p className="text-muted-foreground text-sm">{formatCurrency(product.price, { currency })}</p>
                        </div>
                        <Plus className="text-muted-foreground size-4" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="border-border/50 h-9 gap-2"
          >
            <Plus className="size-4" />
            Custom Item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="border-border/50 bg-muted/20 rounded-lg border border-dashed p-8 text-center">
          <Package className="text-muted-foreground/60 mx-auto mb-3 size-12" />
          <p className="text-muted-foreground mb-4 text-sm">No items added yet</p>
          <div className="flex justify-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="default" size="sm" className="gap-2">
                  <Package className="size-4" />
                  Browse Products
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="center">
                <div className="space-y-3 border-b p-3">
                  <div>
                    <h4 className="font-medium">Product Catalog</h4>
                    <p className="text-muted-foreground text-xs">Select from available products</p>
                  </div>
                  <div className="relative">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-muted/30 h-9 pl-10"
                    />
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto p-2">
                  <div className="space-y-1">
                    {filteredProducts.length === 0 ? (
                      <div className="text-muted-foreground p-8 text-center text-sm">No products found</div>
                    ) : (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleAddProductFromCatalog(product)}
                          className="hover:bg-accent flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors"
                        >
                          <img src={product.image} alt={product.name} className="size-12 rounded object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{product.name}</p>
                            <p className="text-muted-foreground text-sm">
                              {formatCurrency(product.price, { currency })}
                            </p>
                          </div>
                          <Plus className="text-muted-foreground size-4" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-2">
              <Plus className="size-4" />
              Custom Item
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-border/50 overflow-hidden rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-border/50 border-b">
                <tr>
                  <th className="text-muted-foreground/90 p-3 text-left text-xs font-semibold">Description</th>
                  <th className="text-muted-foreground/90 w-24 p-3 text-left text-xs font-semibold">Quantity</th>
                  <th className="text-muted-foreground/90 w-32 p-3 text-left text-xs font-semibold">Unit Price</th>
                  <th className="text-muted-foreground/90 w-32 p-3 text-right text-xs font-semibold">Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-border/30 divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-muted/20 transition-colors">
                    <td className="p-2.5">
                      <Input
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                        placeholder="Item description"
                        className="focus-visible:ring-ring h-9 border-0 bg-transparent px-2 focus-visible:ring-1 focus-visible:ring-offset-0"
                      />
                    </td>
                    <td className="p-2.5">
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-ring h-9 border-0 bg-transparent px-2 focus-visible:ring-1 focus-visible:ring-offset-0"
                      />
                    </td>
                    <td className="p-2.5">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="focus-visible:ring-ring h-9 border-0 bg-transparent px-2 focus-visible:ring-1 focus-visible:ring-offset-0"
                      />
                    </td>
                    <td className="p-2.5 text-right text-sm font-semibold tabular-nums">
                      {formatCurrency(item.total, {
                        currency: currency,
                      })}
                    </td>
                    <td className="p-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="size-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="text-muted-foreground hover:text-destructive size-4 transition-colors" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
