"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Currency } from "@/types/invoice";

const CURRENCIES = [
  { value: "USD" as Currency, label: "USD - United States Dollar", flag: "🇺🇸" },
  { value: "EUR" as Currency, label: "EUR - Euro", flag: "🇪🇺" },
  { value: "GBP" as Currency, label: "GBP - British Pound", flag: "🇬🇧" },
  { value: "CAD" as Currency, label: "CAD - Canadian Dollar", flag: "🇨🇦" },
  { value: "AUD" as Currency, label: "AUD - Australian Dollar", flag: "🇦🇺" },
  { value: "JPY" as Currency, label: "JPY - Japanese Yen", flag: "🇯🇵" },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const selectedCurrency = CURRENCIES.find((curr) => curr.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue>
          {selectedCurrency && (
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedCurrency.flag}</span>
              <span>{selectedCurrency.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((curr) => (
          <SelectItem key={curr.value} value={curr.value}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{curr.flag}</span>
              <span>{curr.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
