import { canvas } from "../game/global.js";
import CraftingInterface from "../ui/craftingUI.js";


export default class CraftingMenu {
    constructor(player) {
        this.player = player;
        this.ui = new CraftingInterface(this);
        this.recipeManager = this.player.game.recipeManager;
        this.recipes = [];
        this.isOpen = false;
        this.hoveredCraftable = null;
        this.selectedRecipe = null;
        this.craftingAmount = 1;

        this.labels = {
            DEFAULT: "Crafting",
            WORKBENCH: "Workbench"
        }
    }

    open(station) {
        if(!station) {
            station = "DEFAULT";
        }

        this.isOpen = true;
        this.station = station;
        this.recipes = this.recipeManager.getRecipesForStation(station);
        this.ui.loadCraftables(this.recipes,this.player.game);
    }

    close() {
        this.isOpen = false;
        this.station = null;
        this.recipes = [];
        this.hoveredCraftable = null;
        this.selectedRecipe = null;
    }

    update(input) {
        if(this.hoveredCraftable !== null) {
            document.body.style.cursor = "pointer";
        }
    }

    selectRecipe(index) {
        if(index === null) {
            return;
        }

        if(index == this.selectedRecipe) {
            this.selectedRecipe = null;
        } else {
            this.selectedRecipe = index;
            this.loadRecipe(this.recipes[this.selectedRecipe]);
        }
    } 

    getResourceAmount(item) {
        this.player.inventory.getItemAmount(item);
    }

    increaseAmount() {
        this.craftingAmount += 1;
    }

    decreaseAmount() {
        if(this.craftingAmount > 1) {
            this.craftingAmount -= 1;
        }
    }

    /** 
     * Prepare all the data for the rendering of the recipe, run once when a recipe is selected.
    */
    loadRecipe(recipe) {
        let itemRegistry = this.player.game.itemRegistry;
        this.craftingAmount = 1;
        
        this.outputItem = itemRegistry.get(recipe.output);
        this.inputItems = [];

        recipe.inputList.forEach(i => {
            this.inputItems.push([itemRegistry.get(i[0]),i[1]]);
        })

        this.outputAmount = recipe.outputAmount;
    }

    handleInput(input) {
        if(input.keys.includes("C")) {
            this.close();
            input.removeKey("C");
        }
        if(input.keys.includes("E")) {
            this.close();
            this.player.inventory.view = false;
            input.removeKey("C");
        }

        this.ui.updateHover(input);

        if(input.mouse.click) {
            this.selectRecipe(this.hoveredCraftable);
            if(this.hoveredCraftable !== null) {
                input.mouse.click = false;
            }
        }
    }
    
    render(x,y,input) {
        const offsetX = (canvas.width - this.ui.w) / 2;
        const offsetY = (canvas.height - this.ui.h) / 2;
        const posX = x + offsetX;
        const posY = y + offsetY;

        this.ui.setPosition(posX,posY);
    
        this.ui.renderBase();
        this.ui.renderTopLabel(this.labels[this.station]);
        this.ui.renderRecipeList();

        this.ui.updateButtons(input);

        if(this.selectedRecipe !== null) {
            this.ui.renderRecipeInfo(this.outputItem);
            this.ui.renderOutputAmount(this.outputAmount);
            this.ui.renderRecipeCost(this.inputItems,this.craftingAmount);
            this.ui.renderRecipeButtons();
        } else {
            this.ui.renderNoRecipe();
        }
        
    }
}