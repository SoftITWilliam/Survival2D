import { getIfSet, gridXfromCoordinate, gridYfromCoordinate } from "../misc/util.js";

export default class GameObject {
    constructor(game,x,y,w,h) {
        this.game = game;

        this.x = getIfSet(x, 0);
        this.y = getIfSet(y, 0);

        this.w = getIfSet(w, 0);
        this.h = getIfSet(h, 0);

        this.updateCenterPos();
        this.updateGridPos();
    }

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
