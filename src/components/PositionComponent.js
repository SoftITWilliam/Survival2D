import { gridXfromCoordinate, gridYfromCoordinate } from "../misc/util.js";

/*
    DEFAULT WRAPPERS

    get x() { return this._pos.x }
    set x(value) { this._pos.x = value }

    get x2() { return this._pos.x2 }
    set x2(value) { this._pos.x2 = value }

    get y() { return this._pos.y }
    set y(value) { this._pos.y = value }

    get y2() { return this._pos.y2 }
    set y2(value) { this._pos.y2 = value }

    get centerX() { return this._pos.centerX }
    set centerX(value) { this._pos.centerX = value }

    get centerY() { return this._pos.centerY }
    set centerY(value) { this._pos.centerY = value }

    get gridX() { return this._pos.gridX }
    get gridY() { return this._pos.gridY }

    get width() { return this._pos.width }
    set width(value) { this._pos.width = value }

    get height() { return this._pos.height }  
    set height(value ) { this._pos.height = value }
*/

export class PositionComponent {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this._x = x;
        this._y = y;
        this._w = width;
        this._h = height;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
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

    get width() { return this._w }
    set width(value) { this._w = value }

    get height() { return this._h }  
    set height(value ) { this._h = value }
}