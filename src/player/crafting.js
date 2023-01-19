import { canvas, ITEM_SIZE, TILE_SIZE } from "../game/global.js";
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

        this.avalibleResources = {}
    }

    open(station) {
        if(!station) {
            station = "DEFAULT";
        }

        this.isOpen = true;
        this.station = station;
        this.recipes = this.recipeManager.getRecipesForStation(station);
        this.refreshResources(); 
        this.ui.loadCraftables(this.recipes,this.player.game);
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
            recipe.inputList.forEach(i => {
                if(!this.avalibleResources.hasOwnProperty(i[0])) {
                    let item = this.player.game.itemRegistry.get(i[0]);
                    this.avalibleResources[i[0]] = this.player.inventory.getItemAmount(item);
                }
            })
        })
        console.log(this.avalibleResources);
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
        craftingCost.forEach(i => {
            let avalible = this.avalibleResources[i[0]];
            let max = Math.floor(avalible / i[1]);
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
        let status = this.ableToCraft(this.getSelectedRecipe(),this.craftingAmount);
        this.ui.buttons.craftItem.setClickable(status);
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

        this.ui.loadRecipe(this.inputItems,this.outputItem,this.outputAmount);
        
        this.ui.updateCraftingAmount(this.craftingAmount);
        this.updateCraftButton();
    }

    /**
     * Return true if the player is able to craft the given amount of a given item with the materials currently in their inventory
     * @param {object} recipe Crafting recipe
     * @param {number} amount Crafting count 
     * @returns {boolean}
     */
    ableToCraft(recipe,amount) {
        let craftingStatus = true;
        recipe.inputList.forEach(i => {
            let avalible = this.avalibleResources[i[0]];
            if(i[1] * amount > avalible) {
                craftingStatus = false;
            }
        });
        return craftingStatus;
    }

    craftItem() {
        let recipe = this.getSelectedRecipe();
        let itemRegistry = this.player.game.itemRegistry;

        recipe.inputList.forEach(r => {
            let item = itemRegistry.get(r[0]);
            this.player.inventory.removeItem(item,this.craftingAmount * r[1]);
        })
            
        this.player.inventory.addItem(this.outputItem,this.craftingAmount * recipe.outputAmount);
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

        this.ui.setPosition(x + offsetX, y + offsetY);
    
        this.ui.renderBase(this.labels[this.station]);
        this.ui.renderRecipeList();

        this.ui.updateButtons(input);

        if(this.selectedRecipe !== null) {
            this.ui.renderRecipeInfo();

            this.ui.renderRecipeButtons();
        } else {
            this.ui.renderNoRecipe();
        }
    }
}