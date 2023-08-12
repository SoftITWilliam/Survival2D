import { surfaceCollision } from './collision.js';
import GameObject from './gameObject.js';
import { TILE_SIZE } from './global.js';

export default class GameEntity extends GameObject {
    constructor(game, x, y, w, h) {
        super(game, x, y, w, h);
        this.dx = 0;
        this.dy = 0;
        this.grounded = false;
        this.gravity = 0.35;
    }

    move(m, deltaX, deltaY) {
        this._x += deltaX * m;
        this._y += deltaY * m;
    }

    get vector() {
        return { dx: this.dx, dy: this.dy }
    }

    set vector(vector) {
        if(vector.dx === undefined || vector.dy === undefined) return;
        this.dx = vector.dx ?? 0;
        this.dy = vector.dy ?? 0;
    }
    
    updateCollision() {
        this.worldEdgeCollision();
        this.tileCollision();
    }

    worldEdgeCollision() {
        // Left edge
        if(this.x + this.dx < 0) {
            this.dx = 0;
            this.x = 0;
        }

        // Right edge
        let rightEdge = this.game.world.width * TILE_SIZE;
        if(this.x2 + this.dx > rightEdge) {
            this.dx = 0;
            this.x = rightEdge - this.width;
        }
    }

    // Runs when colliding with the top side of a solid tile
    onTopCollision(tile) {
        this.grounded = true;
        this.dy = 0;
        this.y = tile.y - this.h;
    }

    // Runs when colliding with the bottom side of a solid tile
    onBottomCollision(tile) {
        this.dy = 0;
        this.y = tile.y2;
    }

    // Runs when colliding with the left side of a solid tile
    onLeftCollision(tile) {
        this.dx = 0;
        this.x = tile.x - this.width;
    }

    // Runs when colliding with the right side of a solid tile
    onRightCollision(tile) {
        this.dx = 0;
        this.x = tile.x2;
    }

    // Check collision of tiles within a 2 block radius
    tileCollision() {
        for(let x = this.gridX - 2; x < this.gridX + 2; x++) {
            for(let y = this.gridY - 2; y < this.gridY + 2; y++) {
                if(this.game.world.outOfBounds(x, y)) continue;

                let tile = this.game.world.tileGrid[x][y];
                if(!tile) continue;

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
                    if(overlap(this, tile)) {
                        this.inLiquid = true;
                    }
                }
            }
        }
    }
}