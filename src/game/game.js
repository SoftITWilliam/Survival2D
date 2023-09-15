import ItemEntityManager from "../item/itemEntityManager.js";
import { Player } from "../player/player.js";
import { RecipeManager } from "../crafting/RecipeManager.js";
import { World } from "../world/World.js";
import FPSCounter from "./graphics/FPScounter.js";
import { InputHandler } from "./InputHandler.js";
import { Testing } from "../tests/testing.js";

export class Game {
    constructor() {
        this.physicsMultiplier = 0;

        this.world = new World(this, 512, 127);

        this.itemEntities = new ItemEntityManager(this);

        this.recipeManager = new RecipeManager(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.fpsCounter = new FPSCounter(this);

        this.testing = new Testing(this);
    }

    update(deltaTime) {
        if(deltaTime > 500) return;
        this.physicsMultiplier = deltaTime / (1000 / 60);

        document.body.style.cursor = "default";
        this.world.tickCounter();
        this.fpsCounter.increment();
        this.player.update(this.physicsMultiplier, this.input, deltaTime);
        this.player.craftingMenu.ui.update();
        this.itemEntities.update(this.physicsMultiplier);
    }
}