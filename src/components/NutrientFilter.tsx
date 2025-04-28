"use client";

import React, { useState } from "react";
import { NUTRIENT_CATEGORIES } from "../constants/nutrients";
import { Icon } from "@iconify/react";

interface NutrientFilterProps {
  selectedNutrients: string[];
  onChange: (nutrients: string[]) => void;
}

export default function NutrientFilter({ selectedNutrients, onChange }: NutrientFilterProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleToggle = (key: string) => {
    if (selectedNutrients.includes(key)) {
      onChange(selectedNutrients.filter((k) => k !== key));
    } else {
      onChange([...selectedNutrients, key]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {NUTRIENT_CATEGORIES.map((cat, idx) => (
        <div key={cat.categoryName} className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 dark:text-white flex items-center gap-1"
          >
            {cat.categoryName}
            <Icon icon={openDropdown === idx ? "mdi:chevron-up" : "mdi:chevron-down"} />
          </button>
          {openDropdown === idx && (
            <div className="absolute z-10 mt-1 py-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow">
              {cat.columns.map((col) => {
                const checked = selectedNutrients.includes(col.key);
                return (
                  <label
                    key={col.key}
                    className="flex items-center px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={() => handleToggle(col.key)}
                    />
                    {col.label}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
