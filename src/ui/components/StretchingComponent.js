
import UIComponent from "./UIComponent.js";

/**
 * A component which stretches itself to fit all child components.
 * Accepts unique attributes: 
 * 'childMargin' - The distance between the children and the edge of the component.
 * 'childSpacing' - The distance between children. (requires 'setSpacing' alignment)
 */

export class StretchingComponent extends UIComponent {
    constructor(game, attributes) {
        super(game, attributes);
    }

    update() {
        this.updateHeight();
        this.updateWidth();
        this.updatePositionX();
        this.updatePositionY();
    }

    updateWidth() {
        let w = 0;
        let childCount = 0;
        if(this.childDirection == "row") {

            // Get sum of all children's width and offset
            this.children.forEach(child => {
                if(child.position == "RELATIVE") {
                    w += child.getWidth();
                    w += child.offsetX;
                    childCount += 1;
                }
            });

            // Add child spacing to the total width, if conditions are met.
            if(this.childAlignment == "setSpacing" && childCount > 1) {
                w += this.childSpacing * (childCount - 1);
            }
        } 
        
        else if(this.childDirection == "column") {

            // Find the highest child width
            this.children.forEach(child => {
                let childWidth = child.getWidth() + child.marginX;
                if(child.position == "RELATIVE" && childWidth > w) {
                    w = childWidth
                } 
            });
        }

        this.w = w + this.childMargin * 2;
    }

    updateHeight() {
        let h = 0;
        let childCount = 0;
        if(this.childDirection == "column") {

            // Get sum of all children's height and offset
            this.children.forEach(child => {
                if(child.position == "RELATIVE") {
                    h += child.getHeight();
                    h += child.offsetY;
                    childCount += 1;
                }
            });

            // Add child spacing to the total height, if conditions are met.
            if(this.childAlignment == "setSpacing" && childCount > 1) {
                h += this.childSpacing * (childCount - 1);
            }
        } 
        
        else if(this.childDirection == "row") {

            // Find the highest child height
            this.children.forEach(child => {
                let childHeight = (child.getHeight() + child.offsetY);
                if(child.position == "RELATIVE" && childHeight > h) {
                    h = childHeight;
                } 
            });
        }

        this.h = h + this.childMargin * 2;
    }
}


