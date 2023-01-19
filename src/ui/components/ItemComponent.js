import { renderItem } from "../../game/graphics/renderUtil.js";
import { ImageComponent } from "./ImageComponent.js";

/**
 * UI component representing an item.
 */

export class ItemComponent extends ImageComponent {
    constructor(game, attributes) {
        super(game, attributes);

        this.item = attributes.item ? attributes.item : null;
    }

    setItem(item) {
        this.item = item;
    }

    render() {
        if(this.item) {
            renderItem(this.item,this.x,this.y,this.w,this.h);
        }
    }
}