import { ctx, canvas, TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, GRAVITY } from '../game/const.js';
import { mouse } from '../game/controls.js';
import { Inventory } from './inventory.js';
import { MiningEvent } from './mining.js';
import { calculateDistance, clamp, gridXfromCoordinate, gridYfromCoordinate } from '../misc.js';
import { HEIGHTMAP, tileGrid } from '../world/world.js';
import { getTile, getWall } from '../world/tile/tile.js';
import { overlap, surfaceCollision } from '../game/collision.js';
import { PlayerStatBar } from './statBar.js';
import { updateLighting } from '../world/lighting.js';
import { checkToolInteraction } from '../world/tile/toolInteraction.js';
import { hotbarText } from './hotbarText.js';
import { PickupLabelList } from './pickupLabels.js';


const P_WIDTH = 36;
const P_HEIGHT = 72;
const P_ACCELERATION = 0.5;
const P_MAX_DX = 5;
const P_FALLSPEED = 12;
const P_REACH = 3;

class Player {
    constructor() {
        this.w = P_WIDTH;
        this.h = P_HEIGHT;
        
        this.x;
        this.y;

        this.cameraX;
        this.cameraY;

        this.centerX;
        this.centerY;
        
        this.dx = 0;
        this.dy = 0;
        this.maxSpeed = P_MAX_DX;
        this.grounded = false;

        this.inLiquid = false;
        
        this.jumpFrames = false;

        this.health = new PlayerStatBar(50,35);
        this.hunger = new PlayerStatBar(50,20);
        this.thirst = new PlayerStatBar(50,20);

        this.pickupLabels = new PickupLabelList();

        this.walkLeft = false;
        this.walkRight = false;
        this.jump = false;

        this.inventory = new Inventory();

        this.miningEvent = null;
        
        this.defaultReach = P_REACH;
        this.reach = P_REACH * TILE_SIZE;

        this.heldItem = null;
    }

    update() {
        this.inLiquid = false;
        this.grounded = false;
        this.getHorizontalMovement();
        this.checkCollision();
        this.pickupLabels.update();

        // Gravity
        if(!this.grounded) {

            // Gravity in water
            if(this.inLiquid) {
                this.dy += GRAVITY/3;
                this.dy = clamp(this.dy,-4,4);
            } 
            
            // Gravity out of water
            else { 
                this.dy += GRAVITY;
            }
            
            // Cannot exceed max falling speed
            if(this.dy > P_FALLSPEED) {
                this.dy = P_FALLSPEED;
            }
        } 
        
        // Begin Jump
        if(this.jump && this.grounded && !this.inLiquid) {
            this.dy = -6.5;
            this.jumpFrames = 1;
        }

        // Hold jump
        if(this.jumpFrames > 0) {
            if(this.jumpFrames < 20 && this.jump) {
                this.dy = -6.5;
                this.jumpFrames++;
            } else {
                this.jumpFrames = false;
            }
        }

        // Swim
        if(this.jump && this.inLiquid) {
            this.dy -= 0.2;
        }

        // Tile Mining
        if(mouse.click && !this.inventory.view) {
            this.updateMining();
        } else {
            this.miningEvent = null;
        }

        this.updatePosition();

        if(this.inventory.view) {
            this.inventory.update();
        }
    }

    updateMining() {

        // Check if the tool can interact with the tile
        let obj = checkToolInteraction(mouse.gridX,mouse.gridY,this.heldItem);

        if(!obj) {
            this.miningEvent = null;
            return;
        }

        // If not currently mining the block, create a new Mining event
        if(!this.miningEvent) {
            this.miningEvent = new MiningEvent(obj,this.heldItem);
        }

        // If not in range of the block, cancel Mining event
        if(calculateDistance(this,this.miningEvent.tile) > this.reach) {
            this.miningEvent = null;
            return;
        }

        // If mouse has moved outside the previous block being mined, create new Event
        if(this.miningEvent.tile.gridX != mouse.gridX || 
            this.miningEvent.tile.gridY != mouse.gridY) {
                this.miningEvent = new MiningEvent(obj,this.heldItem);
        }

        // Increase mining progress.
        this.miningEvent.increaseProgress();

        if(this.miningEvent.finished) {
            updateLighting(this.gridX,this.gridY);
            this.miningEvent = null;
        }
    }
        

