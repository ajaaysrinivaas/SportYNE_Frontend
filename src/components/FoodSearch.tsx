"use client";

import React, { useState, useEffect, useRef } from "react";
import { FoodItem } from "../models/foodItems";
import { Icon } from "@iconify/react";

interface FoodSearchProps {
  foodQuery: string;
  setFoodQuery: (query: string) => void;
  onSelectFood: (food: FoodItem) => void;
}

export default function FoodSearch({
  foodQuery,
  setFoodQuery,
  onSelectFood,
}: FoodSearchProps) {
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!foodQuery.trim()) {
      setFilteredFoods([]);
      setErrorMessage(null);
      return;
    }

    const fetchFoods = async () => {
      try {
        const neededFields = ["id", "food_name"].join(",");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/foods/search?query=${encodeURIComponent(
            foodQuery
          )}&fields=${encodeURIComponent(neededFields)}`
        );
        if (!response.ok) {
          const error = await response.json();
          setErrorMessage(error.message || "An error occurred.");
          setFilteredFoods([]);
          return;
        }
        const result: FoodItem[] = await response.json();
        const mapped = result.map((item) => ({
          ...item,
          name: item.food_name ?? item.name ?? "Unknown",
        }));
        setFilteredFoods(mapped.slice(0, 10));
        setErrorMessage(null);
      } catch {
        setErrorMessage("Failed to fetch data. Please try again later.");
        setFilteredFoods([]);
      }
    };

    const timer = setTimeout(() => fetchFoods(), 500);
    return () => clearTimeout(timer);
  }, [foodQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setFilteredFoods([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (food: FoodItem) => {
    onSelectFood(food);
    setFoodQuery(food.food_name || food.name);
    setFilteredFoods([]);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md">
        <Icon icon="mdi:food" className="ml-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search food..."
          value={foodQuery}
          onChange={(e) => setFoodQuery(e.target.value)}
          className="w-full px-4 py-2 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      {filteredFoods.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md max-h-60 overflow-y-auto z-10 shadow-lg">
          {filteredFoods.map((food) => (
            <li
              key={food.id}
              onClick={() => handleSelect(food)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {food.name}
            </li>
          ))}
        </ul>
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
