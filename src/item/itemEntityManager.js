import { InputHandler } from "../game/InputHandler.js";
import { Game } from "../game/game.js";
import { validNumbers } from "../helper/helper.js";
import { Collision } from "../misc/Collision.js";
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
     * @overload
     * @param {number} x x position
     * @param {number} y y position
     * @param {ItemStack} stack ItemStack object, containing an item and an amount.
     * @returns {ItemEntity} The newly created item entity
     * 
     * Add an item entity
     * @overload
     * @param {ItemEntity} entity Item entity object
     * 
     * Add an array of item entities
     * @overload
     * @param {ItemEntity[]} entities Array of item entity objects
     */
    add(arg1, arg2, arg3) {
        if(arg1 instanceof ItemEntity) {
            this.entities.push(arg1);
        }
        else if(Array.isArray(arg1)) {
            arg1.forEach(entity => this.add(entity));
        }
        else if(validNumbers(arg1, arg2) && arg3 instanceof ItemStack) {
            let entity = new ItemEntity(arg1, arg2, arg3);
            this.entities.push(entity);
            return entity;
        }
    }

    /**
     * Updates physics and pickups of all item entities
     * @param {number} deltaTime Time since last frame (ms)
     */
    update(deltaTime) {
        this.entities.forEach((entity, index) => {
            entity.update(deltaTime, this.game.world);

            if(Collision.rectangleOverlap(entity, this.game.player)) {
                if(entity.tryPickUp(this.game.player)) {
                    this.entities.splice(index, 1);
                }
            }
        });
    }

    /**
     * Get all item entities on screen
     * @param {PlayerCamera} camera Player camera
     * @returns {ItemEntity[]}
     */
    getVisible(camera) {
        return this.entities.filter(entity => Collision.rectangleOverlap(camera, entity));
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

    *[Symbol.iterator]() {
        for(let x = 0; x < this.entities.length; x++) {
            yield this.entities[i];
        }
    }
}