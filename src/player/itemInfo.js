import { ctx } from "../game/const.js";
import { mouse } from "../game/controls.js";
import { rgb } from "../game/rgb.js";
import { clamp, disableShadow, drawRounded, setAttributes } from "../misc.js";
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

        setAttributes(ctx,{
            lineWidth:3,strokeStyle:"black",fillStyle:"rgba(50,40,75,0.5)",textAlign:"left",font:"24px Font1",
            shadowOffsetX:0,shadowOffsetY:0,shadowColor:"black",shadowBlur:5
        });

        let textOffsetX = 24;
        let width = ctx.measureText(this.itemName).width + textOffsetX * 2;
        let height = 50
        //width = clamp(width,this.minimumWidth,Infinity);

        ctx.beginPath();
        drawRounded(x,y,width,height,10,ctx);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        disableShadow(ctx);

        setAttributes(ctx,{font:"24px Font1",fillStyle:rgb(this.rarityColor),strokeStyle:"black",lineWidth:5});
        ctx.strokeText(this.itemName,x + textOffsetX, y+32);
        ctx.fillText(this.itemName,x + textOffsetX, y+32);
    }
}

export const itemInfoDisplay = new ItemInfoDisplay();