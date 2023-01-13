import { ctx } from "../game/global.js";
import { colors } from "../game/graphics/colors.js";
import { renderItem, renderPath, rgb } from "../game/graphics/renderUtil.js";
import { setAttributes, drawRounded, getGap } from "../misc/util.js";



export default class CraftingInterface {
    constructor(menu) {
        // Pointer
        this.menu = menu;
        
        // General attributes
        this.x;
        this.y;
        this.w = 620;
        this.h = 500;

        // Section size
        this.sectionWidth = 260;
        this.sectionHeight = 380;
        this.craftables = [];

        // Section 1 position
        this.section1 = {
            x: getGap(this.w, this.sectionWidth, 2),
            y: this.h - this.sectionHeight - getGap(this.w, this.sectionWidth, 2),
        }

        // Attributes for craftable list
        this.craftableSize = 48;
        this.itemsPerRow = Math.floor(this.sectionWidth / this.craftableSize);

        // Calculate gap size between items. Minimum 16.
        this.itemGap = getGap(this.sectionWidth,this.craftableSize,this.itemsPerRow);
        if(this.itemGap < 16) {
            this.itemsPerRow -= 1;
            this.itemGap = getGap(this.sectionWidth,this.craftableSize,this.itemsPerRow);
        }
    }

    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }

    renderBase() {
        setAttributes(ctx,{
            fillStyle:rgb(colors.uiLight),
            strokeStyle:"black",
            lineWidth:4,
        });

        renderPath(() => {
            drawRounded(this.x, this.y, this.w, this.h, 16, ctx);
            ctx.fill(); ctx.restore(); ctx.stroke();
        })

        ctx.fillStyle = rgb(colors.uiDark);
        let gap = getGap(this.w, this.sectionWidth, 2);
        let sectionOffset = this.h - this.sectionHeight - gap;

        renderPath(() => {
            ctx.rect(this.x + gap,this.y + sectionOffset, this.sectionWidth, this.sectionHeight);
            ctx.rect(this.x + this.sectionWidth + (gap * 2),this.y + sectionOffset, this.sectionWidth, this.sectionHeight);
            ctx.fill(); ctx.stroke();
        })
        
    }

    renderTopLabel(label) {
        setAttributes(ctx,{
            fillStyle:"white",
            strokeStyle:"black",
            lineWidth:5,
            font:"36px Font1",
            textAlign:"center",
        });

        renderPath(() => {
            ctx.strokeText(label,this.x + (this.w / 2),this.y + 48);
            ctx.fillText(label,this.x + (this.w / 2),this.y + 48);
        })
    }

    loadCraftables(recipes,game) {
        this.craftables = [];
        for(let i = 0; i < recipes.length; i++) {
            // Get item
            let item = game.itemRegistry.get(recipes[i].output);

            // Calculate its row and column position
            let r = Math.floor(i / this.itemsPerRow);
            let c = (i % this.itemsPerRow);
            
            
            this.craftables.push(new CraftableItem(r,c,item,this.craftableSize,i,this));
        }
    }

    renderRecipeList() {
        this.craftables.forEach(c => {
            let itemX = this.x + this.section1.x + this.itemGap + (this.craftableSize + this.itemGap) * c.column;
            let itemY = this.y + this.section1.y + this.itemGap + (this.craftableSize + this.itemGap) * c.row;
            c.render(itemX,itemY);
        });
    }
}

class CraftableItem {
    constructor(r,c,item,size,index,parent) {
        this.interface = parent; // Pointer
        this.item = item;
        this.row = r;
        this.column = c;
        this.size = size;
        this.index = index;
    }

    render(x,y) {
        renderItem(this.item, Math.round(x), Math.round(y), this.size, this.size);
    }
}