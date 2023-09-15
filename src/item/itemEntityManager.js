import { overlap } from "../helper/collisionhelper.js";
import PlayerCamera from "../player/camera.js";
import { ItemEntity } from "./itemEntity.js";
import { ItemStack } from "./itemStack.js";

export default class ItemEntityManager {
    constructor(game) {
        this.game = game; // Pointer
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

    update(m) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(m, this.game.world);
    
            if(overlap(this.entities[i], this.game.player)) {
                let removed = this.entities[i].pickUp(this.game.player);
                if(removed) {
                    this.entities.splice(i,1);
                    break;
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
     */
    render(ctx, camera, input) {
        this.getVisible(camera).forEach(entity => {
            entity.render(ctx, input)
        });
    }
}