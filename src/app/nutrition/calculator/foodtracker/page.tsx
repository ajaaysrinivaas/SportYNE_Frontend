"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  memo,
  MouseEvent,
} from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Icon } from "@iconify/react";

// Import components consistent with your Nutrition page
import BreadcrumbNavigation from "@/components/page-components/BreadcrumbNavigation";
import ScrollToTopButton from "@/components/ScrollToTopButton";

// Models
import { FoodItem } from "../../../../models/foodItems";
import { TrackedFoodItem } from "../../../../models/trackedFoodItem";

// Components
import FoodSearch from "../../../../components/FoodSearch";
import ChartsSection from "../../../../components/ChartSection";
import NutrientFilter from "../../../../components/NutrientFilter";
import ConfirmationModal from "../../../../components/ConfirmationModal";

// Nutrient constants & types
import {
  RDA_VALUES,
  NUTRIENT_CATEGORIES,
  NUTRIENT_LABELS,
  NUTRIENT_INFO,
} from "../../../../constants/nutrients";

/**
 * Memoized component to render a single table row.
 * It truncates the food name to the first 5 words unless expanded.
 */
const FoodRow = memo(
  ({
    item,
    idx,
    selectedNutrients,
    computeCalories,
    expanded,
    onToggleExpanded,
    onDelete,
  }: {
    item: TrackedFoodItem;
    idx: number;
    selectedNutrients: string[];
    computeCalories: (item: TrackedFoodItem) => number;
    expanded: boolean;
    onToggleExpanded: (idx: number) => void;
    onDelete: (idx: number, e: MouseEvent<HTMLButtonElement>) => void;
  }) => {
    const words = item.name.split(" ");
    const displayName =
      expanded || words.length <= 5
        ? item.name
        : words.slice(0, 5).join(" ") + "...";

    return (
      <tr
        className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={() => onToggleExpanded(idx)}
      >
        <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
          {displayName}
        </td>
        <td className="px-2 sm:px-4 py-2 border text-center text-sm">
          {item.portion}
        </td>
        <td className="px-2 sm:px-4 py-2 border text-center text-sm">
          {computeCalories(item).toFixed(2)}
        </td>
        <td className="px-2 sm:px-4 py-2 border text-center text-sm capitalize">
          {item.mealType}
        </td>
        {NUTRIENT_CATEGORIES.map((cat) => {
          const columnsInUse = cat.columns.filter((c) =>
            selectedNutrients.includes(c.key)
          );
          return columnsInUse.map((col) => {
            const val = item.nutrients[col.key] || 0;
            const totalVal = val * (item.portion || 1);
            return (
              <td
                key={col.key}
                className="px-2 sm:px-4 py-2 border text-right text-sm"
              >
                {val !== 0 ? totalVal.toFixed(2) : "N/A"}
              </td>
            );
          });
        })}
        <td className="px-2 sm:px-4 py-2 border text-center">
          <button
            onClick={(e) => onDelete(idx, e)}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition duration-200 text-sm"
            aria-label={`Remove ${item.name}`}
          >
            <Icon icon="mdi:delete" className="inline-block align-middle" />{" "}
            Remove
          </button>
        </td>
      </tr>
    );
  }
);

FoodRow.displayName = "FoodRow";

