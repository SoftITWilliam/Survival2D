import ItemEntityManager from "../item/itemEntityManager.js";
import { Player } from "../player/player.js";
import { RecipeManager } from "../crafting/RecipeManager.js";
import { World } from "../world/World.js";
import FPSCounter from "../graphics/FPScounter.js";
import { InputHandler } from "./InputHandler.js";
import { Testing } from "../tests/testing.js";
import PlacementPreview from "../ui/placementPreview.js";

export class Game {
    constructor() {
        this.deltaTime = 0;

        this.world = new World(this, 512, 127);

        this.itemEntities = new ItemEntityManager(this);

        this.recipeManager = new RecipeManager(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.fpsCounter = new FPSCounter();

        this.testing = new Testing(this);
    }

    update(deltaTime) {
        this.deltaTime = deltaTime;
        if(deltaTime > 500) return;

        document.body.style.cursor = "default";
        this.world.tickCounter();
        this.fpsCounter.increment();
        this.player.update(deltaTime, this.input);
        this.player.craftingMenu.ui.update();
       
        PlacementPreview.updateAlpha(deltaTime);

        this.itemEntities.update(deltaTime);
    }
}