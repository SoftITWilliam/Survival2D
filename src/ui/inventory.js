import { canvas, ctx, INVENTORY_HEIGHT, INVENTORY_WIDTH } from "../game/global.js";
import { setAttributes } from "../misc/util.js";
import { ItemStack } from "../item/itemStack.js";

export class Inventory {
    constructor(player) {
        this.player = player; // Pointer
        this.selectedHotbarSlot = 1;

        // Grid size
        this.w = INVENTORY_WIDTH;
        this.h = INVENTORY_HEIGHT;
        this.slotSize = 64;
        this.fullWidth = this.w * this.slotSize;

        this.topEdge = canvas.height - this.slotSize * this.h - 64;
        this.leftEdge = canvas.width / 2 - this.slotSize * (this.w / 2);

        this.close();

        // Set up grid
        this.grid = [];
        for(let x=0;x<this.w;x++) {
            let row = [];
            for(let y=0;y<this.h;y++) {
                if(y == this.h - 1) {
                    row.push(new InventorySlot(this.leftEdge + this.slotSize*x,this.topEdge + this.slotSize*y,x,y,this.player));
                } else {
                    row.push(new InventorySlot(this.leftEdge + this.slotSize*x,this.topEdge + this.slotSize*y - 24,x,y,this.player));
                }
            }
            this.grid.push(row);
        }
    }

    close() {
        if(this.holdingStack) {
            this.addItem(this.holdingStack.item,this.holdingStack.amount);
        }

        this.view = false;
        this.holdingStack = null;
        this.hoveredSlot = {x:null,y:null}
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

        let slot = this.grid[this.hoveredSlot.x][this.hoveredSlot.y];
        if(slot.stack) {
            this.player.itemInfoDisplay.set(slot.stack.item);
            return;
        }
        
        this.player.itemInfoDisplay.set(null);
    }

    updateInteraction(input) {
        this.hoveredSlot = this.checkHover(input);

        if(!input.mouse.click && !input.mouse.rightClick) {
            return;
        }

        const insertAmount = (
            input.mouse.click ? (this.holdingStack ? this.holdingStack.amount : null) : 
            input.mouse.rightClick ? 1 : null
        );

        const split = (
            input.mouse.rightClick ? true : false 
        );
        
        if(this.holdingStack) {
            this.insertIntoSlot(this.hoveredSlot,insertAmount);
        } else {
            this.selectSlot(this.hoveredSlot.x,this.hoveredSlot.y,split);
        }

        input.mouse.click = false;
        input.mouse.rightClick = false;
    }

    selectSlot(x,y,split) {
        // No slot hovered
        if(x === null || y === null) {
            return;
        }

        // Get slot position
        let slot = this.grid[x][y];
            
        // Only slots with an item in them are selectable
        if(!slot.stack) {
            return;
        }

        // Calculate amount and subtract it from source stack
        const a = (split ? Math.ceil(slot.stack.amount / 2) : slot.stack.amount);
        this.holdingStack = new ItemStack(slot.stack.item,a);
        slot.stack.subtractAmount(a);

        // Delete source stack if empty
        if(slot.stack.amount <= 0) {
            slot.stack = null;
        } 
    }

    /**
     * Try to insert the selected item into a slot
     * 
     * @param {object}  slot            New slot
     * @param {number}  insertAmount    Amount of items to be inserted into slot
     */
    insertIntoSlot(slot,insertAmount) {

        // If player is holding an item and clicks outside the inventory, drop the item.
        if(slot.x === null || slot.y === null) {
            console.log("TODO drop item");
            return;
        }

        // Create a reference to the existing stack in the slot
        let newStack = this.grid[slot.x][slot.y].stack;

        if(newStack) {

            // If new slot has a different item, insert the held stack and pick up the new one.
            if(newStack.item.id != this.holdingStack.item.id) {
                let temp = this.holdingStack;
                this.selectSlot(slot.x,slot.y,false);
                this.grid[slot.x][slot.y].stack = temp;
                return;
            }

            // If it has the same item, fill up the stack as much as possible.
            let remaining = newStack.fillStack(insertAmount);
            this.holdingStack.amount -= insertAmount;
            this.holdingStack.amount += remaining;

        } else {
            // Insert stack and remove old stack
            this.grid[slot.x][slot.y].stack = new ItemStack(this.holdingStack.item,insertAmount);
            this.holdingStack.amount -= insertAmount;
        }

        // If entire held stack has been inserted, delete it
        if(this.holdingStack.amount <= 0) {
            this.holdingStack = null;
        }
    }

