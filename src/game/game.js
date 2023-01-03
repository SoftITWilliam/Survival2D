import ItemEntityHandler from "../item/itemEntityHandler.js";
import ItemRegistry from "../item/itemRegistry.js";
import { Player } from "../player/player.js";
import { World } from "../world/world.js";
import FPSCounter from "./graphics/FPScounter.js";
import { InputHandler } from "./input.js";


export class Game {
    constructor() {
        this.world = new World(this,127,127);
        this.world.generate();
        
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.itemEntities = new ItemEntityHandler(this);
        this.fpsCounter = new FPSCounter(this);
        this.itemRegistry = new ItemRegistry(this);
    }

    update() {
        this.fpsCounter.increment();
        this.player.update(this.input);
        this.itemEntities.update();
    }
}