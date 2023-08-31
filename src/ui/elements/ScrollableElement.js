
import { ctx } from "../../game/global.js";
import { clamp } from "../../helper/helper.js";
import UIElement from "./UIElement.js";

/**
 * An eleemnt whose children are scrollable. 
 * Accepts unique attribute 'childSpacing',a hard-coded gap size between all child elements
 */
export class ScrollableElement extends UIElement {
    constructor(game, attributes) {
        super(game, attributes);
        this.scrollable = true;
        this.childSpacing = attributes.childSpacing ? attributes.childSpacing : 0;
        this.scrollDistance = 0;
        this.scrollableHeight = 0;
        this.scrollbarWidth = 20;
        this.scrollDirection = "column";
        this.alignChildren("setSpacing","column");
    }

    update() {
        this.updatePositionX();
        this.updatePositionY();
        this.updateScroll(this.game.input);
    }
    
    updateScroll(input) {
        if(input.mouse.on(this) && input.scroll) {
            this.scrollDistance = clamp(this.scrollDistance + (Math.round(input.scroll / 3)), 0, this.scrollableHeight - this.h);
            input.scroll = 0;
        }
    }

    // Calculate the total height that can be scrolled,
    updateScrollableHeight() {
        this.scrollableHeight = 0;
        let childCount = 0;

        // Add the height and Y offset of all relative-positioned children to the total height
        this.children.forEach(child => {
            if(child.position == "RELATIVE") {
                this.scrollableHeight += child.h;
                if(!isNaN(child.offsetY)) {
                    this.scrollableHeight += child.offsetY;
                }
                
                childCount += 1;
            }
        });

        // Add child spacing to the total height, if conditions are met.
        if(this.childAlignment == "setSpacing" && childCount > 1) {
            this.scrollableHeight += this.childSpacing * (childCount - 1);
        }
    }

    // Override default function
    render() {
        ctx.save();
        ctx.rect(this.x, this.y, this.w, this.h);
        this.fill();
        ctx.clip();
        this.children.forEach(child => {
            child.recursiveRender();
        })
        this.renderScrollbar();
        ctx.restore();
        this.stroke();
    }

    refreshScrollbar() {
        this.trackWidth = 20;
        this.thumbWidth = 12;
        this.trackPadding = (this.trackWidth - this.thumbWidth) / 2;
        this.trackX = this.w - this.trackWidth;
        this.trackHeight = this.h - (this.trackPadding * 2);

        if(this.scrollableHeight <= this.h) {
            this.thumbHeight = this.trackHeight;
        } else {
            this.thumbHeight = this.h * (this.h / this.scrollableHeight);
        }
    }

    renderScrollbar() {

        let thumbY = Math.floor((this.trackHeight - this.thumbHeight) * this.scrollDistance / (this.scrollableHeight - this.h));

        // Draw Track
        ctx.fillStyle = "rgb(127,127,127)";
        ctx.fillRect(this.x + this.trackX, this.y, this.trackWidth, this.trackHeight + this.trackPadding * 2);

        // Draw Thumb
        ctx.fillStyle = "rgb(63,63,63)";
        ctx.fillRect(this.x + this.trackX + this.trackPadding, this.y + this.trackPadding + thumbY, this.thumbWidth, this.thumbHeight);
    }

    // Override default function
    recursiveRender() {
        this.render();
    }
}