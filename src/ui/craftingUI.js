import { ctx } from "../game/global.js";
import { colors } from "../game/graphics/colors.js";
import { renderItem, renderPath, rgb, rgbm } from "../game/graphics/renderUtil.js";
import { setAttributes, drawRounded, getGap, mouseOn } from "../misc/util.js";
import Button from "./button.js";



export default class CraftingInterface {
    constructor(menu) {
        // Pointer
        this.menu = menu;
        
        // General attributes
        this.x;
        this.y;
        this.w = 700;
        this.h = 500;

        // Section size
        this.sectionWidth = 310;
        this.sectionHeight = 380;
        this.craftables = [];

        this.amountDisplayWidth = 0;

        // Section positions
        this.section1 = {
            x: getGap(this.w, this.sectionWidth, 2),
            y: this.h - this.sectionHeight - getGap(this.w, this.sectionWidth, 2),
        }
         
        this.section2 = {
            x: this.section1.x * 2 + this.sectionWidth,
            y: this.section1.y,
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

        // Section sizes for ingredient list
        this.s1 = Math.round(this.sectionWidth * 0.20);
        this.s2 = Math.round(this.sectionWidth * 0.48);
        this.s3 = Math.round(this.sectionWidth * 0.14);
        this.s4 = Math.round(this.sectionWidth * 0.14);


        // ============================
        //    BUTTONS
        // ============================

        this.buttons = {
            craftItem: new Button(),
            maxAmount: new Button(),
            increaseAmount: new Button(),
            decreaseAmount: new Button(),
            minAmount: new Button(),
        }
    
        this.buttons.craftItem.setSize(96,36);
        this.buttons.craftItem.setText("Craft",colors.white,"Font1",24);
        this.buttons.craftItem.setDisplay(colors.uiLight,12);
        this.buttons.craftItem.setOnClick(() => this.menu.craftItem());

        this.buttons.maxAmount.setText(">","W");
        this.buttons.increaseAmount.setText("+");
        this.buttons.decreaseAmount.setText("-");
        this.buttons.minAmount.setText("<");

        const setBaseProperties = (b,text) => {
            b.setSize(32,32);
            b.setText(text,colors.white,"Font1",18);
            b.setDisplay(colors.uiLight,8);
        }

        setBaseProperties(this.buttons.maxAmount,">");
        setBaseProperties(this.buttons.increaseAmount,"+");
        setBaseProperties(this.buttons.decreaseAmount,"-");
        setBaseProperties(this.buttons.minAmount,"<");

        this.buttons.maxAmount.setOnClick(() => this.menu.maxAmount());
        this.buttons.increaseAmount.setOnClick(() => this.menu.increaseAmount());
        this.buttons.decreaseAmount.setOnClick(() => this.menu.decreaseAmount());
        this.buttons.minAmount.setOnClick(() => this.menu.minAmount());
    }

    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }

    getCraftablePos(row,column) {
        return {
            x: this.x + this.section1.x + this.itemGap + (this.craftableSize + this.itemGap) * column,
            y: this.y + this.section1.y + this.itemGap + (this.craftableSize + this.itemGap) * row,
        }
    }

    updateHover(input) {
        for(let i=0; i<this.craftables.length;i++) {
            let pos = this.getCraftablePos(this.craftables[i].row,this.craftables[i].column);
            let craftable = {x: pos.x, y: pos.y, w: this.craftableSize, h: this.craftableSize}
            if(mouseOn(craftable,input.mouse)) {
                this.menu.hoveredCraftable = i;
                return;
            }
        }
        this.menu.hoveredCraftable = null;
    }

