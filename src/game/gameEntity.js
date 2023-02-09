import { surfaceCollision } from './collision.js';
import GameObject from './gameObject.js';
import { TILE_SIZE } from './global.js';

export default class GameEntity extends GameObject {
    constructor(game,x,y,w,h) {
        super(game,x,y,w,h);
        this.dx = 0;
        this.dy = 0;
        this.grounded = false;
        this.gravity = 0.35;
    }

    move(deltaX, deltaY) {
        this.x += Math.round(deltaX);
        this.y += Math.round(deltaY);
        this.updateCenterPos();
        this.updateGridPos();
    }

    updateCollision() {
        this.worldEdgeCollision();
        this.tileCollision();
    }

    worldEdgeCollision() {
        // Left edge
        if(this.getX() + this.dx < 0) {
            this.dx = 0;
            this.x = 0;
        }

        // Right edge
        let rightEdge = this.game.world.width * TILE_SIZE;
        if(this.getX() + this.getWidth() + this.dx > rightEdge) {
            this.dx = 0;
            this.x = rightEdge - this.w;
        }
    }

    // Check collision of tiles within a 2 block radius
    tileCollision() {
        for(let x=this.getGridX() - 2;x<this.gridX + 2;x++) {
            for(let y=this.gridY - 2;y<this.gridY + 2;y++) {
                if(this.game.world.outOfBounds(x,y)) {
                    continue;
                }

                let tile = this.game.world.tileGrid[x][y];
                if(!tile) {
                    continue;
                }

                if(tile.getType() == "solid") {
                    if(surfaceCollision("top",this,tile)) {
                        this.grounded = true;
                        this.dy = 0;
                        this.y = tile.getY() - this.h;
                    }

                    if(surfaceCollision("bottom",this,tile)) {
                        this.dy = 0;
                        this.y = tile.getY() + tile.getHeight()
                    }

                    if(surfaceCollision("left",this,tile)) {
                        this.dx = 0;
                        this.x = tile.getX() - this.getWidth();
                    }

                    if(surfaceCollision("right",this,tile)) {
                        this.dx = 0;
                        this.x = tile.getX() + tile.getWidth();
                    }
                }

                if(tile.getType() == "liquid") {
                    if(overlap(this,tile)) {
                        this.inLiquid = true;
                    }
                }
            }
        }
    }
}