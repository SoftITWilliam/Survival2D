import { mouseOn, rng, setAttributes } from "../misc/util.js";
import { ctx, GRAVITY } from "../game/global.js";
import { renderItem } from "../game/graphics/renderUtil.js";
import GameEntity from "../game/gameEntity.js";

const VECTOR_RANGE = 20;

export class ItemEntity extends GameEntity {
    constructor(x, y, stackSize, item, game) {
        super(game, x, y, item.entitySize, item.entitySize);
        this.item = item;
        this.stackSize = stackSize;

        this.x = x - this.w / 2;
        this.y = y - this.w / 2;
        this.dx = 0;
        this.dy = 0;
        this.updateCenterPos();
        this.updateGridPos();
    }

    update(m) {
        this.inLiquid = false;
        this.grounded = false;

        this.dy += (GRAVITY * 0.6 * m);
        this.dx *= (0.9 * m);

        console.log(this.dy, this.y);
        this.updateCollision();
        this.move(m, this.dx, this.dy);
    }

    bounce() {
        if(this.dy < 1) {
            this.grounded = true;
            this.dy = 0;
            this.dx = 0;
        }
        this.dy = -this.dy * 0.5;
    }

    draw(input) {
        renderItem(this.item, this.x, this.y, this.w, this.h);

        if(mouseOn(this,input.mouse)) {
            this.drawLabel(input);
        }
    }

    // Override
    onTopCollision(tile) {
        this.y = tile.getY() - this.h;
        this.bounce();
    }

    drawLabel(input) {
        setAttributes(ctx, {font:"20px Font1", fillStyle:"rgba(0,0,0,0.5)", textAlign:"left"});
        let offset = 20;
        let txt = `${this.item.displayName} (${this.stackSize})`;
        let boxWidth = ctx.measureText(txt).width + offset * 2;
        ctx.fillRect(input.mouse.mapX, -input.mouse.mapY - 28,boxWidth, 28);
        ctx.fillStyle = "white";
        ctx.fillText(txt, input.mouse.mapX + offset, -input.mouse.mapY - 6);
    }

    pickUp(player) {
        let remaining = player.inventory.addItem(this.item,this.stackSize);

        // If inventory is full, set stack size to remaining amount
        if(remaining > 0) {
            this.stackSize = remaining;
            return 0;
        } 
        
        // If player has picked up the item, remove the entity.
        return 1;
    }

    static generateVector() {
        let dx = rng(-VECTOR_RANGE, VECTOR_RANGE) / 10;
        let dy = rng(-VECTOR_RANGE, 0) / 10;
        return { dx: dx, dy: dy }
    }
}