    updateCraftingAmount(amount) {
        ctx.font = "16px Font1";
        this.amountDisplayWidth = ctx.measureText(amount).width + 24;
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
            let itemPos = this.getCraftablePos(c.row,c.column);
            c.render(itemPos.x,itemPos.y);
        });
    }

    renderRecipeInfo(outputItem) {
        let x = this.x + this.section2.x;
        let y = this.y + this.section2.y;
        let centerX = x + this.sectionWidth / 2;

        setAttributes(ctx,{
            fillStyle:"white",
            textAlign:"center",
            font:"20px Font1",
        });

        // Render item sprite in the corner
        renderItem(outputItem, x + 12, y + 16, 24, 24);

        // Render item name
        ctx.fillText(
            outputItem.displayName,
            centerX,
            y + 36,
        );
    }

    // Render amount crafted at once
    renderOutputAmount(amount) {
        let x = this.x + this.section2.x;
        let y = this.y + this.section2.y;

        ctx.fillStyle = rgb(colors.uiLight);
        let txt = "x" + amount;
        let txtWidth = ctx.measureText(txt).width + 16;

        renderPath(() => {
            drawRounded(x + this.sectionWidth - txtWidth - 16,y + 16,txtWidth,24,4,ctx);
            ctx.fill(); ctx.restore();
        })
        
        ctx.fillStyle = "white";
        ctx.fillText(
            txt,
            x + this.sectionWidth - 16 - txtWidth/2,
            y + 35,
        );
    }

    /** 
     * Draw the information about the currently selected recipe
    */
    renderRecipeCost(inputItems, amount) {
        let rowHeight = 32;
        let rowCount = inputItems.length + 1;
        let rowGap = 4;

        let x = this.x + this.section2.x;
        let y = this.y + this.section2.y + this.sectionHeight - 64 - ((rowHeight + rowGap) * rowCount);

        ctx.font = "14px Font1";

        // Top row
        ctx.fillStyle = rgbm(colors.uiDark,0.8);
        ctx.fillRect(x, y,this.sectionWidth,rowHeight);
        ctx.fillStyle = "rgb(220,220,220)";

        ctx.textAlign = "center";
        ctx.fillText("Amount", x + this.s1/2, y + 20);
        ctx.textAlign = "left";
        ctx.fillText("Item", x + this.s1 + 8, y + 20);
        ctx.textAlign = "center";
        ctx.fillText("Total", x + this.s1 + this.s2 + this.s3/2, y + 20);
        ctx.fillText("Have", x + this.s1 + this.s2 + this.s3 + this.s4/2, y + 20);

        // Resouces required
        for(let i=0; i<rowCount-1;i++) {
            let yPos = y + ((rowHeight + rowGap) * (i+1));

            ctx.fillStyle = "rgb(220,220,220)";

            let item = inputItems[i][0];
            let itemAmount = inputItems[i][1];
            let totalAmount = itemAmount * amount;
            let avalible = this.menu.avalibleResources[item.registryName];

            ctx.textAlign = "center";
            ctx.fillText(itemAmount, x + this.s1/2, yPos + 20);
            ctx.fillText(totalAmount, x + this.s1 + this.s2 + this.s3/2, yPos + 20);

            if(avalible < totalAmount) {
                ctx.fillStyle = rgb(colors.errorRed);
            }
            ctx.fillText(avalible, x + this.s1 + this.s2 + this.s3 + this.s4/2, yPos + 20);
            setAttributes(ctx,{textAlign: "left", fillStyle: "white"});
            ctx.fillText(item.displayName, x + this.s1 + 30, yPos + 20);
            renderItem(item, x + this.s1, yPos + (rowHeight - 24) / 2, 24, 24);
        }
    }

    updateButtons(input) {
        let xPos = this.x + this.section2.x;
        let yPos = this.y + this.section2.y + this.sectionHeight - this.buttons.craftItem.getHeight() - 16;

        // Update positions
        this.buttons.craftItem.setPosition(xPos + this.sectionWidth - this.buttons.craftItem.getWidth() - 12, yPos);

        xPos += 14;
        let spaceBetween = 4;
        let size = 32;
        this.buttons.minAmount.setPosition(xPos, yPos + 2);
        this.buttons.decreaseAmount.setPosition(xPos + size + spaceBetween, yPos + 2);
        this.buttons.increaseAmount.setPosition(xPos + (2*size) + this.amountDisplayWidth + (3*spaceBetween), yPos + 2);
        this.buttons.maxAmount.setPosition(xPos + (3*size) + this.amountDisplayWidth + (4*spaceBetween), yPos + 2);

        this.amountDisplayPos = {x: xPos + (2*size) + this.amountDisplayWidth/2 + (2*spaceBetween), y: yPos + 20}

        let bgPadding = 4;
        this.buttonBg = {
            x: xPos - bgPadding,
            y: (yPos + 2) - bgPadding,
            w: (size * 4) + (spaceBetween * 4) + this.amountDisplayWidth + (bgPadding * 2),
            h: size + (bgPadding * 2)
        }
        
        // Update all buttons
        for(let b in this.buttons) {
            this.buttons[b].update(input);
        }
        this.buttons.craftItem.update(input);
    }

    renderRecipeButtons() {
        ctx.fillStyle = rgbm(colors.uiDark,0.5);
        renderPath(() => {
            drawRounded(this.buttonBg.x, this.buttonBg.y, this.buttonBg.w, this.buttonBg.h,10,ctx);
            ctx.fill(); ctx.restore();
        })
        setAttributes(ctx,{fillStyle:rgb(colors.white),font:"16px Font1",textAlign:"center"});
        ctx.fillText(this.menu.craftingAmount,this.amountDisplayPos.x,this.amountDisplayPos.y);
        this.buttons.craftItem.render();
        this.buttons.maxAmount.render();
        this.buttons.increaseAmount.render();
        this.buttons.decreaseAmount.render();
        this.buttons.minAmount.render();
    }

    /** 
     * Draw "No recipe selected" text in the middle of the recipe section, if no recipe is selected
    */
    renderNoRecipe() {
        setAttributes(ctx,{
            fillStyle:"rgb(200,200,200)",
            textAlign:"center",
            font:"24px Font1",
        });
        ctx.fillText(
            "No recipe selected",
            this.x + this.section2.x + this.sectionWidth / 2,
            this.y + this.section2.y + this.sectionHeight / 2
        );
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

        // If hovered, draw the 
        if(this.interface.menu.hoveredCraftable == this.index) {
            ctx.filter = "brightness(150%)";
        }
        renderItem(this.item, Math.round(x), Math.round(y), this.size, this.size);
        ctx.filter = "none";

        // If selected, draw a white square around it.
        if(this.interface.menu.selectedRecipe == this.index) {
            setAttributes(ctx,{strokeStyle:"white",lineWidth:2});
            renderPath(() => {
                ctx.rect(x-4 ,y-4, this.size+8, this.size+8);
                ctx.stroke();
            }) 
        }
    }
}