import { ctx } from "../game/global.js";
import { renderItem } from "../helper/canvasHelper.js";

export class ItemStack {
    constructor(item, amount) {
        this.item = item;
        this.size = 32;
        this.amount = amount;
    }

    getRemainingSpace() {
        return this.item.stackLimit - this.amount;
    }

    
    fillStack(count) {
        this.amount += count;

        if(this.amount > this.item.stackLimit) {
            let remaining = this.amount - this.item.stackLimit
            this.amount = this.item.stackLimit;
            return (remaining);
        }

        return 0;
    }

    increaseAmount(count) {
        this.amount += count;
    }

    subtractAmount(count) {
        this.amount -= count;
    }

    draw(x, y) {
        renderItem(this.item, x, y, this.size, this.size);
    }

    drawAmount(x, y) {
        if(this.item.stackLimit == 1) return;
        
        Object.assign(ctx, {
            fillStyle: "white", font: "24px Font1", textAlign: "right",
        });
        ctx.shadow("black", 4, 0, 0);
        ctx.fillText(this.amount, x + 56, y + 58);
        ctx.filter = false;
        ctx.shadow();
    }
}