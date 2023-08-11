import { getIfSet, gridXfromCoordinate, gridYfromCoordinate } from "../misc/util.js";

export default class GameObject {
    constructor(game, x = 0, y = 0, w = 0, h = 0) {
        this.game = game;

        this._x = x;
        this._y = y;

        this.w = w;
        this.h = h;

        this.updateCenterPos();
        this.updateGridPos();
    }

    get x() { return Math.round(this._x) }
    set x(value) { this._x = value }
    
    get y() { return Math.round(this._y) }
    set y(value) { this._y = value }

    getX() { 
        return this.x;
    }

    getY() { 
        return this.y;
    }

    getGridX() {
        return this.gridX;
    }

    getGridY() {
        return this.gridY;
    }

    getCenterX() { 
        return this.centerX;
    }

    getCenterY() { 
        return this.centerY;
    }

    getWidth() { 
        return this.w;
    }

    getHeight() { 
        return this.h;
    }
    
    updateCenterPos() {
        this.centerX = this.getX() + (this.getWidth() / 2);
        this.centerY = this.getY() + (this.getHeight() / 2);
    }

    updateGridPos() {
        this.gridX = gridXfromCoordinate(this.centerX);
        this.gridY = gridYfromCoordinate(this.centerY);
    }
}
