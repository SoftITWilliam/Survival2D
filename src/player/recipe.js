
export default class RecipeManager {
    constructor(game) {
        this.game = game;

        this.defineRecipes();
    }

    defineRecipes() {
        this.recipes = [
            new CraftingRecipe("DEFAULT", [["wood",2],["stone",3]], "dev_pickaxe", 1, this.game),
            new CraftingRecipe("DEFAULT", [["wood",2],["stone",3]], "dev_axe", 1, this.game),
            new CraftingRecipe("DEFAULT", [["wood",2],["stone",1]], "dev_shovel", 1, this.game),
            new CraftingRecipe("DEFAULT", [["wood",2],["stone",5]], "dev_hammer", 1, this.game),
            new CraftingRecipe("DEFAULT", [["stone",1]], "dirt", 1, this.game),
            new CraftingRecipe("DEFAULT", [["dirt",1]], "stone", 1, this.game),
            new CraftingRecipe("DEFAULT", [["wood",2]], "branch", 4, this.game),
            new CraftingRecipe("WORKBENCH", [["stone",8]], "acorn", 1, this.game),
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
    constructor(station,inputList,output,amount,game) {
        this.station = station;
        this.inputList = inputList;
        this.output = output;
        this.outputAmount = amount;
        this.game = game;
    }
}

class CraftingRecipe extends Recipe {
    constructor(station,inputList,output,amount,game) {
        super(station,inputList,output,amount,game);
    }
}

// Will remain unused for now
class ProcessingRecipe extends Recipe {
    constructor(station,inputList,output,amount,processingTime,game) {
        super(station,inputList,output,amount,game);
        this.processingTime = processingTime;
    }
}