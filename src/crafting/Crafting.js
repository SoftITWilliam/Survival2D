import { canvas } from "../game/global.js";
import CraftingInterface from "../ui/craftingUI.js";
import { CraftingStations } from "./craftingStations.js";

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

        this.labels = {};
        this.labels[CraftingStations.DEFAULT] = "Crafting";
        this.labels[CraftingStations.WORKBENCH] = "Workbench";

        this.avalibleResources = {}
    }

    open(station) {
        station ??= CraftingStations.DEFAULT;

        this.isOpen = true;
        this.station = station;
        this.recipes = this.recipeManager.getRecipesForStation(station);
        this.refreshResources(); 
        this.ui.loadCraftables(this.recipes, this.player.game);
        this.ui.updateCraftingAmount(this.craftingAmount);
    }

    close() {
        this.isOpen = false;
        this.station = null;
        this.recipes = [];
        this.hoveredCraftable = null;
        this.selectedRecipe = null;
    }

    update(input) {
        this.ui.update();
        if(this.hoveredCraftable !== null) {
            document.body.style.cursor = "pointer";
        }
    }

    selectRecipe(index) {
        if(index === null) return;

        if(index == this.selectedRecipe) {
            this.selectedRecipe = null;
        } else {
            this.selectedRecipe = index;
            this.loadRecipe(this.getSelectedRecipe());
        }
    } 

    getSelectedRecipe() {
        return this.recipes[this.selectedRecipe];
    }

    /**
     * Go through all the resources, look at their inputs, and put the amount the player has in their inventory into this.avalibleResources.
     * This might be very inefficient once there are a lot of recipes to deal with.
     */
    refreshResources() {
        this.avalibleResources = {}

        this.recipes.forEach(recipe => {
            recipe.inputList.forEach(input => {
                let item = input.item;
                if(this.avalibleResources.hasOwnProperty(item.registryName)) return; 

                this.avalibleResources[item.registryName] = this.player.inventory.getItemAmount(item);
            })
        })
    }

    getAvalibleResources(item) {
        return this.avalibleResources[item.registryName] ?? null;
    }

    minAmount() {
        this.craftingAmount = 1;
        this.ui.updateCraftingAmount(this.craftingAmount);
        this.updateCraftButton();
    }

    increaseAmount() {
        this.craftingAmount += 1;
        this.ui.updateCraftingAmount(this.craftingAmount);
        this.updateCraftButton();
    }

    decreaseAmount() {
        if(this.craftingAmount > 1) {
            this.craftingAmount -= 1;
            this.ui.updateCraftingAmount(this.craftingAmount);
            this.updateCraftButton();
        }
    }

    maxAmount() {
        let craftingCost = this.getSelectedRecipe().inputList;
        this.craftingAmount = 99;
        craftingCost.forEach(input => {
            let avalible = this.getAvalibleResources(input.item);
            let max = Math.floor(avalible / input.amount);
            if(max < this.craftingAmount) {
                this.craftingAmount = max;
            }
        });
        if(this.craftingAmount <= 1) {
            this.craftingAmount = 1;
        }
        this.ui.updateCraftingAmount(this.craftingAmount);
        this.updateCraftButton();
    }

    updateCraftButton() {
        let status = this.ableToCraft(this.getSelectedRecipe(), this.craftingAmount);
        this.ui.buttons[4].setClickable(status);
    }

    /** 
     * Prepare all the data for the rendering of the recipe, run once when a recipe is selected.
    */
    loadRecipe(recipe) {
        this.craftingAmount = 1;
        this.ui.loadRecipe(recipe.inputList, recipe.output, recipe.outputAmount);
        this.ui.updateCraftingAmount(this.craftingAmount);
        this.updateCraftButton();
    }

    /**
     * Return true if the player is able to craft the given amount of a given item with the materials currently in their inventory
     * @param {object} recipe Crafting recipe
     * @param {number} amount Crafting count 
     * @returns {boolean}
     */
    ableToCraft(recipe, amount) {
        if(!recipe) return false;
        
        let craftingStatus = true;
        recipe.inputList.forEach(input => {
            let avalible = this.avalibleResources[input.item];
            if(input.amount * amount > avalible) {
                craftingStatus = false;
            }
        });
        return craftingStatus;
    }

    craftItem() {
        let recipe = this.getSelectedRecipe();

        recipe.inputList.forEach(input => {
            this.player.inventory.removeItem(input.item, this.craftingAmount * input.amount);
        });
            
        this.player.inventory.addItem(recipe.output, this.craftingAmount * recipe.outputAmount);
        this.close();
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
    }

    render(x, y, input) {
        const offsetX = (canvas.width - this.ui.w) / 2;
        const offsetY = (canvas.height - this.ui.h) / 2;

        this.ui.setPosition(x + offsetX, y + offsetY);
    
        this.ui.renderBase(this.labels[this.station]);

        this.ui.updateButtons(input);

        if(this.selectedRecipe !== null) {
            this.ui.renderRecipeInfo();
        } else {
            this.ui.renderNoRecipe();
        }
    }
}