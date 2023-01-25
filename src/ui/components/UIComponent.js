import { canvas, ctx } from "../../game/global.js";
import { renderPath, rgb } from "../../game/graphics/renderUtil.js";
import { drawRounded, setAttributes } from "../../misc/util.js";


export default class UIComponent {
    constructor(game, attributes) {
        this.game = game;
        this.parent = null;

        // Child properties
        this.children = [];
        this.childAlignment = attributes.childAlignment ? attributes.childAlignment : "none";
        this.childDirection = attributes.childDirection ? attributes.childDirection : "row";
        this.index;

        // Position
        this.x = 0;
        this.y = 0;

        // If true, center itself on axis inside of parent. If there is no parent, center itself on screen.
        this.centerX = attributes.centerX ? attributes.centerX : false;
        this.centerY = attributes.centerY ? attributes.centerY : false;

        // Size
        this.w = attributes.width ? attributes.width : 0;
        this.h = attributes.height ? attributes.height : 0;

        this.offsetX = attributes.offsetX ? attributes.offsetX : 0;
        this.offsetY = attributes.offsetY ? attributes.offsetY : 0;

        // Position is either Relative or Absolute.
        // "Relative" positions the object in relation to its siblings,
        // "Absolute" positions the object in relation to its parent. It will ignore even spacing.
        this.position = attributes.position ? attributes.position.toUpperCase() : "RELATIVE";

        // Text
        this.text = attributes.text ? attributes.text : null;

        // Text offset
        this.textOffsetX = attributes.textOffsetX ? attributes.textOffsetX : 0;
        this.textOffsetY = attributes.textOffsetY ? attributes.textOffsetY : 0;

        // If true, center the text inside the component
        this.textCenterX = attributes.textCenterX ? attributes.textCenterX : false;
        this.textCenterY = attributes.textCenterY ? attributes.textCenterY : false;

        this.floatX = attributes.floatX ? attributes.floatX : "left";
        this.floatY = attributes.floatY ? attributes.floatY : "top";

        // If > 0, component will have rounded corners.
        this.cornerRadius = attributes.cornerRadius ? attributes.cornerRadius : 0;

        // ctx attributes for rendering component. Default values
        this.attributes = {
            lineWidth: 0,
        }

        // ctx attributes for rendering text. Default values
        this.textAttributes = {
            lineWidth: 0,
            font: null,
            textAlign:"left",
            textBaseline:"Alphabetic",
        }

        this.scrollable = false;

        // Base colors
        this.fillColor = attributes.fillColor ? attributes.fillColor : null;
        this.strokeColor = attributes.strokeColor ? attributes.strokeColor : null;

        // Text colors
        this.textFill = attributes.textFill ? attributes.textFill : null;
        this.textStroke = attributes.textStroke ? attributes.textStroke : null;
        
        if(attributes.font && attributes.fontSize) {
            this.setFont(attributes.fontSize, attributes.font);
        }

        if(attributes.textAlign) {
            this.setTextAttribute("textAlign",attributes.textAlign);
        }

        if(attributes.textBaseline) {
            this.setTextAttribute("textBaseline",attributes.textBaseline);
        }
    }

