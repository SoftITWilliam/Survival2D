import { overlap, surfaceCollision } from "../game/collision.js";
import { TILE_SIZE } from "../game/global.js";
import { dropItemFromTile } from "../item/dropItem.js";
import { Tile } from "../tile/Tile.js";
import { PositionComponent } from "./positionComponent.js";

export class EntityComponent extends PositionComponent {
    constructor(x = 0, y = 0, width = 0, height = null) {
        super(x, y, width, height ?? width);
        this.dx = 0;
        this.dy = 0;
        this.grounded = false;
        this.gravity = 0.35;

        // Callbacks for customizing behaviour in classes using this component
        this.onTopCollision = (tile) => { }
        this.onBottomCollision = (tile) => { }
        this.onLeftCollision = (tile) => { }
        this.onRightCollision = (tile) => { }
    }

    /**
     * Update position based on deltaX and deltaY.
     * Also accepts vector in 'deltaX' param
     * @param {*} multiplier 
     * @param {*} deltaX 
     * @param {*} deltaY 
     */
    move(multiplier, deltaX, deltaY) {
        if(typeof deltaX == "object") {
            let vector = deltaX;
            this._x += vector.dx * multiplier;
            this._y += vector.dy * multiplier;
        } else {
            this._x += deltaX * multiplier;
            this._y += deltaY * multiplier;
        }
    }

    get vector() {
        return { dx: this.dx, dy: this.dy }
    }

    set vector(vector) {
        if(vector.dx === undefined || vector.dy === undefined) return;
        this.dx = vector.dx ?? 0;
        this.dy = vector.dy ?? 0;
    }

    updateCollision(world) {
        this.#worldEdgeCollision(world);
        this.#tileCollision(world);
    }

    #worldEdgeCollision(world) {
        // Left edge
        if(this.x + this.dx < 0) {
            this.dx = 0;
            this.x = 0;
        }

        // Right edge
        let rightEdge = world.width * TILE_SIZE;
        if(this.x2 + this.dx > rightEdge) {
            this.dx = 0;
            this.x = rightEdge - this.width;
        }
    }

    // Runs when colliding with the top side of a solid tile
    topCollision(tile) {
        this.grounded = true;
        this.dy = 0;
        this.y = tile.y - this.height;
        this.onTopCollision(tile);
    }

    // Runs when colliding with the bottom side of a solid tile
    bottomCollision(tile) {
        this.dy = 0;
        this.y = tile.y2;
        this.onBottomCollision(tile);
    }

    // Runs when colliding with the left side of a solid tile
    leftCollision(tile) {
        this.dx = 0;
        this.x = tile.x - this.width;
        this.onLeftCollision(tile);
    }

    // Runs when colliding with the right side of a solid tile
    rightCollision(tile) {
        this.dx = 0;
        this.x = tile.x2;
        this.onRightCollision(dropItemFromTile);
    }

    // Check collision of tiles within a 2 block radius
    #tileCollision(world) {
        let tiles = world.getTilesInRange(this.gridX, this.gridY, 2);

        tiles.forEach(tile => {
            if(tile.type == Tile.types.SOLID) {
                if(surfaceCollision("top", this, tile)) {
                    this.topCollision(tile);
                }

                if(surfaceCollision("bottom", this, tile)) {
                    this.bottomCollision(tile);
                }

                if(surfaceCollision("left", this, tile)) {
                    this.leftCollision(tile);
                }

                if(surfaceCollision("right", this, tile)) {
                    this.rightCollision(tile);
                }
            }

            /*
            if(tile.type == Tile.types.LIQUID) {
                if(overlap(this, tile)) {
                    this.inLiquid = true;
                }
            }
            */
        })
    }
}