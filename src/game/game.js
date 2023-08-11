import ItemEntityHandler from "../item/itemEntityHandler.js";
import ItemRegistry from "../item/itemRegistry.js";
import TileRegistry from "../tile/tileRegistry.js";
import { Player } from "../player/player.js";
import RecipeManager from "../player/recipe.js";
import { World } from "../world/world.js";
import FPSCounter from "./graphics/FPScounter.js";
import { InputHandler } from "./input.js";
import { Testing } from "../tests/testing.js";


export class Game {
    constructor() {
        this.physicsMultiplier = 0;

        this.world = new World(this,127,127);
        
        this.itemRegistry = new ItemRegistry(this);
        this.tileRegistry = new TileRegistry(this.world);
        this.itemEntities = new ItemEntityHandler(this);

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