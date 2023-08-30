import { ctx } from "../../game/global.js";
import { rgb, rgbm } from "../../helper/canvashelper.js";
import UIElement from "./UIElement.js";


export class ClickableElement extends UIElement {
    constructor(game, attributes) {
        super(game, attributes);

        this.clickable = true;

        this.onClick = () => {};
        this.setOnClick(attributes.onClick);
    }

    /**
     * Set the function which should run when the button is clicked
     * @param {function} onClick 
     */
    setOnClick(onClick) {
        if(typeof onClick == "function") {
            this.onClick = onClick;
        }
    }

    /**
     * Set whether or not the button is able to be clicked at the current time.
     * (Note: Clickable being false also disables hover effects)
     * @param {boolean} clickable 
     */
    setClickable(clickable) {
        if(typeof clickable == "boolean") {
            this.clickable = clickable;
        }
    }

    update() {
        this.updatePositionX();
        this.updatePositionY();
        this.updateHover(this.game.input);
        this.updateClick(this.game.input);
    }

    updateHover(input) {
        
        // If the element is in a scrollable list, it cannot be hovered if it isn't visible.
        if(this.parent && this.parent.scrollable && !input.mouse.on(this.parent)) {
            this.hovering = false;
            return;
        }

        this.hovering = input.mouse.on(this);

        if(this.clickable && this.hovering) {
            document.body.style.cursor = "pointer";
        }
    }

    updateClick(input) {
        if(this.clickable && this.hovering && input.mouse.click) {
            input.mouse.click = false;
            this.onClick();
        }
    }

    /**
     *  Overwrite of default function, to have different colors when hovered.
     */ 
    updateColor(fillColor, strokeColor) {
        if(fillColor) {
            ctx.fillStyle = 
                !this.clickable ? rgbm(fillColor, 0.7) :
                this.hovering ? rgbm(fillColor, 1.3) : 
                rgb(fillColor);
        }
            
        if(strokeColor) {
            ctx.strokeStyle = rgb(strokeColor);
        }
    } 
}