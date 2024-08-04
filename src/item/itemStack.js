import { Observable } from "../class/Observable.js";
import { World } from "../world/World.js";
import Item from "./item.js";

export class ItemStack {
    /** @type {Item} */
    #item;
    /** @type {number} */
    #amount;

    amountChanged = new Observable();

    /**
     * @param {Item} item 
     * @param {number} amount 
     */
    constructor(item, amount) {
        this.#item = item;
        this.size = 32; // size in pixels. TODO refactor
        this.#amount = amount;
    }

    get amount() {
        return this.#amount;
    }
    set amount(n) {
        console.assert(typeof n === "number" && !isNaN(n), 'Expected number');
        console.assert(n >= 0 && n <= this.limit, 'Out of range');
        this.#amount = n;
        this.amountChanged.notify(n);
    }

    //#region Property getters

    /** @returns {Item} */
    get item() {
        return this.#item;
    }

    /** @returns {number} */
    get limit() {
        return this.item.stackLimit;
    }

    /** @returns {number} */
    get remainingSpace() {
        return this.limit - this.amount;
    }

    //#endregion

    //#region Methods

    /** @returns {boolean} */
    isFull() {
        return this.amount >= this.limit;
    }

    /** @returns {boolean} */
    isEmpty() {
        return this.amount <= 0;
    }

    /**
     * @param {Item} item 
     * @returns {boolean}
     */
    containsItem(item) {
        if(!Item.isItem(item)) return false;
        else return Item.isItem(this.item, item);
    }

    /**
     * Create a new ItemStack containing half the items of this stack.
     * @returns {ItemStack}
     */
    split() {
        let splitAmount = Math.ceil(this.amount / 2);
        return this.extract(splitAmount);
    }

    /**
     * Creates a copy of this stack, with a certain amount of items.
     * If 'amount' is empty, the copy will receive everything from this stack.
     * @param {number} [amount]
     * @returns {ItemStack}
     */
    extract(amount = this.amount) {
        if(typeof amount != "number" || amount < 0 || amount > this.amount) throw new RangeError(`Invalid amount`);
        let stack = new ItemStack(this.item, amount);
        this.remove(amount);
        return stack;
    }

    /**
     * Increase amount in stack, until full. Returns remaining amount.
     * @param {number} count Amount of items to add to the stack
     * @returns Leftover amount
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

    /**
     * Decrease amount in stack, until empty. Returns remaining amount.
     * @param {*} count 
     * @returns {number} Excess amount which could not be removed
     */
    remove(count) {
        this.amount -= count;

        if(this.isEmpty()) {
            let excess = this.amount * -1;
            this.amount = 0;
            return excess;
        }
        return 0;
    }

    /**
     * Try to place an item from this stack into the world.
     * If successful, decrease amount by one.
     * @param {number} gridX 
     * @param {number} gridY 
     * @param {World} world 
     * @returns {boolean} Placement success
     */
    placeItemIntoWorld(gridX, gridY, world) {
        if(!this.isEmpty()) {
            let success = this.item.placeIntoWorld(gridX, gridY, world);
            if(success) {
                this.remove(1);
                return true;  
            }
        }
        return false
    }

    //#endregion

    //#region Rendering methods

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x Canvas X
     * @param {number} y Canvas Y
     */
    render(ctx, x, y) {
        this.item.render(ctx, x, y, this.size, this.size);

        if(this.limit !== 1) {
            this.#renderAmount(ctx, x, y);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x Canvas X
     * @param {number} y Canvas Y
     */
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