    /**
     * Calculate which inventory slot is being hovered,
     */
    checkHover(input) {

        // Get currently hovered inventory grid coordinates
        let slotX = Math.floor((input.mouse.x - this.leftEdge) / this.slotSize);
        let slotY = Math.floor((input.mouse.y - this.topEdge + 24) / this.slotSize);

        // Invalid X value
        if(slotX < 0 || slotX >= this.w) {
            slotX = null;
        }

        // Invalid Y value OR in hotbar row
        if(slotY < 0 || slotY >= this.h - 1) {
            slotY = null;
        }

        // Check if hotbar row is hovered
        if(Math.floor((input.mouse.y - this.topEdge) / this.slotSize) == this.h - 1) {
            slotY = this.h - 1;
        }

        return {x:slotX,y:slotY};
    }

    // If a stack with the given item already exists and it isn't full, return its grid position
    findExistingStack(id) {
        
        for(let x=0;x<this.w;x++) {
            for(let y=0;y<this.h;y++) {
                let stack = this.grid[x][y].stack;
                if(!stack) {
                    continue;
                }

                if(stack.item.id == id && stack.amount < stack.item.stackLimit) {
                    return {x:x,y:y};
                } 
            }
        }
        return false;
    }

    // If an empty slot exists, return it.
    findEmptySlot() {
        // Search hotbar first
        for(let x=0;x<this.w;x++) {
            if(!this.grid[x][3].stack) {
                return {x:x,y:3};
            }
        }

        // Search rest of inventory
        for(let y=0;y<this.h-1;y++) {
            for(let x=0;x<this.w;x++) {
                if(!this.grid[x][y].stack) {
                    return {x:x,y:y};
                }
            }
        }
        return false;
    }

    getSelectedSlot() {
        return this.grid[this.selectedHotbarSlot - 1][this.h - 1];
    }

    /**
     * Search inventory for a certain item and returns the total amount
     * @param {object} item The item to be searched for
     */
    getItemAmount(item) {
        if(!item) {
            return;
        }

        let amount = 0;
        for(let x = 0; x < this.w; x++) {
            for(let y = 0; y < this.h; y++) {
                let g = this.grid[x][y];
                if(!g.stack) {
                    continue;
                }
                if(g.stack.item.getRegistryName() == item.getRegistryName()) {
                    amount += g.stack.amount;
                }
            }
        }
        return amount;
    }

    /**
     * Try to add an item into the inventory
     * 
     * @param {*} item 
     * @param {*} amount 
     * @returns 
     */
    addItem(item, amount) {
        if(!item) return;
        
        let startAmount = amount;
        let slot = this.findExistingStack(item.id);

        // If a stack with the item already exists, fill it up.

        if(slot) {
            let x = slot.x; let y = slot.y;

            let remainingSpace = this.grid[x][y].stack.getRemainingSpace();

            // Add all items to the slot
            if(amount < remainingSpace) {
                this.grid[x][y].stack.increaseAmount(amount);
                amount = 0;
            } 
            
            // Fill the slot to its limit.
            else {
                this.grid[x][y].stack.increaseAmount(remainingSpace);
                amount -= remainingSpace;
            }

            // If there are items left after filling the stack, a new stack will be created.
            if(amount == 0) {
                this.player.pickupLabels.add(item,startAmount);
                return;
            }
        }

        while(true) {

            // Break condition
            if(amount == 0) {
                break;
            }

            // Find empty inventory space
            let emptySlot = this.findEmptySlot();

            // If inventory is full, return the amount of items left.
            if(!emptySlot) {
                if(startAmount - amount != 0) {
                    this.player.pickupLabels.add(item,startAmount - amount);
                }
                return amount;
            }

            let x = emptySlot.x; let y = emptySlot.y;

            // Creates new item stack
            // (If the item entity picked up still has items left after this, they will be deleted)
            // (Unless Tile entities of the same type combine with eachother in the future, this won't be a problem) (IT ENDED UP BEING A PROBLEM)
            if(item.stackLimit < amount) {
                this.grid[x][y].stack = new ItemStack(item,item.stackLimit);
                amount -= item.stackLimit;
            } else {
                this.grid[x][y].stack = new ItemStack(item,amount);
                amount = 0;
            }
            

            // If new stack is placed in the selected hotbar slot, the selection is refreshed.
            if(y + 1 == this.h && x + 1 == this.selectedHotbarSlot) {
                this.player.selectItem(x + 1);
            }
        }

        this.player.pickupLabels.add(item,startAmount);
    }

