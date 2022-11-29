import { ctx } from "../game/const.js";
import { mouse } from "../game/controls.js";
import { clamp, setAttributes } from "../misc.js";
import { player } from "./player.js";


class ItemInfoDisplay {
    constructor() {
        this.minimumWidth = 50;
        this.w;
        this.h;
        this.displaying = false;
    }

    set(item) {
        if(item) {
            this.itemName = item.displayName;
            this.rarityColor = item.textColor;
            this.displaying = true;
        } else {
            this.displaying = false;
        }
        
    }

    draw() {

        if(!this.displaying || !player.inventory.view) {
            return;
        }
        
        let x = mouse.mapX;
        let y = -mouse.mapY;

        setAttributes(ctx,{lineWidth:3,strokeStyle:"white",fillStyle:"rgba(0,0,0,0.4)",textAlign:"left",font:"24px Font1"});

        let textOffsetX = 24;
        let width = ctx.measureText(this.itemName).width + textOffsetX * 2;
        let height = 50
        //width = clamp(width,this.minimumWidth,Infinity);

        ctx.beginPath();
        ctx.rect(x,y,width,height);
        ctx.fill();
        ctx.closePath();

        setAttributes(ctx,{font:"24px Font1",fillStyle:this.rarityColor,strokeStyle:"black",lineWidth:5});
        ctx.strokeText(this.itemName,x + textOffsetX, y+32);
        ctx.fillText(this.itemName,x + textOffsetX, y+32);
    }
}

export const itemInfoDisplay = new ItemInfoDisplay();