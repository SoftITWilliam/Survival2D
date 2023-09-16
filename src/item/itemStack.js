import Item from "./item.js";

export class ItemStack {
    #item;
    constructor(item, amount) {
        this.#item = item;
        this.size = 32;
        this.amount = amount;
    }

    //#region Property getters

    get item() {
        return this.#item;
    }

    get limit() {
        return this.item.stackLimit;
    }

    get remainingSpace() {
        return this.limit - this.amount;
    }

    //#endregion

    //#region Methods

    isFull() {
        return this.amount >= this.limit;
    }

    isEmpty() {
        return this.amount <= 0;
    }

    containsItem(item) {
        if(!Item.isItem(item)) return false;
        else return Item.isItem(this.item, item);
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

    placeItemIntoWorld(gridX, gridY, world) {
        if(this.isEmpty()) return;
        let success = this.item.placeIntoWorld(gridX, gridY, world);
        if(success) {
            this.remove(1);
        }
    }

    //#endregion

    //#region Rendering methods

    render(ctx, x, y) {
        this.item.render(ctx, x, y, this.size, this.size);

        if(this.limit !== 1) {
            this.#renderAmount(ctx, x, y);
        }
    }

    #renderAmount(ctx, x, y) {

        Object.assign(ctx, {
            fillStyle: "white", font: "24px Font1", textAlign: "right",
        });

        ctx.shadow("black", 4, 0, 0);
        ctx.fillText(this.amount, x + 40, y + 40);
        ctx.filter = false;
        ctx.shadow();
    }

    //#endregion
}