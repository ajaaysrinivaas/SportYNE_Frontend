// -------------------------------------------
// src/models/foodItems.ts
// -------------------------------------------
export interface FoodItem {
  id: number;
  food_name?: string;
  name: string;

  energy_kcal: number | null;
  energy_kj: number | null;
  carbohydrate_g: number | null;
  protein_g: number | null;
  total_fat_g: number | null;
  dietary_fiber_g: number | null;
  total_sugars_g: number | null;
  free_sugars_g: number | null;
  water_g: number | null;
  sfa_g: number | null;
  mufa_g: number | null;
  pufa_g: number | null;
  cholesterol_mg: number | null;

  vit_a_mcug_ug: number | null;
  retinol_mcug: number | null;
  lutein_zeaxanthin_mcug: number | null;
  carotene_alpha_mcug: number | null;
  carotene_beta_mcug: number | null;
  carotenoids_ug: number | null;
  vit_d_mcug: number | null;
  vit_d2_mcug: number | null;
  vit_d3_mcug: number | null;
  vit_k_mcug: number | null;
  vit_k1_mcug: number | null;
  vit_k2_mcug: number | null;
  vit_e_mg: number | null;
  vit_e_added_mg: number | null;
  vit_c_mg: number | null;
  thiamin_mg: number | null;
  riboflavin_mg: number | null;
  niacin_mg: number | null;
  vit_b6_mg: number | null;
  vit_b5_mg: number | null;
  vit_b7_mcug: number | null;
  folate_dfe_mcug: number | null;
  folate_food_mcug: number | null;
  folate_total_mcug: number | null;
  folic_acid_mcug: number | null;
  vit_b12_mcug: number | null;
  vit_b12_added_mcug: number | null;
  choline_mg: number | null;

  calcium_mg: number | null;
  phosphorus_mg: number | null;
  magnesium_mg: number | null;
  sodium_mg: number | null;
  potassium_mg: number | null;
  iron_mg: number | null;
  zinc_mg: number | null;
  copper_mg: number | null;
  selenium_mcug: number | null;
  chromium_mg: number | null;
  manganese_mg: number | null;
  molybdenum_mg: number | null;

  theobromine_mg: number | null;
  lycopene_mcug: number | null;
  cryptoxanthin_beta_mcug: number | null;
  alcohol_g: number | null;
  caffeine_mg: number | null;
}
