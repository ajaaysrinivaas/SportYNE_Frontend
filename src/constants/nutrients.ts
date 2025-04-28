// -------------------------------------------
// src/constants/nutrients.ts
// -------------------------------------------
export interface NutrientColumn {
  key: string;
  label: string;
}

export interface NutrientCategory {
  categoryName: string;
  columns: NutrientColumn[];
}

export const RDA_VALUES: { [key: string]: number } = {
  protein_g: 50,
  carbohydrate_g: 130,
  total_fat_g: 70,
  // energy_kcal: 2000, // Removed if not needed in RDA chart
  vit_c_mg: 90,
  calcium_mg: 1000,
  iron_mg: 18,
  vit_a_mcug_ug: 900,
  vit_d_mcug: 20,
  vit_e_mg: 15,
  vit_k_mcug: 120,
  thiamin_mg: 1.2,
  riboflavin_mg: 1.3,
  niacin_mg: 16,
  vit_b6_mg: 1.3,
  vit_b5_mg: 5,
  vit_b12_mcug: 2.4,
  folate_total_mcug: 400,
  choline_mg: 550,
  magnesium_mg: 420,
  potassium_mg: 4700,
};

export const NUTRIENT_CATEGORIES: NutrientCategory[] = [
  {
    categoryName: "General",
    columns: [
      { key: "water_g", label: "Water (g)" },
      { key: "theobromine_mg", label: "Theobromine (mg)" },
      { key: "alcohol_g", label: "Alcohol (g)" },
      { key: "caffeine_mg", label: "Caffeine (mg)" },
    ],
  },
  {
    categoryName: "Macronutrients",
    columns: [
      { key: "carbohydrate_g", label: "Carbs (g)" },
      { key: "protein_g", label: "Protein (g)" },
      { key: "total_fat_g", label: "Fat (g)" },
      { key: "dietary_fiber_g", label: "Fiber (g)" },
      { key: "total_sugars_g", label: "Sugars (g)" },
      { key: "free_sugars_g", label: "Free Sugars (g)" },
    ],
  },
  {
    categoryName: "Lipids & Cholesterol",
    columns: [
      { key: "sfa_g", label: "Saturated Fat (g)" },
      { key: "mufa_g", label: "Monounsaturated (g)" },
      { key: "pufa_g", label: "Polyunsaturated (g)" },
      { key: "cholesterol_mg", label: "Cholesterol (mg)" },
    ],
  },
  {
    categoryName: "Vitamins",
    columns: [
      { key: "vit_a_mcug_ug", label: "Vitamin A (µg)" },
      { key: "retinol_mcug", label: "Retinol (µg)" },
      { key: "lutein_zeaxanthin_mcug", label: "Lutein+Zeax. (µg)" },
      { key: "carotene_alpha_mcug", label: "Alpha-Caroten. (µg)" },
      { key: "carotene_beta_mcug", label: "Beta-Caroten. (µg)" },
      { key: "carotenoids_ug", label: "Carotenoids (µg)" },
      { key: "cryptoxanthin_beta_mcug", label: "Beta-Crypt. (µg)" },
      { key: "vit_d_mcug", label: "Vitamin D (µg)" },
      { key: "vit_d2_mcug", label: "Vitamin D2 (µg)" },
      { key: "vit_d3_mcug", label: "Vitamin D3 (µg)" },
      { key: "vit_k_mcug", label: "Vitamin K (µg)" },
      { key: "vit_k1_mcug", label: "Vitamin K1 (µg)" },
      { key: "vit_k2_mcug", label: "Vitamin K2 (µg)" },
      { key: "vit_e_mg", label: "Vitamin E (mg)" },
      { key: "vit_e_added_mg", label: "Vit. E added (mg)" },
      { key: "vit_c_mg", label: "Vitamin C (mg)" },
      { key: "thiamin_mg", label: "Thiamin (mg)" },
      { key: "riboflavin_mg", label: "Riboflavin (mg)" },
      { key: "niacin_mg", label: "Niacin (mg)" },
      { key: "vit_b6_mg", label: "Vitamin B6 (mg)" },
      { key: "vit_b5_mg", label: "Vitamin B5 (mg)" },
      { key: "vit_b7_mcug", label: "Vitamin B7 (µg)" },
      { key: "folate_dfe_mcug", label: "Folate DFE (µg)" },
      { key: "folate_food_mcug", label: "Folate Food (µg)" },
      { key: "folate_total_mcug", label: "Folate Total (µg)" },
      { key: "folic_acid_mcug", label: "Folic Acid (µg)" },
      { key: "vit_b12_mcug", label: "Vitamin B12 (µg)" },
      { key: "vit_b12_added_mcug", label: "Vit. B12 added (µg)" },
      { key: "choline_mg", label: "Choline (mg)" },
    ],
  },
  {
    categoryName: "Minerals",
    columns: [
      { key: "calcium_mg", label: "Calcium (mg)" },
      { key: "phosphorus_mg", label: "Phosphorus (mg)" },
      { key: "magnesium_mg", label: "Magnesium (mg)" },
      { key: "sodium_mg", label: "Sodium (mg)" },
      { key: "potassium_mg", label: "Potassium (mg)" },
      { key: "iron_mg", label: "Iron (mg)" },
      { key: "zinc_mg", label: "Zinc (mg)" },
      { key: "copper_mg", label: "Copper (mg)" },
      { key: "selenium_mcug", label: "Selenium (µg)" },
      { key: "chromium_mg", label: "Chromium (mg)" },
      { key: "manganese_mg", label: "Manganese (mg)" },
      { key: "molybdenum_mg", label: "Molybdenum (mg)" },
    ],
  },
];

export const NUTRIENT_INFO: { [key: string]: string } = {
  protein_g: "Essential for muscle repair and growth.",
  carbohydrate_g: "Primary fuel for high-intensity exercise.",
  total_fat_g: "Provides sustained energy and aids hormone production.",
  dietary_fiber_g: "Supports digestive health and steady energy.",
  vit_c_mg: "Boosts immune function and collagen synthesis.",
  calcium_mg: "Essential for bone health and muscle contraction.",
  iron_mg: "Key for oxygen transport and reducing fatigue.",
  sodium_mg: "Aids fluid balance and nerve function.",
  potassium_mg: "Helps regulate muscle contractions and nerve signals.",
};

export const NUTRIENT_LABELS: { [key: string]: string } = NUTRIENT_CATEGORIES
  .flatMap((cat) => cat.columns)
  .reduce((acc, col) => {
    acc[col.key] = col.label;
    return acc;
  }, {} as { [key: string]: string });
