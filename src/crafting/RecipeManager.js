import { ItemRegistry as Items } from "../item/itemRegistry.js";
import { CraftingStations as Stations } from "./craftingStations.js";
import { CraftingRecipe as Recipe } from "./Recipe.js";

export class RecipeManager {
    constructor(game) {
        this.game = game;
        this.defineRecipes();
    }

    defineRecipes() {
        this.recipes = [
            new Recipe(Stations.DEFAULT, [[Items.WOOD, 6], [Items.PLANT_FIBER, 5], [Items.BRANCH, 5]], Items.WOODEN_PICKAXE, 1),
            new Recipe(Stations.DEFAULT, [[Items.WOOD, 5], [Items.PLANT_FIBER, 4], [Items.BRANCH, 4]], Items.WOODEN_AXE, 1),
            new Recipe(Stations.DEFAULT, [[Items.WOOD, 3], [Items.PLANT_FIBER, 3], [Items.BRANCH, 5]], Items.WOODEN_SHOVEL, 1),
            new Recipe(Stations.DEFAULT, [[Items.WOOD, 4], [Items.PLANT_FIBER, 3], [Items.BRANCH, 4]], Items.WOODEN_HAMMER, 1),
            new Recipe(Stations.DEFAULT, [[Items.STONE, 1]], Items.DIRT, 1),
            new Recipe(Stations.DEFAULT, [[Items.DIRT, 1]], Items.STONE, 1),
            new Recipe(Stations.DEFAULT, [[Items.WOOD, 2]], Items.BRANCH, 4),
            new Recipe(Stations.DEFAULT, [[Items.ACORN, 2]], Items.WOOD, 1),
            new Recipe(Stations.WORKBENCH, [[Items.STONE, 8]], Items.ACORN, 1),
        ];
    }
    
    getAll() {
        return this.recipes;
    }

    getRecipesForStation(station) {
        return this.recipes.filter(recipe => recipe.station == station);
    }
}