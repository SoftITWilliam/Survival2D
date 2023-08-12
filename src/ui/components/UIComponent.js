import { canvas, ctx } from "../../game/global.js";
import { renderPath, rgb } from "../../game/graphics/renderUtil.js";
import { drawRounded, getIfSet, setAttributes } from "../../misc/util.js";


export default class UIComponent {
    constructor(game, attributes) {
        this.game = game;
        this.parent = null;

        // Child properties
        this.children = [];
        this.childAlignment = attributes.childAlignment ?? "none";
        this.childDirection = attributes.childDirection ?? "row";
        this.index;

        // Position
        this._x = 0;
        this._y = 0;

        // If true, center itself on axis inside of parent. If there is no parent, center itself on screen.
        this.centerX = attributes.centerX ?? false;
        this.centerY = attributes.centerY ?? false;

        // Size
        this.w = attributes.width ?? 0;
        this.h = attributes.height ?? 0;

        this.offsetX = attributes.offsetX ?? 0;
        this.offsetY = attributes.offsetY ?? 0;

        // Position is either Relative or Absolute.
        // "Relative" positions the object in relation to its siblings,
        // "Absolute" positions the object in relation to its parent. It will ignore even spacing.
        this.position = attributes.position ?? "RELATIVE";

        // Text
        this.text = attributes.text ?? "";

        // Text offset
        this.textOffsetX = attributes.textOffsetX ?? 0;
        this.textOffsetY = attributes.textOffsetY ?? 0;

        // If true, center the text inside the component
        this.textCenterX = attributes.textCenterX ?? false;
        this.textCenterY = attributes.textCenterY ?? false;

        this.floatX = attributes.floatX ?? "left";
        this.floatY = attributes.floatY ?? "top";

        // If > 0, component will have rounded corners.
        this.cornerRadius = attributes.cornerRadius ?? 0;

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
        this.childMargin = attributes.childMargin ?? 0;
        this.childSpacing = attributes.childSpacing ?? 0;

        // Base colors
        this.fillColor = attributes.fillColor ?? null;
        this.strokeColor = attributes.strokeColor ?? null;

        // Text colors
        this.textFill = attributes.textFill ?? null;
        this.textStroke = attributes.textStroke ?? null;
        
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

    get x() { return this._x }
    set x(value) { if(typeof value == "number") this._x = value }

    get y() { return this._y }
    set y(value) { if(typeof value == "number") this._y = value }

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

    get width() { return this.w }
    get height() { return this.h }

    /**
     * Measure the text in the component
     * @returns {number} Width of text in pixels
     */
    getTextWidth() {
        ctx.font = this.textAttributes.font;
        return ctx.measureText(this.text).width;
    }

    /**
     * Measure the text in the component
     * @returns {number} Height of text in pixels
     */
    getTextHeight() {
        ctx.font = this.textAttributes.font;
        return ctx.measureText(this.text).height;
    }

    getMiddleX() {
        return this.x + this.width / 2;
    }

    getMiddleY() {
        return this.y + this.height / 2;
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

        if(!this.parent) {
            if(this.centerX) {
                this.x = this.game.player.camera.x + (canvas.width - this.w) / 2;
            }
            return;
        }
        
        this.x = this.parent.x;
        if(this.centerX) {
            this.x += (this.parent.w - this.w) / 2;
            return;
        }

        if(this.position == "ABSOLUTE" || this.parent.childDirection == "column") {
            if(this.floatX == "left") {
                this.x += this.offsetX
            } else if(this.floatX == "right") {
                this.x = this.floatRight() - this.offsetX
            }
            return;
        }

        if(this.position == "RELATIVE") {
            let sibling = this.getRelative();

            if(this.parent.childAlignment == "setSpacing") {

                if(sibling) {
                    let distance = sibling.width + this.offsetX + this.parent.childSpacing;
                    this.x = (this.floatX == "left") ? sibling.x + distance : sibling.x - distance;
                } else {
                    if(this.floatX == "left") {
                        this.x += this.offsetX + this.parent.childMargin; 
                    } else {
                        this.x = this.floatRight() - this.offsetX - this.parent.childMargin;
                    }
                }

                return;
            }

            if(this.parent.childAlignment == "spaceEvenly") {
                let spacing = this.parent.getChildSpacing("x");
                this.x = this.parent.x + (spacing * (this.index + 1));
                for(let i = 0; i < this.index; i++) {
                    if(this.parent.children[i].position == "RELATIVE") {
                        this.x += this.parent.children[i].width;
                    }
                }
            } 
            
            else {
                for(let i = 0; i < this.index; i++) {
                    let child = this.parent.children[i];
                    if(child.position == "RELATIVE") {
                        this.x += child.width + child.offsetX;
                    }
                }
                this.x += this.offsetX;
            }
        }
    }

    /**
     * Sets Y position of component based on its positioning attributes and its parents position.
     * (Make sure top-level components are updated first every frame)
     * Yes, this code is really fucking messy. I'll try to clean it up once it's done.
     */
    updatePositionY() {

        const getRelativeSum = () => {
            let sum = 0;
            for(let i = 0; i < this.index; i++) {
                if(this.parent.children[i].position == "RELATIVE") {
                    sum += this.parent.children[i].h;
                }
            }
            return sum;
        }

        const getRelativeCount = () => {
            let count = 0;
            for(let i = 0; i < this.index; i++) {
                if(this.parent.children[i].position == "RELATIVE") {
                    count++;
                }
            }
            return childCount;
        }

        if(!this.parent) {
            if(this.centerY) {
                this.y = this.game.player.camera.getY() + (canvas.height - this.h) / 2;
            }
            return;
        }

        this.y = this.parent.y;
        if(this.centerY) {
            this.y += (this.parent.h - this.h) / 2;
            return;
        }

        if(this.position == "ABSOLUTE" || this.parent.childDirection == "row") {
            if(this.floatY == "top") {
                this.y += this.offsetY + this.parent.childMargin;
            } else if(this.floatY == "bottom") {
                this.y = this.floatDown() - this.offsetY - this.parent.childMargin;
            }
            return;
        }

        if(this.position == "RELATIVE") {
            let sibling = this.getRelative();
            let scrolldist = this.parent.scrollable ? this.parent.scrollDistance : 0;

            if(this.parent.childAlignment == "setSpacing") {
                if(sibling) {
                    let distance = sibling.height + this.offsetY + this.parent.childSpacing;
                    this.y = (this.floatY == "top") ? sibling.y + distance : sibling.y - distance;
                } else {
                    if(this.floatY == "top") {
                        this.y += this.offsetY + this.parent.childMargin; 
                        this.y -= scrolldist;
                    } else {
                        this.y = this.floatDown() - this.offsetY - this.parent.childMargin;
                        this.y -= scrolldist;
                    }
                }
                return;
            }

            if(this.parent.childAlignment == "spaceEvenly") {
                return;
            }

            else {
                if(this.floatY == "top") {
                    for(let i = 0; i < this.index; i++) {
                        if(this.parent.children[i].position == "RELATIVE") {
                            this.y += this.parent.children[i].h;
                            if(this.parent.childAlignment == "setSpacing") {
                                this.y += this.parent.childSpacing;
                            }
                        }
                    }
                    this.y -= scrolldist;
                } else if(this.floatY == "bottom") {
                    this.y = this.floatDown();
                    for(let i = 0; i < this.index; i++) {
                        let child = this.parent.children[i];
                        if(child.position == "RELATIVE" && child.floatY == this.floatY) {
                            this.y -= child.h;
                        }
                    }
                }
            }
            return;
        }
    }

    /**
     * Return the adjacent 'sibling' component.
     */
    getRelative() {
        for(let i = this.index - 1; i >= 0; i--) {
            let sibling = this.parent.children[i];
            if(sibling.position != "RELATIVE") {
                continue;
            }

            if(this.parent.childDirection == "row" && sibling.floatX != this.floatX) {
                continue;
            }

            if(this.parent.childDirection == "column" && sibling.floatY != this.floatY) {
                continue;
            }

            return sibling;
        }

        return null;
    }

    /**
     *  Calculate the remaining space of all Relative child components, and divide it evenly.
     */
    getChildSpacing(axis) {
        let spacing;
        let childCount = 0; // Only count children with RELATIVE position

        if(axis == "x") {
            spacing = this.width;
            this.children.forEach(child => {
                if(child.position == "RELATIVE") {
                    spacing -= child.width;
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
                totalWidth += child.width;
            }
        });
        return totalWidth;
    }

    floatRight() {
        if(this.parent) {
            return this.parent.x + this.parent.width - this.width;
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
     * Set the fill & stroke colors (if they are set)
     * Can be overwritten by other components, to have different colors in different conditions (ex. when hovered)
     */
    updateColor(fillColor, strokeColor) {
        if(fillColor) {
            ctx.fillStyle = rgb(fillColor);
        }
            
        if(strokeColor) {
            ctx.strokeStyle = rgb(strokeColor);
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
        this.updateColor(this.fillColor,this.strokeColor);

        if(this.cornerRadius > 0) {
            renderPath(() => {
                drawRounded(Math.round(this.x),Math.round(this.y),this.w,this.h,this.cornerRadius,ctx);
                this.fill();
                ctx.restore();
                this.stroke();
            });
        } else {
            renderPath(() => {
                ctx.rect(Math.round(this.x),Math.round(this.y),this.w,this.h);
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
        this.updateColor(this.textFill,this.textStroke);

        let textX = Math.round(this.x) + this.textOffsetX;
        let textY = Math.round(this.y) + this.textOffsetY;
        
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