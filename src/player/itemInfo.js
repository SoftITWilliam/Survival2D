import { ctx } from "../game/const.js";
import { mouse } from "../game/controls.js";
import { rgb } from "../game/rgb.js";
import { sprites } from "../loadAssets.js";
import { clamp, disableShadow, drawRounded, setAttributes, splitIntoLines } from "../misc.js";
import { player } from "./player.js";


class ItemInfoDisplay {
    constructor() {
        this.minimumWidth = 240;
        this.minimumHeight = 50;
        this.w;
        this.h;
        this.displaying = false;
        this.icon = null;

        this.offset = 24;
        this.baseHeight = 48;
        this.boxHeight;
        this.boxWidth;

        this.footerHeight = 36;
        this.descPos = 60;
        this.descLineHeight = 24;
    }

    set(item) {

        if(!item) {
            this.displaying = false;
            return;
        }

        this.displaying = true;
        this.itemName = item.displayName;
        this.rarity = item.rarityText;
        this.rarityColor = item.textColor;
        this.description = item.description;

        switch(item.itemType) {
            case "tool":
                switch(item.toolType) {
                    case "pickaxe":
                        this.icon = sprites.ui.item_type.icon_pickaxe; break;
                    default: 
                        this.icon = null;
                } break;
            case "tile":
                this.icon = sprites.ui.item_type.icon_tile; break;
            default: 
                this.icon = null;
        }
    }

    draw() {

        if(!this.displaying || !player.inventory.view || player.inventory.holdingStack) {
            return;
        }
        
        let x = mouse.mapX;
        let y = -mouse.mapY;
        

        setAttributes(ctx,{
            textAlign:"left",font:"24px Font1",
        });

        // Default box size
        this.boxWidth = ctx.measureText(this.itemName).width + this.offset * 2;
        this.boxHeight = this.baseHeight;
        if(this.boxWidth < this.minimumWidth) {
            this.boxWidth = this.minimumWidth;
        }

        // Description
        const desc = splitIntoLines(this.description,this.boxWidth);
        this.boxHeight += desc.length * this.descLineHeight;

        // Footer
        const footerPosition = this.boxHeight;
        this.boxHeight += this.footerHeight;

        // Box must be contained within screen
        if(y + this.boxHeight > player.cameraY + canvas.height) {
            y = player.cameraY + canvas.height - this.boxHeight;
        }
        
        // Begin rendering
        ctx.beginPath();
        
        setAttributes(ctx,{
            lineWidth:3,strokeStyle:"black",fillStyle:"rgb(60,60,100)",
            shadowOffsetX:0,shadowOffsetY:0,shadowColor:"black",shadowBlur:5
        });

        // Draw box
        drawRounded(x,y,this.boxWidth,this.boxHeight,10,ctx);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        disableShadow(ctx);

        // Display item name
        setAttributes(ctx,{font:"24px Font1",fillStyle:rgb(this.rarityColor),strokeStyle:"black",lineWidth:5});
        ctx.strokeText(this.itemName,x + this.offset, y+32);
        ctx.fillText(this.itemName,x + this.offset, y+32);

        // Display description
        setAttributes(ctx,{font:"18px Font1",fillStyle:"white"});
        for(let i = 0; i < desc.length; i++) {
            ctx.fillText(desc[i],x + this.offset,y + this.descPos + i * this.descLineHeight);
        }

        // Rarity text
        setAttributes(ctx,{font:"18px Font1",fillStyle:"rgb(165,165,165)"});
        ctx.fillText(this.rarity,x + this.offset,y + footerPosition + 22);

        // Icon
        if(this.icon !== null) {
            try {
                ctx.drawImage(this.icon,x + this.boxWidth - 32,y + footerPosition + 8,16,16);
            } catch {
                console.log(this.icon)
                console.log("Image error");
            }
        }
    }
}

export const itemInfoDisplay = new ItemInfoDisplay();