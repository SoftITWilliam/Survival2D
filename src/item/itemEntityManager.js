import { InputHandler } from "../game/InputHandler.js";
import { Game } from "../game/game.js";
import { overlap } from "../helper/collisionhelper.js";
import PlayerCamera from "../player/camera.js";
import { ItemEntity } from "./itemEntity.js";
import { ItemStack } from "./itemStack.js";

export default class ItemEntityManager {
    constructor(game) {

        /** @type {Game} */
        this.game = game;

        /** @type {ItemEntity[]} */
        this.entities = [];
    }

    /**
     * Create a new Item Entity
     * @param {number} x x position
     * @param {number} y y position
     * @param {ItemStack} stack ItemStack object, containing an item and an amount.
     * @returns {ItemEntity} The newly created item entity
     */
    addEntity(x, y, stack) {
        let entity = new ItemEntity(x, y, stack, this.game);
        this.entities.push(entity);
        return entity;
    }

    /**
     * Updates physics and pickups of all item entities
     * @param {number} deltaTime Time since last frame (ms)
     */
    update(deltaTime) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(deltaTime, this.game.world);
    
            if(overlap(this.entities[i], this.game.player)) {
                if(this.entities[i].tryPickUp(this.game.player)) {
                    this.entities.splice(i, 1);
                }
            }
        }
    }

    /**
     * Get all item entities on screen
     * @param {PlayerCamera} camera Player camera
     * @returns {ItemEntity[]}
     */
    getVisible(camera) {
        return this.entities.filter(entity => overlap(camera, entity));
    }

    /**
     * Render all visible item entities
     * @param {CanvasRenderingContext2D} ctx
     * @param {PlayerCamera} camera Renders all entities which overlap with the camera view
     * @param {InputHandler} input
     */
    render(ctx, camera, input) {
        this.getVisible(camera).forEach(entity => {
            entity.render(ctx, input)
        });
    }
}