import { ctx } from "../game/const.js";
import { rgba } from "../game/rgb.js";
import { setAttributes } from "../misc.js";
import { player } from "./player.js";



export class PickupLabelList {
    constructor() {
        this.labels = [];
    }   

    // Increment the frame counters for all visible labels
    update() {
        for(let i=0;i<this.labels.length;i++) {
            this.labels[i].incrementCounter();
            if(this.labels[i].alpha <= 0) {
                this.labels.splice(i,1);
            }
        }
    }

    // When an item is picked up that doesn't currenty have a label, add a new one to the list.
    add(item,amount) {

        // Look for already existing label
        for(let i=0;i<this.labels.length;i++) {

            // If one is found, its amount is increased and it's moved to the front of the list.
            if(this.labels[i].itemName == item.displayName) {
                this.labels[i].increaseAmount(amount);
                this.labels.unshift(this.labels[i]);
                this.labels.splice(i+1,1);
                return;
            }
        }

        // If no existing label is found, add a new one.
        this.labels.unshift(new PickupLabel(item,amount))

    }

    draw() {
        for(let i=0;i<this.labels.length;i++) {
            this.labels[i].draw(16 + i * 24);
        }
    }
}

class PickupLabel {
    constructor(item,amount) {
        this.itemName = item.displayName;
        this.color = item.textColor;
        this.amount = amount;

        this.displayFrames = 120; // start fading out the label after this many frames
        this.frameCounter = 0;
        this.alpha = 1;
    }

    incrementCounter() {
        this.frameCounter += 1;
        if(this.frameCounter >= this.displayFrames) {
            this.alpha -= 0.05;
        }
    }

    increaseAmount(amount) {
        this.amount += amount;
        this.frameCounter = 0;
        this.alpha = 1;
        this.amount
    }
    
    draw(yPos) {
        let txt = this.itemName + " (" + this.amount + ")";
        setAttributes(ctx,{font:"24px Font1",fillStyle:rgba(this.color,this.alpha),strokeStyle:"rgba(0,0,0,"+this.alpha+")",lineWidth:5,textAlign:"center"});
        ctx.strokeText(txt,player.x + player.w / 2, player.y - yPos);
        ctx.fillText(txt,player.x + player.w / 2,player.y - yPos);
    }
}