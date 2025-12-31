export interface Filter {
  id: string;
  label: string;
  type: "size" | "price" | "availability";
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: "size" | "price" | "availability";
  options: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export const filterGroups: FilterGroup[] = [
  {
    id: "sizes",
    label: "SIZE",
    type: "size",
    options: [
      { value: "XS", label: "XS" },
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "XXL", label: "XXL" },
    ],
  },
  {
    id: "price",
    label: "PRICE",
    type: "price",
    options: [
      { value: "0-100", label: "$0 - $100" },
      { value: "100-200", label: "$100 - $200" },
      { value: "200-300", label: "$200 - $300" },
      { value: "300+", label: "$300+" },
    ],
  },
  {
    id: "availability",
    label: "AVAILABILITY",
    type: "availability",
    options: [
      { value: "in-stock", label: "IN STOCK" },
      { value: "out-of-stock", label: "OUT OF STOCK" },
    ],
  },
];
