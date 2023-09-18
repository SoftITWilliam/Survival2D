import { TILE_SIZE } from '../game/global.js';
import { Inventory } from '../ui/inventory.js';
import MiningAction from './mining.js';
import { PlayerStatBar } from './statBar.js';
import { HotbarText } from '../ui/HotbarText.js';
import { PickupLabelManager } from '../ui/pickupLabels.js';
import PlayerCamera from './camera.js';
import ItemInfoDisplay from '../ui/itemInfo.js';
import { PlayerFalling, PlayerJumping, PlayerRunning, PlayerStanding, PlayerSwimming, stateEnum } from './playerStates.js';
import { sprites } from '../graphics/assets.js';
import CraftingMenu from '../crafting/Crafting.js';
import { FrameAnimation } from '../graphics/animation.js';
import { ItemRegistry as Items } from '../item/itemRegistry.js';
import { EntityComponent } from '../components/EntityComponent.js';
import { calculateDistance, clamp } from '../helper/helper.js';
import { TilePlacement } from '../tile/TilePlacement.js';
import { Cooldown } from '../class/Cooldown.js';

const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 72;

const TILE_PLACEMENT_DELAY_MS = 250;

export class Player {
    #entity
    #selectedSlotIndex
    #reach
    #placementCooldown
    constructor(game) {
        this.game = game;
        this.world = game.world;

        this.#entity = new EntityComponent();

        this.inventory = new Inventory(this);

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

        this.pickupLabels = new PickupLabelManager();
        this.hotbarText = new HotbarText(); 
        this.itemInfoDisplay = new ItemInfoDisplay(this);
        this.camera = new PlayerCamera(this);
        this.craftingMenu = new CraftingMenu(this);

        this.miningAction = null;
        
        this.#reach = 3;
        this.#selectedSlotIndex = 0;
        this.#placementCooldown = new Cooldown(TILE_PLACEMENT_DELAY_MS);

        this.cheetahFrames = 0;

        // Sprite and Animation variables
        this.spriteSheet = sprites.entities.player;
        this.frameY = 0;
        this.animation = new FrameAnimation();
        this.frameWidth = 96;

        this.#entity.onBottomCollision = () => {
            this.setState("FALLING");
        }
    }

    //#region Component wrappers
    get x() { return this.#entity.x }
    set x(value) { this.#entity.x = value }

    get y() { return this.#entity.y }
    set y(value) { this.#entity.y = value }
    
    get x2() { return this.#entity.x2 }
    get y2() { return this.#entity.y2 }

    get centerX() { return this.#entity.centerX }
    get centerY() { return this.#entity.centerY }

    get gridX() { return this.#entity.gridX }
    get gridY() { return this.#entity.gridY }

    get width() { return this.#entity.width }
    set width(value) { this.#entity.width = value }
    get height() { return this.#entity.height }  
    set height(value ) { this.#entity.height = value }

    get dx() { return this.#entity.dx }
    set dx(value) { this.#entity.dx = value }

    get dy() { return this.#entity.dy }
    set dy(value) { this.#entity.dy = value }

    get gravity() { return this.#entity.gravity }
    get grounded() { return this.#entity.grounded }
    //#endregion

    get frameX() { 
        return this.animation.currentFrame; 
    }

    get selectedSlot() {
        return this.inventory.getSlot(this.#selectedSlotIndex, this.inventory.hotbarY);
    }

    get selectedItem() {
        return this.selectedSlot?.stack?.item ?? null;
    }

    get reach() {
        return (this.selectedItem?.reach ?? this.#reach) * TILE_SIZE;
    }

    setState(state) {
        this.state = this.stateList[stateEnum[state]];
        this.state.enter();
    }

    update(deltaTime, input) {
        this.inLiquid = false;
        this.#entity.grounded = false;

        // Handle input
        if(input.keys.includes("X")) {
            giveDevTools(this);
            input.removeKey("X");
        }

        let left = input.keys.includes("A");
        let right = input.keys.includes("D");

        if(left) {this.facing = "left"}
        if(right) {this.facing = "right"}

        this.getHorizontalMovement(left, right);
        this.#entity.updateCollision(this.world);

        this.pickupLabels.update(deltaTime);
        this.hotbarText.update(deltaTime);

        this.state.handleInput(this.game.input, deltaTime);
        this.state.updatePhysics(deltaTime);
        this.state.updateAnimation();
        this.animation.update(deltaTime);

        // Tile interaction
        if(input.mouse.click && !this.inventory.view) {

            if(this.selectedItem && this.selectedItem.placeable) {
                this.placeHeldItem(input.mouse.gridX, input.mouse.gridY);
            } else {
                this.updateMining(input, deltaTime);
            }
        } else {
            this.miningAction = null;
        }

        this.updatePosition(deltaTime, input);
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
                this.#selectItem(i);
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
        let tile = this.world.tiles.get(input.mouse.gridX, input.mouse.gridY);
        let wall = this.world.walls.get(input.mouse.gridX, input.mouse.gridY);

        // Find object the tool is able to interact with
        let obj;
        if(tile && tile.canBeMined(this.selectedItem, this.world)) {
            obj = tile;
        } else if(wall && wall.canBeMined(this.selectedItem, this.world)) {
            obj = wall;
        } else {
            this.miningAction = null;
            return;
        }

        // If not currently mining the block, create a new Mining event
        if(!this.miningAction) {
            this.miningAction = new MiningAction(obj, this.selectedItem, this.game);
        }

        // If not in range of the block, cancel Mining event
        if(calculateDistance(this, this.miningAction.tile) > this.reach) {
            this.miningAction = null;
            return;
        }

        // If mouse has moved outside the previous block being mined, create new Event
        if(this.miningAction.tile.gridX != input.mouse.gridX || 
            this.miningAction.tile.gridY != input.mouse.gridY) {
                this.miningAction = new MiningAction(obj, this.selectedItem, this.game);
        }

        // Increase mining progress.
        this.miningAction.update(dt);

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
    updatePosition(deltaTime, input) {
        this.#entity.move(this.dx, this.dy, deltaTime);
        input.mouse.updateGridPos();
    }

    #selectItem(index) {
        index--;
        if(index !== this.#selectedSlotIndex) {
            this.miningAction = null;
            this.#selectedSlotIndex = index;
            let item = this.selectedSlot?.stack?.item ?? null;
            if(item) {
                this.hotbarText.item = item;
            }
        }
    }

    renderPlacementPreview(ctx, input) {
        let x = input.mouse.gridX;
        let y = input.mouse.gridY;
        // Held item must have a placement preview
        if (!this.selectedItem || 
            !this.selectedItem.placementPreview || 
            !this.selectedItem.canBePlaced(x, y, this.world)) {
                return;
        }

        this.selectedItem.placementPreview.render(ctx, x, y, this);
    }

    render(ctx) {
        let frameSize = 96;
        let x = this.x - (frameSize - this.width) / 2;
        let y = this.y + this.height - frameSize;
        ctx.drawImage(this.spriteSheet, frameSize * this.frameX, frameSize * this.frameY, 
            frameSize, frameSize, x, y, frameSize, frameSize);
    }

    placeHeldItem(gridX, gridY) {

        if(this.#placementCooldown.isFinished() === false) return;

        const stack = this.selectedSlot?.stack; 

        const placement = new TilePlacement(this.world);

        // 'result' should contain properties 'success', 'info', and 'tile'
        let result = placement.placeFromStack(this, stack, gridX, gridY);
        this.selectedSlot.refreshStack();

        if(result.success) {
            this.#placementCooldown.start();
        } 
        else {
            console.log(result.info);
        }
    }
}

// Put the player in the center of the map
export function spawnPlayerInWorld(player, world) {

    let spawnX = Math.floor(world.width / 2);

    player.x = Math.round(spawnX * TILE_SIZE + (TILE_SIZE - player.width) / 2);
    player.y = Math.round((-world.heightmap[spawnX] - 2) * TILE_SIZE);

    player.setState("FALLING");
}

/**
 * Add the Dev toolset to the player's inventory
 * (Dev pickaxe, axe, hammer, and shovel)
 * @param {Player} player
 */
function giveDevTools(player) {
    console.log("Giving player developer tools...");
    player.inventory.addItem(Items.DEV_PICKAXE);
    player.inventory.addItem(Items.DEV_AXE);
    player.inventory.addItem(Items.DEV_HAMMER);
    player.inventory.addItem(Items.DEV_SHOVEL);
}