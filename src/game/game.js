import { Player } from "../player/player.js";
import { World } from "../world/world.js";
import { Camera } from "./camera.js";
import { InputHandler } from "./input.js";


export class Game {
    constructor() {
        this.world = new World(this,127,127);
        this.world.generate();
        
        this.player = new Player(this);

        this.input = new InputHandler();
    }

    update() {
        
    }
}