    /**
     * Set position of component
     * @param {number} x 
     * @param {number} y 
     */
    setPos(x,y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Set width and height of component
     * @param {number} width Component width
     * @param {number} height Component height
     */
    setSize(width,height) {
        this.w = width;
        this.h = height;
    }

    /**
     * Set X and Y centering of component
     * @param {boolean} x Center component on X axis;
     * @param {boolean} y Center component on Y axis;
     */
    setCentering(x,y) {
        this.centerX = x;
        this.centerY = y;
    }

    setText(text) {
        this.text = text;
    }

    setFont(size,font) {
        this.setTextAttribute("font",size + "px " + font);
    }

    setColor(fill,stroke) {
        this.fillColor = fill;
        this.strokeColor = stroke
    }

    setTextColor(fill,stroke) {
        this.textFill = fill;
        this.textStroke = stroke;
    }

    applyAttributes(attributes) {
        setAttributes(ctx,attributes);
    }

    setAttribute(attributeName,value) {
        this.attributes[attributeName] = value;
    }

    setTextAttribute(attributeName,value) {
        this.textAttributes[attributeName] = value;
    }

    alignChildren(alignment,direction) {
        this.childAlignment = alignment;
        this.childDirection = direction;
    }

    setParent(parent) {
        this.parent = parent;
    }

    setPositioning(position) {
        if(typeof position != "string") {
            return
        }
        position = position.toUpperCase();

        if(position == "RELATIVE" || position == "ABSOLUTE") {
            this.position = position;
        }
    }

    setOffset(x,y) {
        if(!isNaN(x)) 
            this.offsetX = x;

        if(!isNaN(y))
            this.offsetY = y;
    }

    addChildren(children) {
        children.forEach(child => {
            child.setIndex(this.children.length);
            child.setParent(this);
            this.children.push(child);
        });
    }

    setIndex(index) {
        this.index = index;
    }

    /**
     * Measure the text in the component
     * @returns {number} Width of text in pixels
     */
    getTextWidth() {
        ctx.font = this.attributes.font;
        return ctx.measureText(this.text).width;
    }

    /**
     * Measure the text in the component
     * @returns {number} Height of text in pixels
     */
    getTextHeight() {
        ctx.font = this.attributes.font;
        return ctx.measureText(this.text).height;
    }

    getMiddleX() {
        return this.x + this.w / 2;
    }

    getMiddleX() {
        return this.x + this.w / 2;
    }

    update() {
        this.updatePositionX();
        this.updatePositionY();
    }

    /**
     * Sets X position of component based on its positioning attributes and its parents position.
     * (Make sure top-level components are updated first every frame)
     * Yes, this code is really fucking messy. I'll try to clean it up once it's done.
     */
    updatePositionX() {
        
        if(this.parent) {
            this.x = this.parent.x;
            if(this.centerX) {
                this.x += (this.parent.w - this.w) / 2;
                return;
            }

            if(this.position == "ABSOLUTE" || this.parent.childDirection == "column") {
                if(this.floatX == "left") {this.x += this.offsetX} 
                else if(this.floatX == "right") {this.x = this.floatRight() - this.offsetX}
                return;
            }

            if(this.position == "RELATIVE") {
                if(this.parent.childDirection == "row") {
                    if(this.parent.childAlignment == "spaceEvenly") {
                        let spacing = this.parent.getChildSpacing("x");
                        this.x = this.parent.x + (spacing * (this.index + 1));
                        for(let i = 0; i < this.index; i++) {
                            if(this.parent.children[i].position == "RELATIVE") {
                                this.x += this.parent.children[i].w;
                            }
                        }
                    } 
                    
                    else {
                        for(let i = 0; i < this.index; i++) {
                            let child = this.parent.children[i];
                            if(child.position == "RELATIVE") {
                                this.x += child.w + child.offsetX;
                            }
                        }
                        this.x += this.offsetX;
                    }
                    return;
                }
            }
        } 
        
        else {
            if(this.centerX) {
                this.x = this.game.player.camera.getX() + (canvas.width - this.w) / 2;
                return;
            }
        }
    }

    /**
     * Sets Y position of component based on its positioning attributes and its parents position.
     * (Make sure top-level components are updated first every frame)
     * Yes, this code is really fucking messy. I'll try to clean it up once it's done.
     */
    updatePositionY() {
        if(this.parent) {
            this.y = this.parent.y;
            if(this.centerY) {
                this.y += (this.parent.h - this.h) / 2;
                return;
            }

            if(this.position == "ABSOLUTE") {
                if(this.floatY == "top") {
                    this.y += this.offsetY;
                } else if(this.floatY == "bottom") {
                    this.y = this.floatDown() - this.offsetY;
                }
                return;
            }

            if(this.position == "RELATIVE") {
                if(this.parent.scrollable) {
                    this.y -= this.parent.scrollDistance;
                }

                if(this.parent.childDirection == "column") {
                    for(let i = 0; i < this.index; i++) {
                        if(this.parent.children[i].position == "RELATIVE") {
                            this.y += this.parent.children[i].h;
                            if(this.parent.childAlignment == "setSpacing") {
                                this.y += this.parent.childSpacing;
                            }
                        }
                    }
                    return;
                }
            }
            /*
            else if(this.parent.childAlignment == "none" && this.parent.childDirection == "row") {
                this.y = this.parent.y + this.offsetY;
            }
            */
           
        } else {
            if(this.centerY) {
                this.y = this.game.player.camera.getY() + (canvas.height - this.h) / 2;
                return;
            }
        }
    }

    /**
     *  Calculate the remaining space of all Relative child components, and divide it evenly.
     */
    getChildSpacing(axis) {
        let spacing;
        let childCount = 0; // Only count children with RELATIVE position

        if(axis == "x") {
            spacing = this.w;
            this.children.forEach(child => {
                if(child.position == "RELATIVE") {
                    spacing -= child.w;
                    childCount += 1;
                }
            });

        } else if(axis == "y") {
            spacing = this.h;
            this.children.forEach(child => {
                if(child.position == "RELATIVE") {
                    spacing -= child.h;
                    childCount += 1;
                }
            });
        }

        spacing /= (childCount + 1);
        return spacing < 0 ? 0 : spacing;
    }

    getTotalChildHeight() {
        let totalHeight = 0;
        this.children.forEach(child => {
            if(child.position == "RELATIVE") {
                totalHeight += child.h;
            }
        });
        return totalHeight;
    }

    getTotalChildWidth() {
        let totalWidth = 0;
        this.children.forEach(child => {
            if(child.position == "RELATIVE") {
                totalWidth += child.w;
            }
        });
        return totalWidth;
    }

    floatRight() {
        if(this.parent) {
            return this.parent.x + this.parent.w - this.w;
        }
    }

    floatDown() {
        if(this.parent) {
            return this.parent.y + this.parent.h - this.h;
        }
    }

    /**
     * Wrapper for ctx.fill(). Only runs if component has a fill color.
     */
    fill() {
        if(this.fillColor) {
            ctx.fill();
        }
    }

    /**
     * Wrapper for ctx.stroke(). Only runs if component has a stroke color.
     */
    stroke() {
        if(this.strokeColor) {
            ctx.stroke();
        }
    }

    /**
     * Wrapper for ctx.fillText(). Only runs if component has a stroke color.
     */
    fillText(text,x,y) {
        if(this.textFill) {
            ctx.fillText(text,x,y);
        }
    }

    /**
     * Wrapper for ctx.strokeText(). Only runs if component has a stroke color.
     */
    strokeText(text,x,y) {
        if(this.textStroke) {
            ctx.strokeText(text,x,y);
        }
    }

    /**
     * Set the fill & stroke colors, based on the base colors (if they are set)
     * Can be overwritten by other components, to have different colors in different conditions
     */
    updateBaseColor() {
        if(this.fillColor) {
            ctx.fillStyle = rgb(this.fillColor);
        }
            
        if(this.strokeColor) {
            ctx.strokeStyle = rgb(this.strokeColor);
        }
    } 

    /**
     * Set the fill & stroke colors, based on the text colors (if they are set)
     * Can be overwritten by other components, to have different colors in different conditions
     */
    updateTextColor() {
        if(this.textFill) {
            ctx.fillStyle = rgb(this.textFill);
        }

        if(this.textStroke) {
            ctx.strokeStyle = rgb(this.textStroke);
        }
    }

    render() {
        this.renderBase();
        this.renderText();
    }

    /** 
     * Render the 'base' of the component, i.e. the basic shape.
    */
    renderBase() {
        this.applyAttributes(this.attributes);
        this.updateBaseColor();

        if(this.cornerRadius > 0) {
            renderPath(() => {
                drawRounded(this.x,this.y,this.w,this.h,this.cornerRadius,ctx);
                this.fill();
                ctx.restore();
                this.stroke();
            });
        } else {
            renderPath(() => {
                ctx.rect(this.x,this.y,this.w,this.h);
                this.fill();
                this.stroke();
            })
        }
    }

    /**
     * Render the text contained in the component
     */
    renderText() {
        this.applyAttributes(this.textAttributes);
        this.updateTextColor();

        let textX = this.x + this.textOffsetX;
        let textY = this.y + this.textOffsetY;
        
        if(this.textCenterX) {
            textX += this.w / 2;
        }

        if(this.textCenterY) {
            textY += this.h / 2;
        }

        renderPath(() => {
            this.strokeText(this.text,textX,textY);
            this.fillText(this.text,textX,textY);
        });
    }

    renderChildren() {
        this.children.forEach(child => {
            child.render();
        })
    }

    updateChildren() {
        this.children.forEach(child => {
            child.update();
        })
    }

    renderCascading() {
        this.render();
        if(this.children.length > 0) {
            this.children.forEach(child => {
                child.renderCascading();
            })
        }
    }

    updateCascading() {
        this.update();
        if(this.children.length > 0) {
            this.children.forEach(child => {
                child.updateCascading();
            })
        }
    }
}