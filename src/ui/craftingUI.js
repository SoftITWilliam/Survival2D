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
            width: this.sectionWidth, height: this.sectionHeight, childDirection: "column"
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

        this.CLowerContainer = new components.Container(this.game, {
            width: this.sectionWidth, height: 72, floatY: "bottom",
        })

        this.CItemCostList = new components.Default(this.game, {
            width: this.sectionWidth, floatY: "bottom", childDirection: "column",
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

        this.CSectionRight.addChildren([this.CNoRecipe, this.COutputSprite, this.COutputName, this.COutputAmount]);
        this.CItemCostList.addChildren([this.CItemCostLabels]);
        this.CItemCostLabels.addChildren(this.CItemCostLabelList);

        this.CCraftableList = new components.Scrollable(this.game, {
            width: this.sectionWidth, height: this.sectionHeight,
        });

        this.CSectionLeft.addChildren([this.CCraftableList]);

        // ============================
        //    BUTTONS
        // ============================

        this.CButtonContainer = new components.Default(this.game, {
            height: 48, width: 188,
            fillColor: colors.uiDarker,
            childSpacing: 4, childMargin: 8, childAlignment: "setSpacing", centerY: true,
        });

        this.CSectionRight.addChildren([this.CButtonContainer]);

        this.buttons = [];
        let buttonCharacters = ["<","-","+",">"];

        for(let i = 0; i < 4; i++) {
            this.buttons.push(new components.Clickable(this.game, {
                height: 32, width: 32, cornerRadius: 8,
                font: "Font1", fontSize: 24, text: buttonCharacters[i],
                fillColor: colors.uiLight, textFill: colors.white,
                textCenterX: true, textCenterY: true, textAlign: "center", textBaseline: "middle",
            }));
        }

        this.buttons[2].floatX = "right";
        this.buttons[3].floatX = "right";

        this.buttons.push(new components.Clickable(this.game, {
            height: 32, width: 80, cornerRadius: 8,
            floatX: "right", centerY: true, fillColor: colors.uiLight, 
            font: "Font1", fontSize: 24, textCenterX: true, textCenterY: true, 
            textAlign: "center", textBaseline: "middle", text: "Craft", textFill: colors.white,
        }));

        this.CCraftingAmount = new components.Text(this.game, {
            font: "Font1", fontSize: 20, textFill: colors.white,
            textAlign:"middle", textBaseline: "middle", centerX: true, centerY: true,
        })

        this.buttons[0].setOnClick(() => this.menu.minAmount());
        this.buttons[1].setOnClick(() => this.menu.decreaseAmount());
        this.buttons[2].setOnClick(() => this.menu.increaseAmount());
        this.buttons[3].setOnClick(() => this.menu.maxAmount());
        this.buttons[4].setOnClick(() => this.menu.craftItem());

        this.CButtonContainer.addChildren([this.buttons[0],this.buttons[1],this.CCraftingAmount,this.buttons[3],this.buttons[2]]);
        this.CLowerContainer.addChildren([this.CButtonContainer, this.buttons[4]]);
        this.CSectionRight.addChildren([this.CLowerContainer,this.CItemCostList]);
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
        if(!this.menu.isOpen) {
            return;
        }
        
        this.CPrimary.updateCascading();

        this.refreshInputItems(this.menu.inputItems,this.menu.outputItem,this.menu.outputAmount);
    }

    setPosition(x,y) {
        this.x = x;
        this.y = y;
    }

    updateCraftingAmount(amount) {
        this.CCraftingAmount.setText(amount);
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
        this.CLowerContainer.renderCascading();
    }

    refreshInputItems(input,output,amount) {
        if(!input) {
            return;
        }

        for(let i = 0; i < input.length; i++) {
            let item = this.game.itemRegistry.get(input[i][0].registryName);
            let row = this.CInputList[i+1].children;

            // Update 'total'
            let total = this.menu.craftingAmount * input[i][1]
            row[3].setText(total);

            // Update 'have'
            let avalible = this.menu.avalibleResources[item.registryName];
            row[4].setText(avalible);

            if(avalible < total) {
                row[4].setTextColor(colors.errorRed,null);
            } else {
                row[4].setTextColor(colors.white);
            }
        }
    }

    updateButtons(input) {

    }

    /** 
     * Draw "No recipe selected" text in the middle of the recipe section, if no recipe is selected
    */
    renderNoRecipe() {
        this.CNoRecipe.render();
    }
}