import { ctx } from "../game/global.js";
import { getLang } from "../game/lang.js";
import { sprites } from "../game/graphics/loadAssets.js";
import { drawRounded, renderPath, rgb } from "../helper/canvasHelper.js";
import { splitIntoLines } from "../helper/helper.js";
import toolTypes from "../item/toolTypesEnum.js";

export default class ItemInfoDisplay {
    constructor(player) {
        this.player = player // Pointer
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

        this.attributeLineHeight = 32;
    }

    set(item) {

        if(!item) {
            this.displaying = false;
            return;
        }

        this.displaying = true;

        // Universal properties
        this.itemName = item.displayName;
        this.rarity = item.rarityText;
        this.rarityColor = item.textColor;
        this.description = item.description;

        // Icon
        this.icon = this.getItemIcon(item);

        this.attributeCount = 0;
        this.attributes = [];

        if(item.placeable) {
            this.addAttribute("placeable");
        }

        if(item.itemType == "tool") {
            this.addAttribute("tier", item.miningLevel);
            this.addAttribute("toolSpeed", item.miningSpeed);
            this.addAttribute("toolReach", item.reach);
        }
    }

    getItemIcon(item) {
        switch(item.itemType) {
            case "tool":
                switch(item.toolType) {
                    case toolTypes.PICKAXE:
                        return sprites.ui.item_type.icon_pickaxe;
                    case toolTypes.AXE:
                        return sprites.ui.item_type.icon_axe;
                    case toolTypes.SHOVEL:
                        return sprites.ui.item_type.icon_shovel;
                    case toolTypes.HAMMER:
                        return sprites.ui.item_type.icon_hammer;
                    default: 
                        return null;
                }
            case "tile":
                return sprites.ui.item_type.icon_tile;
            default: 
                return null;
        }
    }

    addAttribute(attribute, value) {
        this.attributeCount += 1;
        let a;

        switch(attribute) {
            case "placeable":
                a = {
                    label: getLang("item_info_placeable"),   // "Can be placed"
                    value: "",
                    icon: null,                          
                }; 
                break;

            case "tier":
                a = {
                    label: getLang("item_info_tier"),
                    value: value,
                    icon:null,
                }; 
                break;

            case "toolSpeed":
                a = {
                    label: getLang("item_info_tool_speed"),
                    value: `${value * 100}%`,
                    icon:null,
                }; 
                break;

            case "toolReach":
                a = {
                    label: getLang("item_info_tool_reach"),
                    value: `+${value - this.player.defaultReach} ${getLang("item_info_tiles")}`,
                    icon:null,
                }; 
                break;
        }

        this.attributes.push(a);
    }

    draw(input) {
        if(!this.displaying || !this.player.inventory.view || this.player.inventory.holdingStack) return;

        this.x = input.mouse.mapX;
        this.y = -input.mouse.mapY;
        
        // =====================================
        //   Pre-rendering
        // =====================================

        // Default box size
        ctx.font = "24px Font1";
        this.boxWidth = ctx.measureText(this.itemName).width + this.offset * 2;
        this.boxHeight = this.baseHeight;
        if(this.boxWidth < this.minimumWidth) {
            this.boxWidth = this.minimumWidth;
        }

        // Description
        ctx.font = "18px Font1";
        const desc = splitIntoLines(this.description, this.boxWidth - this.offset * 2);
        this.boxHeight += desc.length * this.descLineHeight;

        // Attributes
        const attributePosition = this.boxHeight;
        this.boxHeight += this.attributeCount * this.attributeLineHeight;

        // Footer
        const footerPosition = this.boxHeight;
        this.boxHeight += this.footerHeight;

        // Box must be contained within screen
        if(this.y + this.boxHeight > this.player.camera.y + canvas.height) {
            this.y = this.player.camera.y + canvas.height - this.boxHeight;
        }

        // =====================================
        //   Rendering
        // =====================================
        
        Object.assign(ctx, {
            textAlign: "left", lineWidth: 2, strokeStyle: "black", fillStyle: "rgb(60,60,100)"
        });
        ctx.shadow("black", 5);

        // Draw box
        ctx.beginPath();
        drawRounded(this.x, this.y, this.boxWidth, this.boxHeight, 10, ctx);
        ctx.fill();
        ctx.restore();
        ctx.shadow();
        ctx.stroke();
        ctx.closePath();

        // Draw attribute box
        if(this.attributeCount > 0) {
            Object.assign(ctx, { fillStyle: "rgb(25,25,40)", lineWidth: 2 });
            renderPath(() => {
                ctx.rect(this.x + 1, this.y + attributePosition, this.boxWidth - 2, this.attributeCount * this.attributeLineHeight);
                ctx.fill();
                ctx.stroke();
            })
        }

        this.drawItemName();
        this.drawDescription(desc);
        this.drawAttributes(attributePosition);
        this.drawFooter(footerPosition);
    }

    drawItemName() {
        let clr = rgb(this.rarityColor);
        Object.assign(ctx, { font: "24px Font1", fillStyle: clr, strokeStyle: "black", lineWidth: 5 });
        ctx.drawOutlinedText(this.itemName, this.x + this.offset, this.y + 32);
    }

    drawDescription(desc) {
        Object.assign(ctx, { font:"18px Font1", fillStyle:"white" });
        for(let i = 0; i < desc.length; i++) {
            let y = this.y + this.descPos + i * this.descLineHeight + 2;
            ctx.fillText(desc[i], this.x + this.offset, y);
        }
    }

    drawAttributes(position) {
        Object.assign(ctx, { font: "18px Font1", fillStyle: "rgb(220,220,220)" });
        for(let i = 0; i < this.attributes.length; i++) {
            let attr = this.attributes[i];
            let y = this.y + position + i * this.attributeLineHeight + 22;

            ctx.textAlign = "left";
            ctx.fillText(attr.label, this.x + this.offset, y);

            ctx.textAlign = "right";
            ctx.fillText(attr.value, this.x + this.boxWidth - this.offset, y);
        }
    }

    drawFooter(position) {
        // Rarity text
        Object.assign(ctx, { font: "18px Font1", fillStyle: "rgb(165,165,165)", textAlign: "left" });
        ctx.fillText(this.rarity, this.x + this.offset, this.y + position + 24);
        
        // Icon
        if(this.icon !== null) {
            try {
                ctx.drawImage(this.icon, this.x + this.boxWidth - 28, this.y + position + 10, 16, 16);
            } catch {
                console.log(this.icon)
                console.log("Image error");
            }
        }
    }
}