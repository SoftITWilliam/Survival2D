import { EntityComponent } from "../components/EntityComponent.js";
import { ctx, GRAVITY } from "../game/global.js";
import { renderItem } from "../helper/canvasHelper.js";
import { rng } from "../helper/helper.js";

const VECTOR_RANGE = 20;

export class ItemEntity {
    constructor(x, y, stack) {
        this.stack = stack;

        let size = stack.item.entitySize;
        this._entity = new EntityComponent(x - size / 2, y - size / 2, size);
    }

    get item() { return this.stack.item }

    get amount() { return this.stack.amount }
    set amount(val) { if(typeof val == "number") this.stack.amount = val }

    /* === EntityComponent wrappers === */

    get x() { return this._entity.x }
    set x(value) { this._entity.x = value }

    get x2() { return this._entity.x2 }
    set x2(value) { this._entity.x2 = value }

    get y() { return this._entity.y }
    set y(value) { this._entity.y = value }

    get y2() { return this._entity.y2 }
    set y2(value) { this._entity.y2 = value }

    get centerX() { return this._entity.centerX }
    set centerX(value) { this._entity.centerX = value }

    get centerY() { return this._entity.centerY }
    set centerY(value) { this._entity.centerY = value }

    get gridX() { return this._entity.gridX }
    get gridY() { return this._entity.gridY }

    get width() { return this._entity.width }
    set width(value) { this._entity.width = value }

    get height() { return this._entity.height }  
    set height(value ) { this._entity.height = value }

    get dx() { return this._entity.dx }
    set dx(value) { this._entity.dx = value }

    get dy() { return this._entity.dy }
    set dy(value) { this._entity.dy = value }

    get vector() { return this._entity.vector }
    set vector(value) { this._entity.vector = value }

    /* === Methods === */

    update(m, world) {
        this.inLiquid = false;
        this.grounded = false;

        this.dy += (GRAVITY * 0.6 * m);
        this.dx *= 1 - (0.1 * m);

        this._entity.updateCollision(world);
        this._entity.move(m, this.vector);
    }

    bounce() {
        if(this.dy < 1) {
            this.grounded = true;
            this.vector = { dx: 0, dy: 0 };
        }
        this.dy = -this.dy * 0.5;
    }

    draw(input) {
        renderItem(this.item, this.x, this.y, this.width, this.height);

        if(input.mouse.on(this)) {
            this.drawLabel(input);
        }
    }

    // Override
    onTopCollision(tile) {
        this.y = tile.y - this.h;
        this.bounce();
    }

    drawLabel(input) {
        Object.assign(ctx, { font: "20px Font1", fillStyle: "rgba(0,0,0,0.5)", textAlign: "left" });
        let offset = 20;
        let txt = `${this.item.displayName} (${this.amount})`;
        let boxWidth = ctx.measureText(txt).width + offset * 2;
        ctx.fillRect(input.mouse.mapX, -input.mouse.mapY - 28, boxWidth, 28);
        ctx.fillStyle = "white";
        ctx.fillText(txt, input.mouse.mapX + offset, -input.mouse.mapY - 6);
    }

    pickUp(player) {
        let remaining = player.inventory.addItem(this.item, this.amount);
        this.stack.amount = remaining;
        return (this.stack.amount == 0);
    }

    static generateVector() {
        let dx = rng(-VECTOR_RANGE, VECTOR_RANGE) / 10;
        let dy = rng(-VECTOR_RANGE, 0) / 10;
        return { dx: dx, dy: dy }
    }
}