    removeItem(item, amount) {
        for(let y = this.h - 1; y >= 0; y--) {
            for(let x = this.w - 1; x >= 0; x--) {

                // Loop through inventory until a slot is found that has the given item
                let slot = this.grid[x][y];
                if(!slot.stack) {
                    continue;
                }

                if(slot.stack.item.getRegistryName() !== item.getRegistryName()) {
                    continue;
                }

                // Delete the given amount from the stack, then return.
                if(amount < slot.stack.amount) {
                    slot.stack.amount -= amount;
                    return;
                }

                // Delete the stack, then return.
                if(amount == slot.stack.amount) {
                    slot.stack = null;
                    return;
                }

                // Delete the stack, then find the next stack.
                if(amount >= slot.stack.null) {
                    slot.stack = null;
                }
            }
        }
    }

    draw() {

        // Draw hotbar
        this.drawHotbar();

        // If inventory view is enabled, draw rest of the inventory.
        if(!this.view) {
            return;
        }

        ctx.beginPath();
        setAttributes(ctx,{strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.25)",lineWidth:3});
        ctx.rect(this.player.camera.getX() + this.leftEdge-3,this.player.camera.getY() + this.topEdge-27,this.fullWidth+6,this.slotSize*(this.h-1) +6);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        for(let x=0;x<this.w;x++) {
            for(let y=0;y<this.h-1;y++) {
                this.grid[x][y].draw();
            }
        }

    }

    drawHotbar() {

        ctx.beginPath();
        setAttributes(ctx,{strokeStyle:"rgba(0,0,0,0.5)",fillStyle:"rgba(0,0,0,0.25)",lineWidth:3});
        ctx.rect(this.player.camera.getX() + this.leftEdge-3,this.player.camera.getY() + this.topEdge-3 + this.slotSize * 3,this.fullWidth+6,this.slotSize+6);
        ctx.fill();
        ctx.stroke();

        let y = 3;
        for(let x=0;x<this.w;x++) {
            this.grid[x][y].draw();
        }
    }

    drawSelection() {
        setAttributes(ctx,{strokeStyle:"white",lineWidth:5});
        let slot = this.getSelectedSlot();

        ctx.beginPath();
        ctx.rect(this.player.camera.getX() + slot.x,this.player.camera.getY() + slot.y,this.slotSize,this.slotSize);
        ctx.stroke();
        ctx.closePath();
    }

    drawSelectedStack(input) {
        this.holdingStack.draw(input.mouse.mapX,-input.mouse.mapY);
        this.holdingStack.drawAmount(input.mouse.mapX - 16, -input.mouse.mapY - 16);
    }

    drawItems(input) {

        // Draw items in hotbar
        for(let x=0;x<this.w;x++) {
            this.grid[x][this.h - 1].drawItem();
        }

        if(!this.view) {
            return;
        }
        
        // Draw items in rest inventory
        for(let x=0;x<this.w;x++) {
            for(let y=0;y<this.h-1;y++) {
                this.grid[x][y].drawItem();
            }
        }

        if(this.holdingStack) {
            this.drawSelectedStack(input);
        }
    }
}

class InventorySlot {
    constructor(x,y,ix,iy,player) {
        this.player = player; // Pointer
        this.stack = null;
        this.ix = ix,
        this.iy = iy,
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 64;
    }

    isHovered() {
        return (this.player.inventory.hoveredSlot.x == this.ix && this.player.inventory.hoveredSlot.y == this.iy);
    }

    // Draw slot
    draw() {
        setAttributes(ctx,{strokeStyle:"rgb(200,200,200)",lineWidth:3})

        ctx.beginPath();
        ctx.rect(this.x + this.player.camera.getX(),this.y + this.player.camera.getY(),this.w,this.h);
        ctx.stroke();
        ctx.closePath();

        this.drawHoverEffect();
    }

    // Draw item in slot
    drawItem() {

        if(!this.stack) {
            return;
        }

        // Item position
        let xPos = this.player.camera.getX() + this.x;
        let yPos = this.player.camera.getY() + this.y;

        // Draw item
        this.stack.draw(xPos + 16,yPos + 16);
        this.stack.drawAmount(xPos,yPos);
    }
    // Draw hover overlay
    drawHoverEffect() {

        if(!this.isHovered() || !this.player.inventory.view) {
            return;
        }

        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(this.player.camera.getX() + this.x,this.player.camera.getY() + this.y,this.w,this.h)
    }
}