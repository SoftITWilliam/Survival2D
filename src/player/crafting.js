import { canvas } from "../game/global.js";
import CraftingInterface from "../ui/craftingInterface.js";


export default class CraftingMenu {
    constructor(player) {
        this.player = player;
        this.ui = new CraftingInterface(this);
        this.recipeManager = this.player.game.recipeManager;
        this.recipes = [];
        this.isOpen = false;

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
    }

    update() {
        
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
    
    render(x,y) {
        const offsetX = (canvas.width - this.ui.w) / 2;
        const offsetY = (canvas.height - this.ui.h) / 2;
        const posX = x + offsetX;
        const posY = y + offsetY;

        this.ui.setPosition(posX,posY);

        this.ui.renderBase();

        let label = this.labels[this.station];
        this.ui.renderTopLabel(label);

        this.ui.renderRecipeList();
    }
}