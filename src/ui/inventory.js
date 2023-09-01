import { canvas, ctx, INVENTORY_HEIGHT, INVENTORY_WIDTH } from "../game/global.js";
import { renderPath } from "../helper/canvashelper.js";
import Item from "../item/item.js";
import { ItemStack } from "../item/itemStack.js";

const HOTBAR_OFFSET_Y = 24;
const SLOT_SIZE = 64;

// I think inventory needs a full rewrite... 
// Item container needs to be refactored out to be used in storage tiles etc

export class Inventory {
    constructor(player) {
        this.player = player; // Pointer
        this.selectedHotbarSlot = 1;

        // Grid size
        this.w = INVENTORY_WIDTH;
        this.h = INVENTORY_HEIGHT;
        this.fullWidth = this.w * SLOT_SIZE;

        this.topEdge = canvas.height - SLOT_SIZE * this.h - SLOT_SIZE;
        this.leftEdge = canvas.width / 2 - SLOT_SIZE * (this.w / 2);

        this.close();

        // Set up grid
        this.grid = [];
        for(let invX = 0; invX < this.w; invX++) {
            let row = [];
            for(let invY = 0; invY < this.h; invY++) {

                let xPos = this.leftEdge + SLOT_SIZE * invX;
                let yPos = this.topEdge + SLOT_SIZE * invY;
                if(invY !== this.h - 1) yPos -= HOTBAR_OFFSET_Y;

                let slot = new InventorySlot(xPos, yPos, invX, invY, this.player);
                row.push(slot);
            }
            this.grid.push(row);
        }
    }

    get _cameraX() { return this.player.camera.x }
    get _cameraY() { return this.player.camera.y }

    getSlot(x, y) {
        if(x < 0 || x >= this.w || y < 0 || y >= this.h) return null;
        return this.grid[x][y];
    }

    getSlotsAsArray() {
        let slotArray = [];
        this.grid.forEach(row => {
            row.forEach(slot => { slotArray.push(slot) })
        });
        return slotArray;
    }

    getRow(y) {
        if(y < 0 || y >= this.h) return [];
        return this.grid.map(column => column[y]);
    }

    getStack(x, y) {
        return this.getSlot(x, y)?.stack ?? null;
    }

    close() {
        if(this.holdingStack) {
            this.addItem(this.holdingStack.item, this.holdingStack.amount);
        }

        this.view = false;
        this.holdingStack = null;
        this.hoveredSlot = { x: null, y: null }
    }

    update(input) {
        this.updateInteraction(input);
        this.updateItemInfo();
    }

    updateItemInfo() {

        // If no slot is hovered, hide item info
        if(this.hoveredSlot.x === null || this.hoveredSlot.y === null) {
            this.player.itemInfoDisplay.set(null);
            return;
        }

        let stack = this.getStack(this.hoveredSlot.x, this.hoveredSlot.y);
        if(stack) {
            this.player.itemInfoDisplay.set(stack.item);
            return;
        }
        
        this.player.itemInfoDisplay.set(null);
    }

    updateInteraction(input) {
        this.hoveredSlot = this.checkHover(input);

        if(!input.mouse.click && !input.mouse.rightClick) return;

        const insertAmount = (
            input.mouse.click ? (this.holdingStack ? this.holdingStack.amount : null) : 
            input.mouse.rightClick ? 1 : null
        );

        const split = (input.mouse.rightClick ? true : false);
        
        if(this.holdingStack) {
            this.insertIntoSlot(this.hoveredSlot, insertAmount);
        } else {
            this.selectSlot(this.hoveredSlot.x, this.hoveredSlot.y, split);
        }

        input.mouse.click = false;
        input.mouse.rightClick = false;
    }

    selectSlot(x, y, split) {
        // No slot hovered
        if(x === null || y === null) return;

        // Get slot position
        let slot = this.getSlot(x, y);
        let stack = slot.stack;
        if(!stack) return;

        this.holdingStack = split ? stack.split() : stack.extract();

        // Delete source stack if empty
        if(stack.isEmpty()) {
            slot.stack = null;
        }
    }

