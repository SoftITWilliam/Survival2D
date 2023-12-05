import { INVENTORY_HEIGHT, INVENTORY_WIDTH, TILE_SIZE } from '../game/global.js';
import { Inventory } from '../ui/inventory.js';
import MiningAction from './mining.js';
import { PlayerStatBar } from './statBar.js';
import { HotbarText } from '../ui/HotbarText.js';
import PlayerCamera from './camera.js';
import ItemInfoDisplay from '../ui/itemInfo.js';
import { PlayerFalling, PlayerJumping, PlayerRunning, PlayerStanding, PlayerState } from './playerStates.js';
import { sprites } from '../graphics/assets.js';
import CraftingMenu from '../crafting/Crafting.js';
import { FrameAnimation } from '../graphics/FrameAnimation.js';
import { ItemRegistry as Items } from '../item/itemRegistry.js';
import { EntityComponent } from '../components/EntityComponent.js';
import { calculateDistance, clamp } from '../helper/helper.js';
import { TilePlacement } from '../tile/TilePlacement.js';
import { Cooldown } from '../class/Cooldown.js';
import { SpriteRenderer } from '../graphics/SpriteRenderer.js';
import { AlignmentY } from '../misc/alignment.js';
import { PlayerInventory } from './Inventory.js';
import { Observable } from '../class/Observable.js';
import { Spritesheet } from '../graphics/Spritesheet.js';
import { AnimationSet } from '../graphics/AnimationSet.js';

const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 72;
const TILE_PLACEMENT_DELAY_MS = 250;

/**
 * @readonly
 * @enum {string}
 */
export const Facing = {
    RIGHT: "facing_right",
    LEFT: "facing_left",
}

export class Player {
    /** @type {EntityComponent} */
    #entity = new EntityComponent(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    /** @type {number} */
    #selectedSlotIndex = 0;
    /** @type {number} */
    #reach = 3;
    /** @type {Cooldown} */
    #placementCooldown = new Cooldown(TILE_PLACEMENT_DELAY_MS);
    /** @type {SpriteRenderer} */
    #renderer
    /** @type {PlayerState} */
    #state;
    /** @type {Facing} */
    #facing = Facing.RIGHT;

    /** @type {number} */
    maxSpeed = 5;
    /** @type {number} */
    maxFallSpeed = 12;
    /** @type {number} */
    acceleration = 0.5;
    /** @type {number} */
    cheetahFrames = 0;
    /** @type {MiningAction|null} */
    miningAction = null;

    itemPickupSubject = new Observable();
    uiRenderSubject = new Observable();

    // Currently unused
    health = new PlayerStatBar(50, 45);
    hunger = new PlayerStatBar(50, 20);
    thirst = new PlayerStatBar(50, 20);

