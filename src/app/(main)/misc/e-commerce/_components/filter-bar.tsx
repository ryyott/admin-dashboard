"use client";

import { motion, AnimatePresence } from "framer-motion";

import type { Filter, FilterGroup } from "@/types/filters";

import { FilterChip } from "./filter-chip";

interface FilterBarProps {
  isOpen: boolean;
  activeFilters: Filter[];
  filterGroups: FilterGroup[];
  onFilterToggle: (filter: Filter) => void;
  onFilterRemove: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterBar({
  isOpen,
  activeFilters,
  filterGroups,
  onFilterToggle,
  onFilterRemove,
  onClearAll,
}: FilterBarProps) {
  const isFilterActive = (type: string, value: string) => {
    return activeFilters.some((f) => f.type === type && f.value === value);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="overflow-hidden border-b border-black/10"
    >
      <div className="px-4 py-4">
        {/* Active filters row */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="mb-3 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs tracking-wider text-black/50 uppercase">ACTIVE:</span>
              {activeFilters.map((filter) => (
                <FilterChip
                  key={filter.id}
                  label={filter.label}
                  active={true}
                  onRemove={() => onFilterRemove(filter.id)}
                />
              ))}
              <button
                onClick={onClearAll}
                className="text-xs tracking-wider text-black/40 uppercase underline transition-colors hover:text-black"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter groups */}
        {isOpen && (
          <div className="space-y-4">
            {filterGroups.map((group) => (
              <div key={group.id}>
                <h3 className="mb-2 text-xs tracking-wider text-black/50 uppercase">{group.label}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {group.options.map((option) => {
                    const filter: Filter = {
                      id: `${group.type}-${option.value}`,
                      label: option.label,
                      type: group.type,
                      value: option.value,
                    };
                    const active = isFilterActive(group.type, option.value);

                    return (
                      <FilterChip
                        key={option.value}
                        label={option.label}
                        active={active}
                        onClick={() => onFilterToggle(filter)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
