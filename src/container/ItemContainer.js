import { Grid } from "../class/Grid.js";
import { Observable } from "../class/Observable.js";
import Item from "../item/item.js";
import { ItemRegistry } from "../item/itemRegistry.js";
import { ItemStack } from "../item/itemStack.js";

/**
 * @iterable
 */
export class ItemContainer {
    /**
     * 
     * @param {number} width Container width (amount of slots)
     * @param {number} height Container height (amount of slots)
     */
    constructor(width, height) {
        this.slots = new Grid(width, height);
    }

    /** Notifies when an item is added to the container (NOTE: One notification per affected slot!) */
    itemAddedSubject = new Observable();
    /** Notifies when an item is manually inserted into a container slot */
    itemInsertedSubject = new Observable();

    slotContentsChanged = new Observable();

    /** @returns {number} */
    get width() {
        return this.slots.width;
    }

    /** @returns {number} */
    get height() {
        return this.slots.height;
    }

    /** 
     * Return contents of the given slot
     * @param {number} gridX
     * @param {number} gridY
     * @returns {(ItemStack | Null)} 
     * */
    get(gridX, gridY) {
        return this.slots.get(gridX, gridY);
    }

    /** 
     * Split and return contents of the given slot. Returned items are removed from the slot stack.
     * @param {number} gridX
     * @param {number} gridY
     * @returns {(ItemStack | Null)} 
     * */
    split(gridX, gridY) {
        const result = this.get(gridX, gridY)?.split();
        this.slotContentsChanged.notify({ x: gridX, y: gridY });
        return result;
    }

    /** 
     * Return contents of the given slot.
     * Empties the slot if it contains items.
     * @param {number} gridX
     * @param {number} gridY
     * @returns {(ItemStack | Null)} 
     * */
    grab(gridX, gridY) {
        const stack = this.slots.get(gridX, gridY);
        this.slots.clear(gridX, gridY);
        this.slotContentsChanged.notify({ x: gridX, y: gridY });
        return stack;
    }

    /**
     * Try to insert a stack of items into a specific slot of the container.
     * If the inserted stack replaces an existing stack, the existing stack is returned.
     * If not all items are inserted (ex. the stack ends up full), the leftovers are returned
     * Returns null if all items are inserted.
     * @param {number} gridX 
     * @param {number} gridY 
     * @param {ItemStack} insertStack Stack being inserted
     * @param {number} [amount] Amount to insert from the stack. If unset, attempt to insert the entire stack.
     * @returns {(ItemStack | null)}
     */
    insertAt(gridX, gridY, insertStack, amount = null) {
        if (!this.#isValidGridPosition(gridX, gridY)) 
            throw new RangeError("Invalid slot position");
        if(!insertStack instanceof ItemStack) 
            throw new TypeError("insertStack must be of type ItemStack");
        
        const item = insertStack.item;

        if(amount >= insertStack.amount) amount = null;

        const notify = (a) => {
            this.itemInsertedSubject.notify({ item, amount: a, gridX, gridY });
            this.slotContentsChanged.notify({ x: gridX, y: gridY });
        } 

        const existingStack = this.get(gridX, gridY)

        // Slot is empty
        if(existingStack === null) {
            this.slots.set(gridX, gridY, insertStack.extract(amount ?? insertStack.amount));
            notify(amount ?? insertStack.amount);
            return insertStack.isEmpty() ? null : insertStack;
        }

        // Same item. Fill existing stack and if there's anything left it is returned.
        else if(Item.isItem(insertStack.item, existingStack.item)) {
            let initialAmount = existingStack.amount;

            if(amount != null) {
                // 'leftover' is 0 unless the stack is full
                var leftover = existingStack.fill(amount ?? insertStack.amount);
                insertStack.amount -= amount + leftover;
            }
            else {
                insertStack.amount =  existingStack.fill(insertStack.amount);
            }
            notify(existingStack.amount - initialAmount);
            return insertStack.isEmpty() ? null : insertStack;
        }

        // Slot contains different item. Return existing stack and insert new.
        else if(amount === null) {
            this.slots.set(gridX, gridY, insertStack);
            notify(amount);
            return existingStack;
        }

        // Trying to add a part of a stack into a slot with a different item does nothing
        else return null;
    }

    /**
     * Try to add an item to the first avalible slot in the container
     * @overload
     * @param {Item} item type of item
     * @param {number} amount Amount of items
     * @returns {number} Remaining amount, if inventory is full.
     *//**
     * Try to add an item stack to the first avalible slot in the container
     * @overload
     * @param {ItemStack} stack 
     * @returns {(ItemStack|null)} If any items remain they're returned as a stack. Otherwise null.
     */
    addItem(arg1, arg2) {
        
        /**
         * @param {Item} item 
         * @param {number} amount 
         * @returns 
         */
        var add = (item, amount) => {

            // Fill existing stacks first
            while(amount > 0) {
                // Find stacks of same item type, with space remaining
                const pos = this.slots.positionOf(
                    stack => stack ? Item.isItem(item, stack.item) && !stack.isFull() : false);
                if(pos === null) break;
                const stack = this.slots.get(pos.x, pos.y);

                let initialAmount = amount;
                amount = stack.fill(amount);

                this.itemAddedSubject.notify({ 
                    item, amount: initialAmount - amount, gridX: pos.x, gridY: pos.y
                });
                this.slotContentsChanged.notify(pos);
            }

            // Fill empty slots
            while(amount > 0) {
                const pos = this.slots.positionOf(value => value === null);
                if(pos === null) break;
                let stackAmount = Math.min(amount, item.stackSize);
                this.slots.set(pos.x, pos.y, new ItemStack(item, stackAmount));
                amount -= stackAmount;
                this.itemAddedSubject.notify({ 
                    item, amount: stackAmount, gridX: pos.x, gridY: pos.y
                });
                this.slotContentsChanged.notify(pos);
            }

            return amount;
        }

        if(arg1 instanceof ItemStack) {
            arg1.amount = add(arg1.item, arg1.amount);
            return arg1.isEmpty() ? null : arg1;
        }

        else if(arg1 instanceof Item && typeof arg2 == "number") {
            return add(arg1, arg2);
        }

        throw new Error('Invalid arguments');
    }

    getStoredCount(item) {
        return this.slots.asArray().reduce((c, stack) => 
            (c + Item.isItem(item, stack?.item) ? stack.amount : 0));
    }

    findSlotWithItem(item) {
        if(!item instanceof Item) return null;
        return this.slots.asArray().find(slot => (Item.isItem(slot.item, item) && !slot.isFull));
    }

    /**
     * Remove all contained stacks where amount === 0
     */ 
    clearEmptySlots() {
        this.slots.forEach((stack, x, y) => {
            if(stack && stack.amount === 0) {
                this.slots.set(x, y, null);
                this.slotContentsChanged.notify({ x, y });
            } 
        })
    }

    #isValidGridPosition(gridX, gridY) {
        return (gridX >= 0 && gridX < this.width && 
                gridY >= 0 && gridY < this.height)
    }

    /**
     * @yields {(ItemStack|null)}
     */
    *[Symbol.iterator](){
        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                yield this.get(x, y);
            }
        }
    }
}