    constructor(game) {
        this.game = game;
        this.world = game.world;

        this.inventory = new Inventory(this);
        this.inventory2 = new PlayerInventory(INVENTORY_WIDTH, INVENTORY_HEIGHT);

        this.hotbarText = new HotbarText(); 
        this.itemInfoDisplay = new ItemInfoDisplay(this);
        this.camera = new PlayerCamera(this);
        this.craftingMenu = new CraftingMenu(this);

        this.spritesheet = new Spritesheet({
            source: sprites.entities.player,
            spriteWidth: 96,
            spriteHeight: 96,
        })

        /** @type {AnimationSet} */
        this.animations = new AnimationSet({
            IDLE_RIGHT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: true,
                fps: 2,
                frames: [{x:0, y:0}, {x:1, y:0}]
            }),
            IDLE_LEFT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: true,
                fps: 2,
                frames: [{x:0, y:1}, {x:1, y:1}]
            }),
            WALK_RIGHT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: true,
                fps: 12,
                frames: [{x:3, y:2}, {x:4, y:2}, {x:5, y:2}, {x:6, y:2}, {x:7, y:2}, {x:0, y:2}, {x:1, y:2}, {x:2, y:2}]
            }),
            WALK_LEFT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: true,
                fps: 12,
                frames: [{x:3, y:3}, {x:4, y:3}, {x:5, y:3}, {x:6, y:3}, {x:7, y:3}, {x:0, y:3}, {x:1, y:3}, {x:2, y:3}]
            }),
            JUMP_RIGHT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: false,
                fps: 12,
                frames: [{x:0, y:4}, {x:1, y:4}, {x:2, y:4}]
            }),
            JUMP_LEFT: new FrameAnimation({
                spritesheet: this.spritesheet,
                loop: false,
                fps: 12,
                frames: [{x:0, y:5}, {x:1, y:5}, {x:2, y:5}]
            }),
        });

        this.#renderer = new SpriteRenderer(this.spritesheet);
        this.#renderer.setSpriteSize(96);
        this.#renderer.alignY = AlignmentY.BOTTOM;

        this.#entity.onBottomCollision = () => {
            this.setState(Player.States.FALLING);
        }
    }

    //#region Enums

    static States = {
        STANDING: new PlayerStanding(), 
        RUNNING: new PlayerRunning(), 
        JUMPING: new PlayerJumping(),
        FALLING: new PlayerFalling(), 
        //SWIMMING: new PlayerSwimming(this)
    }

    //#endregion

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
    //#region Getters/setters

    /** @returns {Facing} */
    get facing() { return this.#facing }
    /** @param {Facing} f */
    set facing(f) { 
        if(Object.values(Facing).includes(f)) this.#facing = f;
        else throw new TypeError('set facing(): Value must be from Facing enum');
    }

    get frameX() { 
        return this.animations.getActive()?.getCurrentFrame() ?? 0;
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

    get state() {
        return this.#state;
    }

    setState(state) {
        if(state instanceof PlayerState) {
            this.#state = state;
            this.#state.enter(this);
        } else {
            throw new TypeError('setState(): Not a PlayerState object');
        }
    }

    //#endregion
    //#region Update methods

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

        if(left) {this.facing = Facing.LEFT}
        if(right) {this.facing = Facing.RIGHT}

        this.getHorizontalMovement(left, right);
        this.#entity.updateCollision(this.world);

        this.hotbarText.update(deltaTime);

        this.state.handleInput(this.game.input, deltaTime);
        this.state.updatePhysics(deltaTime);
        this.state.updateAnimation();
        this.animations.getActive()?.update(deltaTime);

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
            if(this.inventory2.isOpen) {
                this.inventory2.close();
            } else {
                this.inventory2.open();
            }
            input.removeKey("E");
        }

        // Select inventory slot
        for(let i = 1; i <= this.inventory2.width; i++) {
            if(input.keys.includes(i.toString())) {
                this.miningAction = null;
                this.inventory2.selectedIndex = i - 1;
                input.removeKey(i.toString());
            }
        }

        /*
        // Open and Close inventory
        if(input.keys.includes("E")) {
            if(this.inventory.view) {
                this.inventory.close();
                this.inventory2.close();
            } else {
                this.inventory.view = true;
                this.inventory2.open();
            }
            input.removeKey("E");
        }

        // Select inventory slot
        for(let i = 1; i <= this.inventory2.width; i++) {
            if(input.keys.includes(i.toString())) {
                this.miningAction = null;
                this.#selectItem(i);
                this.inventory2.selectedIndex = i - 1;
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
        */
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
    //#endregion
    //#region onThing methods

    onItemPickup(item, amount) {
        this.itemPickupSubject.notify({ item, amount });
    }

    /**
     * Runs when selecting a new slot or the item in the selected slot changes
     */
    onItemSelectionChanged() {
        this.miningAction = null;
        let item = this.selectedSlot?.stack?.item ?? null;
        if(item) {
            this.hotbarText.item = item;
        }
    }

    //#endregion

    #selectItem(index) {
        index--;
        if(index !== this.#selectedSlotIndex) {
            this.#selectedSlotIndex = index;
            this.onItemSelectionChanged();
        }
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

    //#region §ing methods

    render(ctx) {
        const anim = this.animations.getActive();
        const pos = anim ? anim.getCurrentFramePosition() : {x:0, y:0};
        this.#renderer.setSheetPosition(pos.x, pos.y);
        this.#renderer.render(ctx, this);
    }

    renderUI(ctx, input) {
        this.uiRenderSubject.notify({ 
            ctx, input,
            player: this, 
            camera: this.camera,  
        });
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

    //#endregion
}

// Put the player in the center of the map
export function spawnPlayerInWorld(player, world) {

    let spawnX = Math.floor(world.width / 2);

    player.x = Math.round(spawnX * TILE_SIZE + (TILE_SIZE - player.width) / 2);
    player.y = Math.round((-world.heightmap[spawnX] - 2) * TILE_SIZE);

    player.setState(Player.States.FALLING);
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