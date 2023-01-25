import { ctx } from "../../game/global.js";
import { rgb, rgbm } from "../../game/graphics/renderUtil.js";
import { mouseOn } from "../../misc/util.js";
import UIComponent from "./UIComponent.js";


export class ClickableComponent extends UIComponent {
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
        
        // If the component is in a scrollable list, it cannot be hovered if it isn't visible.
        if(this.parent && this.parent.scrollable && !mouseOn(this.parent,input.mouse)) {
            this.hovering = false;
            return;
        }

        this.hovering = mouseOn(this,input.mouse);

        if(this.clickable && this.hovering) {
            document.body.style.cursor = "pointer";
        }
    }

    updateClick(input) {
        if(this.hovering && input.mouse.click) {
            input.mouse.click = false;
            this.onClick();
        }
    }

    /**
     *  Overwrite of default function, to have different colors when hovered.
     */ 
    updateBaseColor() {
        if(this.fillColor) {
            if(this.hovering && this.clickable) {
                ctx.fillStyle = rgbm(this.fillColor,1.3);
            } else {
                ctx.fillStyle = rgb(this.fillColor);
            }
            
        }
            
        if(this.strokeColor) {
            ctx.strokeStyle = rgb(this.strokeColor);
        }
    } 

    /**
     * Overwrite of default function, to have different colors when hovered.
     */
    updateTextColor() {
        if(this.textFill) {
            if(this.hovering && this.clickable) {
                ctx.fillStyle = rgbm(this.textFill,1.3);
            } else {
                ctx.fillStyle = rgb(this.textFill);
            }
        }

        if(this.textStroke) {
            ctx.strokeStyle = rgb(this.textStroke);
        }
    }
}