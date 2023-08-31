import { ctx, TILE_SIZE } from '../game/global.js';
import { Inventory } from '../ui/inventory.js';
import MiningAction from './mining.js';
import { HEIGHTMAP } from '../world/World.js';
import { overlap } from '../game/collision.js';
import { PlayerStatBar } from './statBar.js';
import HotbarText from '../ui/hotbarText.js';
import { PickupLabelHandler } from '../ui/pickupLabels.js';
import PlayerCamera from './camera.js';
import ItemInfoDisplay from '../ui/itemInfo.js';
import { PlayerFalling, PlayerJumping, PlayerRunning, PlayerStanding, PlayerSwimming, stateEnum } from './playerStates.js';
import { sprites } from '../game/graphics/loadAssets.js';
import CraftingMenu from '../crafting/Crafting.js';
import { TileInstance } from '../tile/tileInstance.js';
import { FrameAnimation } from '../game/graphics/animation.js';
import { ItemRegistry } from '../item/itemRegistry.js';
import { EntityComponent } from '../components/EntityComponent.js';
import { calculateDistance, clamp } from '../helper/helper.js';

const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 72;

class Player {
    constructor(game) {
        this.game = game;
        this.world = game.world;

        this._entity = new EntityComponent();

        this.stateList = [
            new PlayerStanding(this), 
            new PlayerRunning(this), 
            new PlayerJumping(this),
            new PlayerFalling(this), 
            new PlayerSwimming(this)
        ];

        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;

        this.facing = "right";

        this.maxSpeed = 5;
        this.maxFallSpeed = 12;
        this.acceleration = 0.5;

        this.inLiquid = false;
        
        this.jumpFrames = false;

        this.health = new PlayerStatBar(50, 45);
        this.hunger = new PlayerStatBar(50, 20);
        this.thirst = new PlayerStatBar(50, 20);

        this.pickupLabels = new PickupLabelHandler(this);
        this.hotbarText = new HotbarText(this); 
        this.itemInfoDisplay = new ItemInfoDisplay(this);
        this.camera = new PlayerCamera(this);
        this.craftingMenu = new CraftingMenu(this);

        this.miningAction = null;
        
        this.defaultReach = 3;
        this.reach = 3 * TILE_SIZE;

        this.heldItem = null;

        this.cheetahFrames = 0;

        // Sprite and Animation variables
        this.spriteSheet = sprites.entities.player;
        this.frameY = 0;
        this.animation = new FrameAnimation();
        this.frameWidth = 96;

        this._entity.onBottomCollision = () => {
            this.setState("FALLING");
        }
    }

    // Component wrappers
    get x() { return this._entity.x }
    set x(value) { this._entity.x = value }

    get y() { return this._entity.y }
    set y(value) { this._entity.y = value }
    
    get x2() { return this._entity.x2 }
    get y2() { return this._entity.y2 }

    get centerX() { return this._entity.centerX }
    get centerY() { return this._entity.centerY }

    get gridX() { return this._entity.gridX }
    get gridY() { return this._entity.gridY }

    get width() { return this._entity.width }
    set width(value) { this._entity.width = value }
    get height() { return this._entity.height }  
    set height(value ) { this._entity.height = value }

    get dx() { return this._entity.dx }
    set dx(value) { this._entity.dx = value }

    get dy() { return this._entity.dy }
    set dy(value) { this._entity.dy = value }

    get gravity() { return this._entity.gravity }
    get grounded() { return this._entity.grounded }

    get frameX() { 
        return this.animation.currentFrame; 
    }

    setState(state) {
        this.state = this.stateList[stateEnum[state]];
        this.state.enter();
    }

    addDevKit() {
        console.log(this);
        this.inventory.addItem(ItemRegistry.get("dev_pickaxe"), 1);
        this.inventory.addItem(ItemRegistry.get("dev_axe"), 1);
        this.inventory.addItem(ItemRegistry.get("dev_hammer"), 1);
        this.inventory.addItem(ItemRegistry.get("dev_shovel"), 1);
    }

    update(m, input, dt) {
        this.inLiquid = false;
        this._entity.grounded = false;

        // Handle input
        if(input.keys.includes("X")) {
            this.addDevKit();
            input.removeKey("X");
        }

        let left = input.keys.includes("A");
        let right = input.keys.includes("D");

        if(left) {this.facing = "left"}
        if(right) {this.facing = "right"}

        this.getHorizontalMovement(left,right);
        this._entity.updateCollision(this.world);
        this.pickupLabels.update();

        this.state.handleInput(this.game.input, dt);
        this.state.updatePhysics(m, dt);
        this.state.updateAnimation();
        this.animation.update(dt);

        if(this.placeDelay > 0) {
            this.placeDelay -= 1;
        }
            
        // Tile interaction
        if(input.mouse.click && !this.inventory.view) {

            if(this.heldItem && this.heldItem.placeable) {
                this.placeTile(this.heldItem, input.mouse.gridX, input.mouse.gridY);
            } else {
                this.updateMining(input, dt);
            }
        } else {
            this.miningAction = null;
        }

        this.updatePosition(m, input);
        this.updateInventory(input);
        this.camera.update();

        // Old water physics
        /*
        // Gravity in water
        if(this.inLiquid) {
            this.dy += GRAVITY/3;
            this.dy = clamp(this.dy,-4,4);
        } 

        if(jump && this.inLiquid) {
            this.dy -= 0.2;
        }
        */
    }

