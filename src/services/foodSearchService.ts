import { ConfigStore } from "@/models/config";
import { FoodItem } from "@/models/foodItems";

export class FoodSearchService{
    private static instance: FoodSearchService | null = null;
        private topics_endpoint: string;
        
        // Make constructor private
        private constructor(config: ConfigStore) {
            this.topics_endpoint = config.BACKEND_URL + "/" + config.FOOD_SEARCH_ENDPOINT;
        }
    
        // Provide a single global instance
        public static getInstance(config: ConfigStore): FoodSearchService {
            if (!FoodSearchService.instance) {
                FoodSearchService.instance = new FoodSearchService(config);
            }
            return FoodSearchService.instance;
        }

        public async searchFoodItems(searchTerm: string): Promise<FoodItem[]> {
        
        const response: Response = await fetch(this.topics_endpoint + "?search=" + searchTerm);
        
        const foodItems : FoodItem[] = await response.json(); 

        return foodItems;
    }    
}