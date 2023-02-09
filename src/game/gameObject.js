import { getIfSet } from "../misc/util";

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
        return this.x 
    }

    getY() { 
        return this.y 
    }
    
    getWidth() { 
        return this.w 
    }

    getHeight() { 
        return this.h 
    }

    getCenterX() { 
        return this.centerX 
    }

    getCenterY() { 
        return this.centerY 
    }

    updateCenterPos() {
        this.centerX = this.x + (this.w / 2);
        this.centerY = this.y + (this.y / 2);
    }

    updateGridPos() {
        this.gridX = gridXfromCoordinate(this.centerX);
        this.gridY = gridYfromCoordinate(this.centerY);
    }

    move(deltaX, deltaY) {
        this.x += Math.round(deltaX);
        this.y += Math.round(deltaX);
        this.updateCenterPos();
        this.updateGridPos();
    }
}
