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
      layout
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="overflow-hidden border-b border-black/10"
    >
      <div className="px-4 py-4">
        {/* Active filters row */}
        <AnimatePresence mode="popLayout">
          {activeFilters.length > 0 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mb-3 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs tracking-wider text-black/50 uppercase">ACTIVE:</span>
              {activeFilters.map((filter, i) => (
                <motion.div
                  key={filter.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.25,
                    delay: i * 0.02,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <FilterChip label={filter.label} active={true} onRemove={() => onFilterRemove(filter.id)} />
                </motion.div>
              ))}
              <motion.button
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClearAll}
                className="text-xs tracking-wider text-black/40 uppercase underline transition-colors hover:text-black"
              >
                Clear All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter groups */}
        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              className="space-y-4"
            >
              {filterGroups.map((group, groupIdx) => (
                <motion.div
                  key={group.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.25,
                    delay: groupIdx * 0.05,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <h3 className="mb-2 text-xs tracking-wider text-black/50 uppercase">{group.label}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {group.options.map((option, optIdx) => {
                      const filter: Filter = {
                        id: `${group.type}-${option.value}`,
                        label: option.label,
                        type: group.type,
                        value: option.value,
                      };
                      const active = isFilterActive(group.type, option.value);

                      return (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: groupIdx * 0.05 + optIdx * 0.02,
                            ease: [0.19, 1, 0.22, 1],
                          }}
                        >
                          <FilterChip label={option.label} active={active} onClick={() => onFilterToggle(filter)} />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
