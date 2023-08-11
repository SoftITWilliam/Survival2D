import { overlap } from "../game/collision.js";
import { ItemEntity } from "./itemEntity.js";

export default class ItemEntityHandler {
    constructor(game) {
        this.game = game; // Pointer
        this.entities = [];
    }

    addEntity(x, y, dx, dy, stackSize, item) {
        this.entities.push(new ItemEntity(x, y, dx, dy, stackSize, item, this.game));
    }

    update(m) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(m);
    
            if(overlap(this.entities[i],this.game.player)) {
                let removed = this.entities[i].pickUp(this.game.player);
                if(removed) {
                    this.entities.splice(i,1);
                    break;
                }
            }
        }
    }

    drawAll() {
        this.entities.forEach(entity => {
            entity.draw(this.game.input)
        });
    }
}