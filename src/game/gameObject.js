import { gridXfromCoordinate, gridYfromCoordinate } from "../misc/util.js";

/**
 * @classdesc Represents any object in the game which has a size and position
 */
export default class GameObject {
    constructor(game, x = 0, y = 0, w = 0, h = 0) {
        this.game = game;
        this._x = x;
        this._y = y;
        this.w = w;
        this.h = h;

        this._gridX; this._gridY;
    }

    get x() { return Math.round(this._x) }
    set x(value) { this._x = value }

    get x2() { return this.x + this.width }
    set x2(value) { this._x = value - this.width }

    get y() { return Math.round(this._y) }
    set y(value) { this._y = value }

    get y2() { return this.y + this.height }
    set y2(value) { this._y = value - this.height }

    get centerX() { return this.x + (this.width / 2) }
    set centerX(value) { this._x = value - (this.width / 2) }
    
    get centerY() { return this.y + (this.height / 2) }
    set centerY(value) { this._y = value - (this.height / 2) }

    get gridX() { return this._gridX ?? gridXfromCoordinate(this.centerX) }
    get gridY() { return this._gridX ?? gridYfromCoordinate(this.centerY) }

    get width() { return this.w }
    set width(value) { this.w = value }

    get height() { return this.h }  
    set height(value ) { this.h = value }
}