export default function FoodTracker() {
  // State variables
  const [trackedFoods, setTrackedFoods] = useState<TrackedFoodItem[]>([]);
  const [foodQuery, setFoodQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portion, setPortion] = useState<number>(1);
  const [mealType, setMealType] = useState("breakfast");
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([
    "protein_g",
    "carbohydrate_g",
    "total_fat_g",
    "vit_c_mg",
  ]);
  const [infoNutrient, setInfoNutrient] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [foodToDelete, setFoodToDelete] = useState<number | null>(null);

  // For toggling expanded food names
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>(
    {}
  );

  // Ref for animating the table container
  const tableRef = useRef<HTMLDivElement | null>(null);

  // GSAP animation for table on update
  useEffect(() => {
    if (tableRef.current) {
      gsap.from(tableRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, []);

  // Helper function to compute calories for a food item
  const computeCalories = (item: TrackedFoodItem) => {
    if (item.nutrients["energy_kcal"]) {
      return item.nutrients["energy_kcal"] * (item.portion || 1);
    }
    const fallbackCals =
      ((item.nutrients["protein_g"] || 0) * 4 +
        (item.nutrients["carbohydrate_g"] || 0) * 4 +
        (item.nutrients["total_fat_g"] || 0) * 9) *
      (item.portion || 1);
    return fallbackCals;
  };

  /**
   * Fetches nutrient data for a given food item.
   */
  const fetchNutrientsForFood = async (
    foodId: string,
    nutrients: string[]
  ): Promise<{ [key: string]: number }> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/foods/${foodId}/nutrients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nutrients }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch nutrients.");
      }
      const data = await response.json();
      return data.nutrients;
    } catch (error) {
      console.error(error);
      return {};
    }
  };

  /**
   * Adds the selected food to the tracked list.
   */
  const handleAddFood = async () => {
    if (!selectedFood) return;
    setIsLoading(true);
    setFetchError(null);

    const foodIdString = selectedFood.id.toString();
    const nutrients = await fetchNutrientsForFood(
      foodIdString,
      selectedNutrients
    );

    const tracked: TrackedFoodItem = {
      ...selectedFood,
      portion,
      mealType,
      nutrients,
    };

    setTrackedFoods((prev) => [...prev, tracked]);
    setSelectedFood(null);
    setFoodQuery("");
    setPortion(1);
    setIsLoading(false);
  };

  /**
   * Initiates deletion by opening the confirmation modal.
   */
  const initiateDeleteFood = (index: number) => {
    setFoodToDelete(index);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirms deletion of a food item.
   */
  const confirmDeleteFood = () => {
    if (foodToDelete !== null) {
      setTrackedFoods((prev) => prev.filter((_, i) => i !== foodToDelete));
      setFoodToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDeleteFood = () => {
    setFoodToDelete(null);
    setIsDeleteModalOpen(false);
  };

  /**
   * Updates nutrient data for all tracked foods when selectedNutrients change.
   */
  useEffect(() => {
    const updateNutrients = async () => {
      if (trackedFoods.length === 0) return;
      setIsLoading(true);
      setFetchError(null);
      try {
        const updatedFoods = await Promise.all(
          trackedFoods.map(async (food) => {
            const foodIdString = food.id.toString();
            const nutrients = await fetchNutrientsForFood(
              foodIdString,
              selectedNutrients
            );
            return { ...food, nutrients };
          })
        );
        setTrackedFoods(updatedFoods);
      } catch {
        setFetchError("Failed to update nutrient data.");
      } finally {
        setIsLoading(false);
      }
    };
    updateNutrients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNutrients]);

  /**
   * Calculates total nutrient consumption.
   */
  const totals = useMemo(() => {
    const result: { [key: string]: number } = {};
    for (const key of selectedNutrients) {
      result[key] = trackedFoods.reduce((acc, item) => {
        const val = item.nutrients[key] || 0;
        return acc + val * (item.portion || 1);
      }, 0);
    }
    return result;
  }, [trackedFoods, selectedNutrients]);

  /**
   * Prepares chart data for RDA Progress and macro distributions.
   */
  const nutrientsWithRDA = useMemo(() => {
    return selectedNutrients.filter(
      (key) => RDA_VALUES[key] != null && key !== "energy_kcal"
    );
  }, [selectedNutrients]);

  const progressData = useMemo(() => {
    return {
      labels: nutrientsWithRDA.map((key) => NUTRIENT_LABELS[key] || key),
      datasets: [
        {
          label: "RDA Progress (%)",
          data: nutrientsWithRDA.map((key) => {
            const consumed = totals[key] || 0;
            const rda = RDA_VALUES[key] || 1;
            const pct = (consumed / rda) * 100;
            return pct > 100 ? 100 : pct;
          }),
          backgroundColor: "#4caf50",
        },
      ],
    };
  }, [nutrientsWithRDA, totals]);

  const macroTotals = useMemo(() => {
    const protein = trackedFoods.reduce(
      (acc, item) =>
        acc + (item.nutrients["protein_g"] || 0) * (item.portion || 1),
      0
    );
    const carbs = trackedFoods.reduce(
      (acc, item) =>
        acc + (item.nutrients["carbohydrate_g"] || 0) * (item.portion || 1),
      0
    );
    const fat = trackedFoods.reduce(
      (acc, item) =>
        acc + (item.nutrients["total_fat_g"] || 0) * (item.portion || 1),
      0
    );
    return { protein, carbs, fat };
  }, [trackedFoods]);

  const macroPieData = useMemo(() => {
    const { protein, carbs, fat } = macroTotals;
    return {
      labels: ["Protein (g)", "Carbs (g)", "Fat (g)"],
      datasets: [
        {
          data: [protein, carbs, fat],
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };
  }, [macroTotals]);

  const mealPieCharts = useMemo(() => {
    const mealTypes = ["breakfast", "lunch", "dinner"];
    return mealTypes.map((meal) => {
      const mealData = trackedFoods.filter((f) => f.mealType === meal);
      const protein = mealData.reduce(
        (acc, item) =>
          acc + (item.nutrients["protein_g"] || 0) * (item.portion || 1),
        0
      );
      const carbs = mealData.reduce(
        (acc, item) =>
          acc + (item.nutrients["carbohydrate_g"] || 0) * (item.portion || 1),
        0
      );
      const fat = mealData.reduce(
        (acc, item) =>
          acc + (item.nutrients["total_fat_g"] || 0) * (item.portion || 1),
        0
      );
      return {
        meal,
        data: {
          labels: ["Protein (g)", "Carbs (g)", "Fat (g)"],
          datasets: [
            {
              data: [protein, carbs, fat],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        },
      };
    });
  }, [trackedFoods]);

  const totalCalories = useMemo(() => {
    return trackedFoods.reduce((acc, item) => acc + computeCalories(item), 0);
  }, [trackedFoods]);

  const toggleRowExpanded = (idx: number) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/nutrition.webp"
          alt="Nutrition Background"
          fill
          priority
          className="object-cover filter blur-sm"
          style={{
            mixBlendMode: "overlay",
            backgroundColor: "rgba(245,240,235,1)",
          }}
        />
        <div className="absolute inset-0 bg-[rgba(255,255,255,0.15)] dark:bg-[rgba(20,20,20,0.6)] pointer-events-none"></div>
      </div>

      {/* Breadcrumb Navigation */}
      <header className="mx-4 sm:mx-6 lg:mx-16 mt-6">
        <BreadcrumbNavigation
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Nutrition", href: "/nutrition" },
            { label: "Food Tracker", href: "/nutrition/calculator/foodtracker" },
          ]}
        />
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 mx-4 sm:mx-6 lg:mx-16 my-6 p-4 sm:p-6 lg:p-8 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-[20px] sm:rounded-[30px] shadow-lg">
        {/* Header */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">
            Food Tracker
          </h1>
          <p className="text-lg italic dark:text-gray-300">
            Track your daily intake (per 100g basis).
          </p>
        </section>

        {/* Filter & Search */}
        <section className="mb-12">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <NutrientFilter
              selectedNutrients={selectedNutrients}
              onChange={setSelectedNutrients}
            />
            <div className="flex-1">
              <FoodSearch
                foodQuery={foodQuery}
                setFoodQuery={setFoodQuery}
                onSelectFood={(food) => setSelectedFood(food)}
              />
            </div>
          </div>

          {/* Meal, Portion & Add */}
          <div className="flex flex-wrap items-center gap-6">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <input
              type="number"
              value={portion}
              min={0.1}
              step={0.1}
              onChange={(e) => setPortion(parseFloat(e.target.value))}
              placeholder="Portion"
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md w-24 focus:outline-none"
            />
            <button
              onClick={handleAddFood}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition duration-200 flex items-center gap-2"
              disabled={isLoading}
            >
              <Icon icon="mdi:plus" />{" "}
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
          {fetchError && <p className="text-red-500 mt-3">{fetchError}</p>}
        </section>

        {/* Daily Intake Table */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 font-semibold dark:text-white">
            Your Daily Intake
          </h2>
          {trackedFoods.length > 0 ? (
            <div className="overflow-x-auto" ref={tableRef}>
              <table className="min-w-full bg-white dark:bg-gray-800 border-collapse shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th
                      rowSpan={2}
                      className="px-2 sm:px-4 py-2 border text-left text-sm"
                    >
                      Food
                    </th>
                    <th
                      rowSpan={2}
                      className="px-2 sm:px-4 py-2 border text-center text-sm"
                    >
                      Portion
                    </th>
                    <th
                      rowSpan={2}
                      className="px-2 sm:px-4 py-2 border text-center text-sm"
                    >
                      Calories
                    </th>
                    <th
                      rowSpan={2}
                      className="px-2 sm:px-4 py-2 border text-center text-sm"
                    >
                      Meal
                    </th>
                    {NUTRIENT_CATEGORIES.map((cat) => {
                      const columnsInUse = cat.columns.filter((c) =>
                        selectedNutrients.includes(c.key)
                      );
                      if (columnsInUse.length === 0) return null;
                      return (
                        <th
                          key={cat.categoryName}
                          colSpan={columnsInUse.length}
                          className="px-2 sm:px-4 py-2 border text-center text-sm"
                        >
                          {cat.categoryName}
                        </th>
                      );
                    })}
                    <th
                      rowSpan={2}
                      className="px-2 sm:px-4 py-2 border text-center text-sm"
                    >
                      Actions
                    </th>
                  </tr>
                  <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    {NUTRIENT_CATEGORIES.map((cat) => {
                      const columnsInUse = cat.columns.filter((c) =>
                        selectedNutrients.includes(c.key)
                      );
                      return columnsInUse.map((col) => (
                        <th
                          key={col.key}
                          className="px-2 sm:px-4 py-1 border text-center text-xs sm:text-sm"
                        >
                          {col.label}{" "}
                          {NUTRIENT_INFO[col.key] && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setInfoNutrient(col.key);
                              }}
                              className="text-blue-500 ml-1"
                              aria-label={`Info about ${col.label}`}
                            >
                              <Icon icon="mdi:information-outline" />
                            </button>
                          )}
                        </th>
                      ));
                    })}
                  </tr>
                </thead>
                <tbody>
                  {trackedFoods.map((item, idx) => (
                    <FoodRow
                      key={idx}
                      item={item}
                      idx={idx}
                      selectedNutrients={selectedNutrients}
                      computeCalories={computeCalories}
                      expanded={!!expandedRows[idx]}
                      onToggleExpanded={toggleRowExpanded}
                      onDelete={(idx, e) => {
                        e.stopPropagation();
                        initiateDeleteFood(idx);
                      }}
                    />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                    <td
                      colSpan={4}
                      className="px-2 sm:px-4 py-2 text-right font-semibold text-sm"
                    >
                      Total Calories:
                    </td>
                    <td className="px-2 sm:px-4 py-2 font-semibold text-right text-sm">
                      {totalCalories.toFixed(2)}
                    </td>
                    {NUTRIENT_CATEGORIES.map((cat) => {
                      const columnsInUse = cat.columns.filter((c) =>
                        selectedNutrients.includes(c.key)
                      );
                      return columnsInUse.map((c) => (
                        <td key={c.key} className="px-2 sm:px-4 py-2" />
                      ));
                    })}
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No foods tracked yet.
            </p>
          )}
        </section>

        {/* Nutrients Summary */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 font-semibold dark:text-white">
            Nutrients Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="px-2 sm:px-4 py-2 border text-left text-sm">
                    Nutrient
                  </th>
                  <th className="px-2 sm:px-4 py-2 border text-right text-sm">
                    Consumed
                  </th>
                  <th className="px-2 sm:px-4 py-2 border text-right text-sm">
                    RDA
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedNutrients.map((key) => {
                  const consumed = totals[key] || 0;
                  const rda = RDA_VALUES[key] ?? null;
                  return (
                    <tr
                      key={key}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-2 sm:px-4 py-2 border flex items-center text-sm">
                        {NUTRIENT_LABELS[key] || key}{" "}
                        {NUTRIENT_INFO[key] && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInfoNutrient(key);
                            }}
                            className="text-blue-500 ml-1"
                            aria-label={`Info about ${NUTRIENT_LABELS[key] || key}`}
                          >
                            <Icon icon="mdi:information-outline" />
                          </button>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border text-right text-sm">
                        {consumed ? consumed.toFixed(2) : "N/A"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 border text-right text-sm">
                        {rda ?? "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Charts Section */}
        <ChartsSection
          macroPieData={macroPieData}
          progressData={progressData}
          mealPieCharts={mealPieCharts}
        />

        {/* Nutrient Info Modal */}
        {infoNutrient && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setInfoNutrient(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative"
            >
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                {NUTRIENT_LABELS[infoNutrient] || infoNutrient}
              </h2>
              <p className="mb-6 dark:text-gray-300">
                {NUTRIENT_INFO[infoNutrient] ||
                  "No additional information available."}
              </p>
              <button
                onClick={() => setInfoNutrient(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <Icon icon="mdi:close" />
              </button>
              <button
                onClick={() => setInfoNutrient(null)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <ConfirmationModal
            title="Confirm Deletion"
            message="Are you sure you want to remove this food item?"
            onConfirm={confirmDeleteFood}
            onCancel={cancelDeleteFood}
          />
        )}
      </main>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
