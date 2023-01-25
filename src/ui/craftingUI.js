import { ctx } from "../game/global.js";
import { colors } from "../game/graphics/colors.js";
import { renderItem, renderPath, rgb, rgbm } from "../game/graphics/renderUtil.js";
import { setAttributes, drawRounded, getGap, mouseOn } from "../misc/util.js";
import Button from "./button.js";
import * as components from "./componentParent.js";



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

        // ============================
        //    COMPONENTS
        // ============================

        this.game = this.menu.player.game;

        this.rowHeight = 32;

        this.components = {}

        // Crafting menu base
        this.CPrimary = new components.PrimaryContainer(this.game, {
            width: this.w, height: this.h, cornerRadius: 16,
            fillColor: colors.uiLight, strokeColor: colors.black,
        }),

        // Sections
        this.CSectionLeft = new components.CraftingSection(this.game, {
            width: this.sectionWidth, height: this.sectionHeight,
        });

        this.CSectionRight = new components.CraftingSection(this.game, {
            width: this.sectionWidth, height: this.sectionHeight,
        });
        
        // Top label
        this.CTopLabel = new components.OutlinedText(this.game, {
            font: "Font1", fontSize: 36, 
            textFill: colors.white, textStroke: colors.black, 
            position: "ABSOLUTE", offsetY: 48, centerX: true, textAlign: "center",
        });

        this.CPrimary.addChildren([this.CSectionLeft,this.CSectionRight,this.CTopLabel]);

        // "No recipe selected" text
        this.CNoRecipe = new components.Text(this.game, {
            font: "Font1", fontSize: 24, text: "No recipe selected", 
            textFill: colors.lightGray, textAlign: "center",
            centerX: true, centerY: true, 
        });

        this.COutputSprite = new components.Item(this.game, {
            width:24, height: 24, position: "absolute", offsetX: 16, offsetY: 16, item: null,
        });

        this.COutputName = new components.Text(this.game, {
            font:"Font1", fontSize: 20, textFill: colors.white, textAlign: "center",
            position: "absolute", centerX: true, offsetY: 28, 
        });

        this.COutputAmount = new components.Default(this.game, {
            font:"Font1", fontSize: 20, textFill: colors.white, textAlign: "center", textBaseline: "middle", textCenterX: true, textCenterY: true,
            position: "absolute", floatX: "right", offsetX: 20, offsetY: 16,
            fillColor: colors.uiLight, cornerRadius: 4, height: 24
        });

        this.CItemCostList = new components.Default(this.game, {
            width: this.sectionWidth, floatY: "bottom", offsetY: 68, position: "absolute", childDirection: "column",
        });

        this.CItemCostLabels = new components.Container(this.game, {
            width: this.sectionWidth, position: "relative", height: this.rowHeight, fillColor: colors.uiDarker,
        });

        this.CItemCostLabelList = [
            new components.Default(this.game, {
                text: "Amount", width: this.sectionWidth * 0.20, textAlign: "center", textCenterX: true,
            }),
            new components.Default(this.game, {
                text: "Item", width: this.sectionWidth * 0.48,
            }),
            new components.Default(this.game, {
                text: "Total", width: this.sectionWidth * 0.14,
            }),
            new components.Default(this.game, {
                text: "Have", width: this.sectionWidth * 0.14,
            }),
        ];

        this.CItemCostLabelList.forEach(label => {
            label.setFont(14,"Font1");
            label.setTextAttribute("textBaseline","middle");
            label.setTextColor(colors.white,null);
            label.textCenterY = true;
            label.h = this.rowHeight;
        });

        this.CSectionRight.addChildren([this.CNoRecipe, this.COutputSprite, this.COutputName, this.COutputAmount, this.CItemCostList]);
        this.CItemCostList.addChildren([this.CItemCostLabels]);
        this.CItemCostLabels.addChildren(this.CItemCostLabelList);

        this.CCraftableList = new components.Scrollable(this.game, {
            width: this.sectionWidth, height: this.sectionHeight,
        });

        this.CSectionLeft.addChildren([this.CCraftableList]);

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

    // Prepare components for displaying recipe
    loadRecipe(input,output,amount) {
        this.COutputAmount.setText("x" + amount);
        this.COutputAmount.setSize((this.COutputAmount.getTextWidth() + 16), 24);
        this.COutputAmount.update();
        this.COutputSprite.setItem(output);
        this.COutputName.setText(output.displayName);

        this.CItemCostList.children = [];

        this.CInputList = [];

        input.forEach(i => {
            let container = new components.Default(this.game, {
                width: this.sectionWidth, height: this.rowHeight,
            });

            let item = i[0];
            let itemAmount = i[1];
            let totalAmount = itemAmount * this.menu.craftingAmount;
            let avalible = this.menu.avalibleResources[item.registryName];

            let children = [
                new components.Default(this.game, {
                    height: this.rowHeight, width: this.sectionWidth * 0.20, text: itemAmount, textCenterX: true,
                }),

                new components.Item(this.game, {
                    height: 24, width:24, item: item, centerY: true,
                }),

                new components.Default(this.game, {
                    height: this.rowHeight, width: this.sectionWidth * 0.48 - 32, offsetX: 8, text: i[0].displayName,
                }),

                new components.Default(this.game, {
                    height: this.rowHeight, width: this.sectionWidth * 0.12, text: totalAmount, textCenterX: true,
                }),

                new components.Default(this.game, {
                    height: this.rowHeight, width: this.sectionWidth * 0.14, text: avalible.toString(), textCenterX: true,
                }),
            ];

            children.forEach(child => {
                child.setTextColor(colors.white);
                child.setTextAttribute("textBaseline","middle");
                child.textCenterY = true;
            });

            if(avalible < totalAmount) {
                children[4].setTextColor(colors.errorRed,null);
            }

            container.addChildren(children);

            this.CInputList.push(container);
        })

        this.CInputList.unshift(this.CItemCostLabels);
        this.CItemCostList.addChildren(this.CInputList);
        this.CItemCostList.setSize(this.sectionWidth, this.CItemCostList.getTotalChildHeight());

        this.update();
    }

    update() {
        if(this.menu.isOpen) {
            this.CPrimary.updateCascading();
        }
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

    updateCraftingAmount(input,output,amount) {
        ctx.font = "16px Font1";
        this.amountDisplayWidth = ctx.measureText(amount).width + 24;
    }

    renderBase(label) {
        this.CPrimary.render();
        this.CSectionLeft.renderCascading();
        this.CSectionRight.render();
        this.CTopLabel.setText(label);
        this.CTopLabel.render();
    }

    loadCraftables(recipes,game) {
        this.craftables = [];

        for(let i = 0; i < recipes.length; i++) {
            let item = game.itemRegistry.get(recipes[i].output);

            let rowHeight = 56;

            let itemRow = new components.Clickable(game, {
                width: this.sectionWidth - this.CCraftableList.scrollbarWidth, height: rowHeight, 
                fillColor: colors.uiDark,
            });

            itemRow.setOnClick(() => {
                this.menu.selectRecipe(i);
            })

            let itemIcon = new components.Item(game, {
                width: 32, height: 32, item: item, centerY: true, offsetX: 8,
            });

            let itemName = new components.OutlinedText(game, {
                font: "Font1", fontSize: 20, textFill: item.textColor, textStroke: colors.black, text: item.displayName,
                item: item, centerY: true, offsetX: 16, 
            });

            if(recipes[i].outputAmount > 1) {
                itemName.setText(`${item.displayName} (${recipes[i].outputAmount})`);
            }

            itemRow.addChildren([itemIcon, itemName]);

            this.craftables.push(itemRow);
        }

        this.CCraftableList.children = [];
        this.CCraftableList.addChildren(this.craftables);
        this.CCraftableList.updateScrollableHeight();
        this.CCraftableList.refreshScrollbar();
    }

    renderRecipeInfo() {
        this.COutputSprite.render();
        this.COutputName.render();
        this.COutputAmount.render();
        this.CItemCostList.renderCascading();
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
        this.CNoRecipe.render();
    }
}