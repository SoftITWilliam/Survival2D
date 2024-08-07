import { Collision } from "../misc/Collision.js";
import { TILE_SIZE } from "../game/global.js";
import { Tile } from "../tile/Tile.js";
import { PositionComponent } from "./positionComponent.js";
import { getPhysicsMultiplier, objectHasProperties, validNumbers } from "../helper/helper.js";
import { Observable } from "../class/Observable.js";

export class EntityComponent extends PositionComponent {
    dx = 0;
    dy = 0;
    grounded = false;
    gravity = 0.35;

    // Observables for customizing behaviour in classes using this component
    topCollisionSubject = new Observable();
    bottomCollisionSubject = new Observable();
    leftCollisionSubject = new Observable();
    rightCollisionSubject = new Observable();

    constructor(x = 0, y = 0, width = 0, height = null) {
        super(x, y, width, height ?? width);
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
        const velocity = this.dy;
        this.grounded = true;
        this.dy = 0;
        this.y = tile.y - this.height;
        if(velocity !== 0) {
            this.topCollisionSubject.notify({ tile, velocity });
        }
    }

    // Runs when colliding with the bottom side of a solid tile
    bottomCollision(tile) {
        const velocity = this.dy;
        this.dy = 0;
        this.y = tile.y2;
        if(velocity !== 0) {
            this.bottomCollisionSubject.notify({ tile, velocity });
        }
    }

    // Runs when colliding with the left side of a solid tile
    leftCollision(tile) {
        const velocity = this.dx;
        this.dx = 0;
        this.x = tile.x - this.width;
        if(velocity !== 0) {
            this.leftCollisionSubject.notify({ tile, velocity });
        }
    }

    // Runs when colliding with the right side of a solid tile
    rightCollision(tile) {
        const velocity = this.dx;
        this.dx = 0;
        this.x = tile.x2;
        if(velocity !== 0) {
            this.rightCollisionSubject.notify({ tile, velocity });
        }
    }

    // Check collision of tiles within a 2 block radius
    #tileCollision(world) {
        let tiles = world.getTilesInRange(this.gridX, this.gridY, 2);

        tiles.forEach(tile => {
            if(tile.type == Tile.types.SOLID) {
                if(Collision.topSurface(this, tile)) {
                    this.topCollision(tile);
                }

                if(Collision.bottomSurface(this, tile)) {
                    this.bottomCollision(tile);
                }

                if(Collision.leftSurface(this, tile)) {
                    this.leftCollision(tile);
                }

                if(Collision.rightSurface(this, tile)) {
                    this.rightCollision(tile);
                }
            }
        })
    }
}