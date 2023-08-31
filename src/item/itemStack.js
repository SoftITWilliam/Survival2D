import { ctx } from "../game/global.js";
import { renderItem } from "../helper/canvashelper.js";

export class ItemStack {
    #item;
    constructor(item, amount) {
        this.#item = item;
        this.size = 32;
        this.amount = amount;
    }

    get item() {
        return this.#item;
    }

    get limit() {
        return this.item.stackLimit;
    }

    get remainingSpace() {
        return this.limit - this.amount;
    }

    isFull() {
        return this.amount >= this.limit;
    }

    isEmpty() {
        return this.amount <= 0;
    }

    containsItem(item) {
        return this.item.isItem(item);
    }

    split() {
        let splitAmount = Math.ceil(this.amount / 2);
        this.remove(splitAmount);
        return new ItemStack(this.item, splitAmount);
    }

    /**
     * Creates a copy of this stack, with a certain amount of items.
     * If 'amount' is empty, the copy will receive everything from this stack.
     * @param {number} amount
     * @returns {ItemStack}
     */
    extract(amount = this.amount) {
        if(amount < 0 || amount > this.amount) throw new RangeError(`Invalid amount`);
        let stack = new ItemStack(this.item, amount);
        this.remove(amount);
        return stack;
    }

    /**
     * 
     * @param {number} count Amount of items to add to the stack
     * @returns Remaining items
     */
    fill(count) {
        this.amount += count;

        if(this.isFull()) {
            let excess = this.amount - this.limit;
            this.amount = this.limit;
            return excess;
        }
        return 0;
    }

    remove(count) {
        this.amount -= count;

        if(this.isEmpty()) {
            let excess = this.amount * -1;
            this.amount = 0;
            return excess;
        }
        return 0;
    }

    draw(x, y) {
        renderItem(this.item, x, y, this.size, this.size);
    }

    drawAmount(x, y) {
        if(this.limit == 1) return;
        
        Object.assign(ctx, {
            fillStyle: "white", font: "24px Font1", textAlign: "right",
        });
        ctx.shadow("black", 4, 0, 0);
        ctx.fillText(this.amount, x + 56, y + 58);
        ctx.filter = false;
        ctx.shadow();
    }
}