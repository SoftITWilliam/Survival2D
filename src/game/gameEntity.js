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

    move(m, deltaX, deltaY) {
        this.x += Math.round(deltaX * m);
        this.y += Math.round(deltaY * m);
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
            this.x = rightEdge - this.getWidth();
        }
    }

    // Runs when colliding with the top side of a solid tile
    onTopCollision(tile) {
        this.grounded = true;
        this.dy = 0;
        this.y = tile.getY() - this.h;
    }

    // Runs when colliding with the bottom side of a solid tile
    onBottomCollision(tile) {
        this.dy = 0;
        this.y = tile.getY() + tile.getHeight()
    }

    // Runs when colliding with the left side of a solid tile
    onLeftCollision(tile) {
        this.dx = 0;
        this.x = tile.getX() - this.getWidth();
    }

    // Runs when colliding with the right side of a solid tile
    onRightCollision(tile) {
        this.dx = 0;
        this.x = tile.getX() + tile.getWidth();
    }

    // Check collision of tiles within a 2 block radius
    tileCollision() {
        for(let x = this.getGridX() - 2; x < this.getGridX() + 2; x++) {
            for(let y = this.getGridY() - 2; y < this.getGridY() + 2; y++) {
                if(this.game.world.outOfBounds(x,y)) {
                    continue;
                }

                let tile = this.game.world.tileGrid[x][y];
                if(!tile) {
                    continue;
                }

                if(tile.getType() == "solid") {
                    if(surfaceCollision("top", this, tile)) {
                        this.onTopCollision(tile);
                    }

                    if(surfaceCollision("bottom", this, tile)) {
                        this.onBottomCollision(tile);
                    }

                    if(surfaceCollision("left", this, tile)) {
                        this.onLeftCollision(tile);
                    }

                    if(surfaceCollision("right", this, tile)) {
                        this.onRightCollision(tile);
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