    /**
     * Try to insert the selected item into a slot
     * @param {object} slot New slot
     * @param {number} insertAmount Amount of items to be inserted into slot
     */
    insertIntoSlot(slot, insertAmount) {

        // If player is holding an item and clicks outside the inventory, drop the item.
        if(slot.x === null || slot.y === null) {
            console.log("TODO drop item");
            return;
        }

        slot = this.getSlot(slot.x, slot.y);

        // Create a reference to the existing stack in the slot
        let newStack = slot.stack;

        if(newStack) {

            // If new slot has a different item, insert the held stack and pick up the new one.
            if(newStack.containsItem(this.holdingStack.item)) {
                let temp = this.holdingStack;
                this.selectSlot(slot.invX, slot.invY, false);
                slot.stack = temp;
                return;
            }

            // If it has the same item, fill up the stack as much as possible.
            let remaining = newStack.fill(insertAmount);
            this.holdingStack.amount -= insertAmount;
            this.holdingStack.amount += remaining;

        } else {
            // Insert stack and remove old stack
            let stack = new ItemStack(this.holdingStack.item, insertAmount);
            slot.stack = stack;
            this.holdingStack.amount -= insertAmount;
        }

        // If entire fheld stack has been inserted, delete it
        if(this.holdingStack.amount <= 0) {
            this.holdingStack = null;
        }
    }

    /**
     * Calculate which inventory slot is being hovered,
     */
    checkHover(input) {

        // Get currently hovered inventory grid coordinates
        let invX = Math.floor((input.mouse.x - this.leftEdge) / SLOT_SIZE);
        let invY = Math.floor((input.mouse.y - this.topEdge + HOTBAR_OFFSET_Y) / SLOT_SIZE);

        // Invalid X value
        if(invX < 0 || invX >= this.w) invX = null;

        // Invalid Y value OR in hotbar row
        if(invY < 0 || invY >= this.h - 1) invY = null;

        // Check if hotbar row is hovered
        if(Math.floor((input.mouse.y - this.topEdge) / SLOT_SIZE) == this.h - 1) {
            invY = this.h - 1;
        }

        return { x: invX, y: invY };
    }

    // If a stack with the given item already exists and it isn't full, return its grid position
    findExistingStack(item) {
        for(let invX = 0; invX < this.w; invX++) {
            let invY = this.grid[invX].findIndex(slot => (slot.stack && slot.stack.containsItem(item) && !slot.stack.isFull()));
            if(invY != -1) return { x: invX, y: invY };
        }
        return false;
    }

    // If an empty slot exists, return it.
    findEmptySlot() {
        // Search hotbar first
        let invY = this.h - 1;
        for(let invX = 0; invX < this.w; invX++) {
            if(!this.getStack(invX, invY)) {
                return { x: invX, y: invY };
            }
        }

        // Search rest of inventory
        for(let invY = 0; invY < this.h - 1; invY++) {
            for(let invX = 0; invX < this.w; invX++) {
                if(!this.getStack(invX, invY)) {
                    return { x: invX, y: invY };
                }
            }
        }
        return false;
    }

    getSelectedSlot() {
        return this.getSlot(this.selectedHotbarSlot - 1, this.h - 1);
    }

    /**
     * Search inventory for a certain item and returns the total amount
     * @param {Item} item The item to be searched for
     */
    getItemAmount(item) {
        if(!item instanceof Item) return;
        let amount = 0;
        this.grid.forEach(row => {
            amount = row.reduce((a, slot) => (a + (slot.stack?.containsItem(item) ? slot.stack.amount : 0)), amount);
        })
        return amount;
    }

    /**
     * Try to add an item into the inventory
     * @param {Item} item 
     * @param {number} amount 
     * @returns 
     */
    addItem(item, amount) {
        if(!item) return;
        
        let startAmount = amount;

        // Fill existing stacks first
        while(amount > 0) {
            let slot = this.findExistingStack(item);
            if(!slot) break;
            amount = this.getStack(slot.x, slot.y).fill(amount);
        }

        // If no existing stacks remain, start adding to empty slots
        while(amount > 0) {

            let emptySlot = this.findEmptySlot();

            // If inventory is full, return the amount of items left.
            if(!emptySlot) {
                if(startAmount - amount != 0) {
                    this.player.pickupLabels.add(item, startAmount - amount);
                }
                return amount;
            }

            let x = emptySlot.x; 
            let y = emptySlot.y;

            // Creates new item stack
            // (If the item entity picked up still has items left after this, they will be deleted)
            // (Unless Tile entities of the same type combine with eachother in the future, this won't be a problem) (IT ENDED UP BEING A PROBLEM)
            if(item.stackLimit < amount) {
                this.getSlot(x, y).stack = new ItemStack(item, item.stackLimit);
                amount -= item.stackLimit;
            } else {
                this.getSlot(x, y).stack = new ItemStack(item, amount);
                amount = 0;
            }
        
            // If new stack is placed in the selected hotbar slot, the selection is refreshed.
            if(y + 1 == this.h && x + 1 == this.selectedHotbarSlot) {
                this.player.selectItem(x + 1);
            }
        }

        this.player.pickupLabels.add(item, startAmount);
        return 0;
    }