    updateInventory(input) {

        // Crafting menu
        if(this.craftingMenu.isOpen) {
            this.craftingMenu.handleInput(this.game.input);
            this.craftingMenu.update();
            return;
        }

        // Open and Close inventory
        if(input.keys.includes("E")) {
            if(this.inventory.view) {
                this.inventory.close();
            } else {
                this.inventory.view = true;
            }
            input.removeKey("E");
        }

        // Select inventory slot
        for(let i = 1; i <= 6; i++) {
            if(input.keys.includes(i.toString())) {
                this.miningAction = null;
                this.selectItem(i);
                input.removeKey(i.toString());
            }
        }

        if(this.inventory.view) {
            this.inventory.update(input);

            // Open crafting menu
            if(input.keys.includes("C")) {
                this.craftingMenu.open();
                input.removeKey("C");
            }
        }
    }

    updateMining(input, dt) {
        let tile = this.world.getTile(input.mouse.gridX, input.mouse.gridY);
        let wall = this.world.getWall(input.mouse.gridX, input.mouse.gridY);

        // Find object the tool is able to interact with
        let obj;
        if(tile && tile.canBeMined(this.heldItem)) {
            obj = tile;
        } else if(wall && wall.canBeMined(this.heldItem)) {
            obj = wall;
        } else {
            this.miningAction = null;
            return;
        }

        // If not currently mining the block, create a new Mining event
        if(!this.miningAction) {
            this.miningAction = new MiningAction(obj, this.heldItem, this.game);
        }

        // If not in range of the block, cancel Mining event
        if(calculateDistance(this, this.miningAction.tile) > this.reach) {
            this.miningAction = null;
            return;
        }

        // If mouse has moved outside the previous block being mined, create new Event
        if(this.miningAction.tile.gridX != input.mouse.gridX || 
            this.miningAction.tile.gridY != input.mouse.gridY) {
                this.miningAction = new MiningAction(obj, this.heldItem, this.game);
        }

        // Increase mining progress.
        this.miningAction.increaseProgress(dt);

        if(this.miningAction.finished) {
            this.game.world.lighting.update(this);
            this.miningAction = null;
        }
    }
        

    getHorizontalMovement(walkLeft, walkRight) {
        // If player is holding A, accelerate left.
        if(walkLeft) {
            this.dx -= this.acceleration;
        }
        // If player is holding D, accelerate right.
        else if(walkRight) {
            this.dx += this.acceleration;
        }

        // If player is not moving left but has left momentum, slow down.
        if(!walkLeft && this.dx < 0) {
            this.dx += 0.8;
            if(this.dx > 0) {
                this.dx = 0;
            }
        } 

        // If player is not moving right but has right momentum, slow down.
        if(!walkRight && this.dx > 0) {
            this.dx -= 0.8;
            if(this.dx < 0) {
                this.dx = 0;
            }
        }

        // Limit speed to max running speed
        
        this.dx = clamp(this.dx, -this.maxSpeed, this.maxSpeed);
    }

    // Move player and camera by dx and dy
    updatePosition(m, input) {
        this._entity.move(m, this.dx, this.dy);
        input.mouse.updateGridPos();
    }

    selectItem(slot) {
        this.inventory.selectedHotbarSlot = slot;
        let selected = this.inventory.getSelectedSlot();
        if(selected.stack) {
            this.hotbarText.set(selected.stack.item.displayName);

            if(selected.stack.item.reach) {
                this.reach = selected.stack.item.reach * TILE_SIZE;
            } else {
                this.reach = this.reach;
            }
            this.heldItem = selected.stack.item;
            this.miningAction = null;
        } else {
            this.heldItem = null;
            this.reach = this.reach;
        }
    }

    drawPlacementPreview(input) {
        let x = input.mouse.gridX;
        let y = input.mouse.gridY;
        // Held item must have a placement preview
        if (!this.heldItem || 
            !this.heldItem.placementPreview || 
            !this.heldItem.canBePlaced(x, y, this.world)) {
                return;
        }

        this.heldItem.placementPreview.draw(x, y, this);
    }

    draw() {
        let frameSize = 96;
        let x = this.x - (frameSize - this.width) / 2;
        let y = this.y + this.height - frameSize;
        ctx.drawImage(this.spriteSheet, frameSize * this.frameX, frameSize * this.frameY, 
            frameSize, frameSize, x, y, frameSize, frameSize);
    }

    placeTile(item, x, y) {

        // Placement delay
        if(this.placeDelay > 0) return;

        // Check if item is placeable
        if(!item || !item.placeable) return;

        // X and Y must be within grid
        if(isNaN(x) || isNaN(y) || this.game.world.outOfBounds(x, y))  return;

        // Must be a valid placement position
        if(!item.canBePlaced(x, y, this.world)) return;
    
        let tile = new TileInstance(this.game.world, x, y, item.place());
        if(!tile || !tile.model) return;

        // Cannot place out of range
        if(calculateDistance(this, tile) > this.reach) return;

        // Cannot place a solid tile which overlaps with player
        if(tile.getType() == "solid" && overlap(this, tile)) return;

        this.world.setTile(x, y, tile.registryName);
        
        // Decrease amount in stack by 1
        let heldStack = this.inventory.getSelectedSlot().stack;
        heldStack.subtractAmount(1);

        // Remove stack if amount reaches 0
        if(heldStack.amount == 0) {
            this.inventory.getSelectedSlot().stack = null;
            this.heldItem = null;
        }

        this.placeDelay = 15;

        this.world.updateNearbyTiles(x, y);
        this.world.lighting.update(this);
    }

    // Put the player in the center of the map
    spawn() {
        let spawnX = Math.floor(this.game.world.width / 2)
        this.x = Math.round(spawnX * TILE_SIZE - this.width / 2);
        this.y = Math.round((-HEIGHTMAP[spawnX] - 2) * TILE_SIZE);
        this.inventory = new Inventory(this);
        this.setState("FALLING");
    }
}
export { Player }