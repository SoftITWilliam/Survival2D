import UIComponent from "./UIComponent.js";

/**
 * A component intended to contain a single image
 */

export class ImageComponent extends UIComponent {
    constructor(game, attributes) {
        super(game, attributes);

        this.sprite = attributes.sprite ? attributes.sprite : null;

        this.sx = attributes.sx ? attributes.sx : 0;
        this.sy = attributes.sy ? attributes.sy : 0;

        this.sw = attributes.sw ? attributes.sw : 0;
        this.sh = attributes.sh ? attributes.sh : 0;
    }

    setSprite(sprite,sx,sy,sw,sh) {
        this.sprite = sprite;
        this.sx = sx;
        this.sy = sy;
        this.sw = sw;
        this.sh = sh;
    }

    render() {

    }
}