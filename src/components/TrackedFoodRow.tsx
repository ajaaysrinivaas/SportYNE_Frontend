// components/TrackedFoodRow.tsx

"use client";

import React from "react";
import { TrackedFoodItem } from "../models/trackedFoodItem";
import { NUTRIENT_CATEGORIES } from "../constants/nutrients"; // Removed unused imports

interface TrackedFoodRowProps {
  item: TrackedFoodItem;
  index: number;
  selectedNutrients: string[];
  onRemove: (index: number) => void;
  // Removed onInfo since it's not used in the component
}

const TrackedFoodRow: React.FC<TrackedFoodRowProps> = React.memo(
  ({ item, index, selectedNutrients, onRemove }) => {
    return (
      <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <td className="px-4 py-3 border">{item.name}</td>
        <td className="px-4 py-3 border text-center">{item.portion}</td>
        <td className="px-4 py-3 border capitalize text-center">{item.mealType}</td>
        {NUTRIENT_CATEGORIES.map((cat) => {
          const columnsInUse = cat.columns.filter((c) =>
            selectedNutrients.includes(c.key)
          );
          return columnsInUse.map((col) => {
            const val = item.nutrients[col.key] || 0;
            const totalVal = val * (item.portion || 1);
            return (
              <td key={col.key} className="px-4 py-3 border text-right">
                {val !== 0 ? totalVal.toFixed(2) : "N/A"}
              </td>
            );
          });
        })}
        <td className="px-4 py-3 border text-center">
          <button
            onClick={() => onRemove(index)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
            aria-label={`Remove ${item.name}`}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  }
);

// Setting the display name for the memoized component
TrackedFoodRow.displayName = "TrackedFoodRow";

export default TrackedFoodRow;
