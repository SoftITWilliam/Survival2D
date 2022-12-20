import { canvas, ctx, INVENTORY_HEIGHT, INVENTORY_WIDTH } from "../game/const.js";
import { mouse } from "../game/controls.js";
import { limitCameraX, mouseOn, setAttributes } from "../misc.js";
import { ItemStack } from "../world/item/itemStack.js";
import { itemInfoDisplay } from "./itemInfo.js";
import { player } from "./player.js";


export class Inventory {
    constructor() {
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
                    row.push(new InventorySlot(this.leftEdge + this.slotSize*x,this.topEdge + this.slotSize*y,x,y));
                } else {
                    row.push(new InventorySlot(this.leftEdge + this.slotSize*x,this.topEdge + this.slotSize*y - 24,x,y));
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

    update() {
        this.updateInteraction();
        this.updateItemInfo();
    }

    updateItemInfo() {

        // If no slot is hovered, hide item info
        if(this.hoveredSlot.x === null || this.hoveredSlot.y === null) {
            itemInfoDisplay.set(null);
            return;
        }

        let slot = this.grid[this.hoveredSlot.x][this.hoveredSlot.y];
        if(slot.stack) {
            itemInfoDisplay.set(slot.stack.item);
            return;
        }
        
        itemInfoDisplay.set(null);
    }

    updateInteraction() {
        this.hoveredSlot = this.checkHover();

        if(!mouse.click && !mouse.rightClick) {
            return;
        }

        const insertAmount = (
            mouse.click ? (this.holdingStack ? this.holdingStack.amount : null) : 
            mouse.rightClick ? 1 : null
        );

        const split = (
            mouse.rightClick ? true : false 
        );
        
        if(this.holdingStack) {
            this.insertIntoSlot(this.hoveredSlot,insertAmount);
        } else {
            this.selectSlot(this.hoveredSlot.x,this.hoveredSlot.y,split);
        }

        mouse.click = false;
        mouse.rightClick = false;
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
    checkHover() {

        // Get currently hovered inventory grid coordinates
        let slotX = Math.floor((mouse.x - this.leftEdge) / this.slotSize);
        let slotY = Math.floor((mouse.y - this.topEdge + 24) / this.slotSize);

        // Invalid X value
        if(slotX < 0 || slotX >= this.w) {
            slotX = null;
        }

        // Invalid Y value OR in hotbar row
        if(slotY < 0 || slotY >= this.h - 1) {
            slotY = null;
        }

        // Check if hotbar row is hovered
        if(Math.floor((mouse.y - this.topEdge) / this.slotSize) == this.h - 1) {
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
     * Try to add an item into the inventory
     * 
     * @param {*} item 
     * @param {*} amount 
     * @returns 
     */
    addItem(item,amount) {
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
                player.pickupLabels.add(item,startAmount);
                return;
            }
        }

        // Find empty inventory space
        let emptySlot = this.findEmptySlot();

        // If inventory is full, return the amount of items left.
        if(!emptySlot) {
            if(startAmount - amount != 0) {
                player.pickupLabels.add(item,startAmount - amount);
            }
            return amount;
        }

        let x = emptySlot.x; let y = emptySlot.y;

        // Creates new item stack
        // (If the item entity picked up still has items left after this, they will be deleted)
        // (Unless Tile entities of the same type combine with eachother in the future, this won't be a problem)
        this.grid[x][y].stack = new ItemStack(item,amount);

        // If new stack is placed in the selected hotbar slot, the selection is refreshed.
        if(y + 1 == this.h && x + 1 == this.selectedHotbarSlot) {
            player.selectItem(x + 1);
        }
        
        player.pickupLabels.add(item,startAmount);
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
        ctx.rect(limitCameraX(player.cameraX) + this.leftEdge-3,player.cameraY + this.topEdge-27,this.fullWidth+6,this.slotSize*(this.h-1) +6);
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
        ctx.rect(limitCameraX(player.cameraX) + this.leftEdge-3,player.cameraY + this.topEdge-3 + this.slotSize * 3,this.fullWidth+6,this.slotSize+6);
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
        ctx.rect(limitCameraX(player.cameraX) + slot.x,player.cameraY + slot.y,this.slotSize,this.slotSize);
        ctx.stroke();
        ctx.closePath();
    }

    drawSelectedStack() {
        this.holdingStack.draw(mouse.mapX,-mouse.mapY);
        this.holdingStack.drawAmount(mouse.mapX - 16, -mouse.mapY - 16);
    }

    drawItems() {

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
            this.drawSelectedStack();
        }
    }
}

class InventorySlot {
    constructor(x,y,ix,iy) {
        this.stack = null;
        this.ix = ix,
        this.iy = iy,
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 64;
    }

    isHovered() {
        return (player.inventory.hoveredSlot.x == this.ix && player.inventory.hoveredSlot.y == this.iy);
    }

    // Draw slot
    draw() {
        setAttributes(ctx,{strokeStyle:"rgb(200,200,200)",lineWidth:3})

        ctx.beginPath();
        ctx.rect(this.x + limitCameraX(player.cameraX),this.y + player.cameraY,this.w,this.h);
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
        let xPos = limitCameraX(player.cameraX) + this.x;
        let yPos = player.cameraY + this.y;

        // Draw item
        this.stack.draw(xPos + 16,yPos + 16);
        this.stack.drawAmount(xPos,yPos);
    }
    // Draw hover overlay
    drawHoverEffect() {

        if(!this.isHovered() || !player.inventory.view) {
            return;
        }

        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.fillRect(limitCameraX(player.cameraX) + this.x,player.cameraY + this.y,this.w,this.h)
    }
}