    getHorizontalMovement() {
        // If player is holding A, accelerate left.
        if(this.walkLeft) {
            this.dx -= P_ACCELERATION;
        }
        // If player is holding D, accelerate right.
        else if(this.walkRight) {
            this.dx += P_ACCELERATION;
        }

        // If player is not moving left but has left momentum, slow down.
        if(!this.walkLeft && this.dx < 0) {
            this.dx += 0.8;
            if(this.dx > 0) {
                this.dx = 0;
            }
        } 

        // If player is not moving right but has right momentum, slow down.
        if(!this.walkRight && this.dx > 0) {
            this.dx -= 0.8;
            if(this.dx < 0) {
                this.dx = 0;
            }
        }

        // Limit speed to max running speed
        
        this.dx = clamp(this.dx,-this.maxSpeed,this.maxSpeed);
    }

    // Move player and camera by dx and dy
    updatePosition() {
        this.x += Math.round(this.dx);
        this.y += Math.round(this.dy);
        this.cameraX += Math.round(this.dx);
        this.cameraY += Math.round(this.dy);
        this.centerX = this.x + this.w/2;
        this.centerY = this.y + this.w/2;
        this.gridX = gridXfromCoordinate(this.centerX);
        this.gridY = gridYfromCoordinate(this.centerY);
        mouse.updateGridPos();
    }

    checkCollision() {
        // Left wall
        if(this.x + this.dx < 0) {
            let distance = this.x;
            this.dx = 0;
            this.x = 0;
            this.cameraX -= distance;
        }

        // Right wall
        let rightEdge = WORLD_WIDTH * TILE_SIZE;
        if(this.x + this.w + this.dx > rightEdge) {
            let distance = this.x + this.w - rightEdge;
            this.dx = 0;
            this.x = rightEdge - this.w;
            this.cameraX -= distance;
        }

        // Only check collision of blocks within a 2 block radius
        // This is a *very* major optimization!
        for(let x=this.gridX - 2;x<this.gridX + 2;x++) {
            for(let y=this.gridY - 2;y<this.gridY + 2;y++) {
                if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
                    continue;
                }

                let tile = tileGrid[x][y];
                if(!tile) {
                    continue;
                }

                if(tile.objectType == "solid") {
                    if(surfaceCollision("top",this,tile)) {
                        this.grounded = true;
                        let distance = this.y + this.h - tile.y;
                        this.dy = 0;
                        this.y = tile.y - this.h;
                        this.cameraY -= distance;
                    }

                    if(surfaceCollision("bottom",this,tile)) {
                        let distance = this.y - (tile.y + tile.h);
                        this.dy = 0;
                        this.y = tile.y + tile.h;
                        this.cameraY -= distance;
                        this.jumpFrames = false;
                    }

                    if(surfaceCollision("left",this,tile)) {
                        let distance = this.x + this.w - tile.x;
                        this.dx = 0;
                        this.x = tile.x - this.w;
                        this.cameraX -= distance;
                    }

                    if(surfaceCollision("right",this,tile)) {
                        let distance = this.x - (tile.x + tile.w);
                        this.dx = 0;
                        this.x = tile.x + tile.w;
                        this.cameraX -= distance;
                    }
                }

                if(tile.objectType == "liquid") {
                    if(overlap(this,tile)) {
                        this.inLiquid = true;
                    }
                }
            }
        }
    }

    selectItem(slot) {
        this.inventory.selectedHotbarSlot = slot;
        let selected = this.inventory.getSelectedSlot();
        if(selected.stack) {
            hotbarText.set(selected.stack.item.displayName);

            if(selected.stack.item.reach) {
                this.reach = selected.stack.item.reach * TILE_SIZE;
            } else {
                this.reach = P_REACH * TILE_SIZE;
            }
            this.heldItem = selected.stack.item;
            this.miningEvent = null;
        } else {
            this.heldItem = null;
            this.reach = P_REACH * TILE_SIZE;
        }
    }

    draw() {
        ctx.fillStyle = "rgb(220,100,100)";
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }

    // Put the player in the center of the map
    spawn() {
        this.x = Math.round(WORLD_WIDTH / 2 * TILE_SIZE - this.w / 2);
        this.y = Math.round((-HEIGHTMAP[63] - 2) * TILE_SIZE);
        this.cameraX = Math.round(this.x - canvas.width / 2 + this.w / 2);
        this.cameraY = Math.round(this.y - canvas.height / 2 + this.h / 2);
        this.centerX = this.x + this.w/2;
        this.centerY = this.y + this.w/2;
        this.gridX = gridXfromCoordinate(this.centerX);
        this.gridY = gridYfromCoordinate(this.centerY);
        this.inventory = new Inventory();
    }
}



let player = new Player();

export { player, Player }