    /**
     * Remove a certain amount of a specific item from the inventory.
     * Searches through all slots.
     * @param {Item} item Item type to remove
     * @param {number} amount Amount of items to remove
     * @returns True if the full amount of items could be deleted. False if inventory didn't contain enough.
     */
    removeItem(item, amount) {
        if(!item instanceof Item || typeof amount != "number") return false;

        for(let invY = this.h - 1; invY >= 0; invY--) {
            for(let invX = this.w - 1; invX >= 0; invX--) {

                // Loop through inventory until a slot is found that has the given item
                let slot = this.getSlot(invX, invY);
                if(!slot.stack?.containsItem(item)) continue;

                // Delete the given amount from the stack
                amount = slot.stack.remove(amount);

                if(slot.stack.isEmpty()) 
                    slot.stack = null;

                // If there are still items to remove after the stack is empty, we continue looking for the stack
                if(amount == 0) return true;
            }
        }

        return false;
    }

    draw() {
        this.drawHotbar();

        // If inventory view is enabled, draw rest of the inventory.
        if(!this.view) return;

        // Draw inventory boxes
        ctx.beginPath();

        let lineWidth = 3;

        Object.assign(ctx, { 
            strokeStyle: "rgba(0,0,0,0.5)", fillStyle: "rgba(0,0,0,0.25)", lineWidth: lineWidth
        });

        let xPos = this._cameraX + this.leftEdge - 3;
        let yPos = this._cameraY + this.topEdge - 27;
        let invWidth = this.fullWidth + lineWidth * 2;
        let invHeight = SLOT_SIZE * (this.h - 1) + lineWidth * 2;

        ctx.rect(xPos, yPos, invWidth, invHeight);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Draw slots
        this.getSlotsAsArray().forEach(slot => {
            if(slot.invY != this.h - 1) slot.draw();
        })
    }

    drawHotbar() {

        ctx.beginPath();
        Object.assign(ctx, { strokeStyle: "rgba(0,0,0,0.5)", fillStyle: "rgba(0,0,0,0.25)", lineWidth: 3 });
        ctx.rect(
            this._cameraX + this.leftEdge - 3, 
            this._cameraY + this.topEdge - 3 + SLOT_SIZE * 3, 
            this.fullWidth + 6, 
            SLOT_SIZE + 6
        );
        ctx.fill();
        ctx.stroke();

        this.getRow(this.h - 1).forEach(slot => slot.draw());
    }

    drawSelection() {
        Object.assign(ctx, { 
            strokeStyle: "white", lineWidth: 5
        });

        renderPath(() => {
            ctx.rectObj(this.getSelectedSlot());
            ctx.stroke();
        });
    }

    drawSelectedStack(input) {
        let mx = input.mouse.mapX;
        let my = -input.mouse.mapY;
        this.holdingStack.draw(mx, my);
        this.holdingStack.drawAmount(mx - 16, my - 16);
    }

    drawItems(input) {

        // Draw items in hotbar
        this.getRow(this.h - 1).forEach(slot => slot.drawItem());

        if(!this.view) return;
        
        // Draw items in rest inventory
        this.getSlotsAsArray().forEach(slot => {
            if(slot.invY != this.h - 1) slot.drawItem();
        })

        if(this.holdingStack) {
            this.drawSelectedStack(input);
        }
    }
}

class InventorySlot {
    constructor(x, y, invX, invY, player) {
        this.player = player; // Pointer
        this.stack = null;

        this.invX = invX,
        this.invY = invY,

        this.x = x;
        this.y = y;
    }

    get _cameraX() { return this.player.camera.x }
    get _cameraY() { return this.player.camera.y }

    get xPos() { return this.x + this._cameraX }
    get yPos() { return this.y + this._cameraY }

    get w() { return SLOT_SIZE }
    get h() { return SLOT_SIZE }

    isHovered() {
        return (
            this.player.inventory.hoveredSlot.x == this.invX && 
            this.player.inventory.hoveredSlot.y == this.invY
        );
    }

    // Draw slot
    draw() {
        Object.assign(ctx, { 
            strokeStyle: "rgb(200,200,200)", lineWidth:3 
        });

        ctx.beginPath();
        ctx.rect(this.xPos, this.yPos, this.w, this.h);
        ctx.stroke();
        ctx.closePath();

        this.drawHoverEffect();
    }

    // Draw item in slot
    drawItem() {
        if(!this.stack) return;

        // Draw item
        this.stack.draw(this.xPos + 16, this.yPos + 16);
        this.stack.drawAmount(this.xPos, this.yPos);
    }
    // Draw hover overlay
    drawHoverEffect() {
        if(!this.isHovered() || !this.player.inventory.view) return;

        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(this.xPos, this.yPos, this.w, this.h)
    }
}