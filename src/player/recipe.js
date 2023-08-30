
export default class RecipeManager {
    constructor(game) {
        this.game = game;

        this.defineRecipes();
    }

    defineRecipes() {
        this.recipes = [
            new CraftingRecipe("DEFAULT", [["wood", 6],["plant_fiber", 5],["branch", 5]], "wooden_pickaxe", 1),
            new CraftingRecipe("DEFAULT", [["wood", 5],["plant_fiber", 4],["branch", 4]], "wooden_axe", 1),
            new CraftingRecipe("DEFAULT", [["wood", 3],["plant_fiber", 3],["branch", 5]], "wooden_shovel", 1),
            new CraftingRecipe("DEFAULT", [["wood", 4],["plant_fiber", 3],["branch", 4]], "wooden_hammer", 1),
            new CraftingRecipe("DEFAULT", [["stone", 1]], "dirt", 1),
            new CraftingRecipe("DEFAULT", [["dirt", 1]], "stone", 1),
            new CraftingRecipe("DEFAULT", [["wood", 2]], "branch", 4),
            new CraftingRecipe("DEFAULT", [["acorn", 2]], "wood", 1),
            new CraftingRecipe("WORKBENCH", [["stone", 8]], "acorn", 1),
        ];
    }
    
    getAll() {
        return this.recipes;
    }

    /**
     * Return an array of all recipes with a specific 'station' value
     * @param {string} station 
     * @returns {Array}
     */
    getRecipesForStation(station) {
        let validRecipes = [];
        this.recipes.forEach(recipe => {
            if(recipe.station == station) {
                validRecipes.push(recipe);
            }
        });
        return validRecipes;
    }
}

class Recipe {
    constructor(station, inputList, output, amount) {
        this.station = station;
        this.inputList = inputList;
        this.output = output;
        this.outputAmount = amount;
    }
}

class CraftingRecipe extends Recipe {
    constructor(station,inputList,output,amount) {
        super(station,inputList,output,amount);
    }
}

// Will remain unused for now
class ProcessingRecipe extends Recipe {
    constructor(station, inputList, output, amount, processingTime, game) {
        super(station, inputList, output, amount, game);
        this.processingTime = processingTime;
    }
}