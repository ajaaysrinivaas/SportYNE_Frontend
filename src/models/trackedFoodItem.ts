// src/models/trackedFoodItem.ts
import { FoodItem } from "./foodItems";

export interface TrackedFoodItem extends FoodItem {
  portion: number;
  mealType: string;
  nutrients: { [key: string]: number };
}
