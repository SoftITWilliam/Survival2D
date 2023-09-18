import { surfaceCollision } from "../helper/collisionhelper.js";
import { TILE_SIZE } from "../game/global.js";
import { dropItemFromTile } from "../item/dropItem.js";
import { Tile } from "../tile/Tile.js";
import { PositionComponent } from "./positionComponent.js";
import { getPhysicsMultiplier, objectHasProperties, validNumbers } from "../helper/helper.js";

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
     * @typedef {object} Vector
     * @property {number} dx Delta X
     * @property {number} dy Delta Y
     */

    /**
     * Update position based on deltaX, deltaY, and deltaTime
     * @overload
     * @param {number} deltaX 
     * @param {number} deltaY 
     * @param {number} deltaTime Time since last frame (ms)
     */
    /**
     * Update position based on {@link Vector} object
     * @overload
     * @param {Vector} vector 
     * @param {number} deltaTime 
     */
    move(arg1, arg2, arg3) {

        var moveFn = (dx, dy, dt) => {
            let m = getPhysicsMultiplier(dt);
            this._x += dx * m;
            this._y += dy * m;
        }

        if(typeof arg1 === "object" && typeof arg2 === "number") {
            moveFn(arg1.dx, arg1.dy, arg2);
        } 
        else if(validNumbers(arg1, arg2, arg3)) {
            moveFn(arg1, arg2, arg3);
        }
        // Do nothing if args are invalid
    }

    get vector() {
        return { dx: this.dx, dy: this.dy }
    }

    set vector(vector) {
        if(objectHasProperties(vector, "dx", "dy")) {
            this.dx = vector.dx ?? 0;
            this.dy = vector.dy ?? 0;
        }
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