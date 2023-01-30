
// FIXED IMPORTS:
import { ctx } from "../game/global.js";
import { dropItemFromBlock } from "../item/dropItem.js";
import { rng } from "../misc/util.js";

class MiningEvent {
    constructor(tile,item,game) {
        this.game = game;
        this.tile = tile;
        this.finished = false;

        if(item) {
            this.toolType = item.toolType ? item.toolType : null;
            this.miningSpeed = item.miningSpeed ? item.miningSpeed : 1;
            this.miningLevel = item.miningLevel ? item.miningLevel : 0;
        } else {
            this.toolType = null;
            this.miningSpeed = 1;
            this.miningLevel = 0;
        }
        
        this.progress = 0;

        // Calculate total mining time
        this.goal = this.tile.miningTime * 60;
        if(tile.toolType == this.toolType) {
            this.goal = Math.floor(this.goal / this.miningSpeed);
        }
    }

    increaseProgress() {
        this.progress += 1;
        if(this.progress == this.goal) {
            this.finish();
        }
    }

    finish() {

        // Break tile
        if(this.tile.objectType == "wall") {
            this.game.world.getWall(this.tile.gridX,this.tile.gridY).breakTile(this.toolType,this.miningLevel);
        } else {
            this.game.world.getTile(this.tile.gridX,this.tile.gridY).breakTile(this.toolType,this.miningLevel);
        }

        this.finished = true;
    }

    drawProgress() {
        let p = 1.5 + this.progress / this.goal * 2;

        ctx.beginPath();
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.moveTo(this.tile.centerX,this.tile.centerY);
        ctx.lineTo(this.tile.centerX,this.tile.centerY-16);
        ctx.arc(this.tile.centerX,this.tile.centerY,16,1.5*Math.PI,p * Math.PI);
        ctx.lineTo(this.tile.centerX,this.tile.centerY);
        ctx.fill();
    }

    dropItems() {
        for(let i=0;i<this.tile.tileDrops.length;i++) {
            const drop = this.tile.tileDrops[i];
            

            // If tool is required and isn't used, the item is not dropped.
            if(drop.requireTool && this.toolType != this.tile.toolType) {
                continue;
            }

            // If drop rate RNG isn't high enough, the item is not dropped.
            let rand = rng(1,100);
            if(rand > drop.rate) {
                continue;
            }

            // If 'amount' is a number, drop that amount.
            // If 'amount' is an array, the first number is the minimum, and the second is maximum.
            let itemAmount = 0;
            if(Array.isArray(drop.amount)) {
                itemAmount = rng(drop.amount[0],drop.amount[1]);
            } else {
                itemAmount = drop.amount;
            }
            console.log(this.itemAmount);
            dropItemFromBlock(this.tile,drop.id,itemAmount);
        }
    }
}

export { MiningEvent }