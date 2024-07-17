import { INVENTORY_HEIGHT, INVENTORY_WIDTH, TILE_SIZE } from '../game/global.js';
import MiningAction from './mining.js';
import { StatBar } from './statBar.js';
import { HotbarText } from '../ui/HotbarText.js';
import PlayerCamera from './camera.js';
import ItemInfoDisplay from '../ui/itemInfo.js';
import { PlayerFalling, PlayerJumping, PlayerRunning, PlayerStanding, PlayerState } from './playerStates.js';
import { sprites } from '../graphics/assets.js';
import CraftingMenu from '../crafting/Crafting.js';
import { FrameAnimation } from '../graphics/FrameAnimation.js';
import { ItemRegistry as Items } from '../item/itemRegistry.js';
import { EntityComponent } from '../components/EntityComponent.js';
import { calculateDistance, clamp, getPhysicsMultiplier, validNumbers } from '../helper/helper.js';
import { TilePlacement } from '../tile/TilePlacement.js';
import { Cooldown } from '../class/Cooldown.js';
import { SpriteRenderer } from '../graphics/SpriteRenderer.js';
import { AlignmentY } from '../misc/alignment.js';
import { PlayerInventory } from './Inventory.js';
import { Observable } from '../class/Observable.js';
import { Spritesheet } from '../graphics/Spritesheet.js';
import { AnimationSet } from '../graphics/AnimationSet.js';
import { World } from '../world/World.js';
import { Tile } from '../tile/Tile.js';
import { ItemStack } from '../item/itemStack.js';
import { Range } from '../class/Range.js';
import { InputHandler } from '../game/InputHandler.js';
import { Game } from '../game/game.js';

const PLAYER_WIDTH = 36;
const PLAYER_HEIGHT = 72;

const TILE_PLACEMENT_DELAY_MS = 250;
const PLAYER_DEFAULT_REACH = 3;
const PLAYER_ACCELERATION = 0.5;
const PLAYER_DECELERATION = 0.7;
const PLAYER_WALKING_SPEED = 5;
const PLAYER_FALL_DAMAGE_THRESHOLD = 15;

/**
 * @readonly
 * @enum {string}
 */
export const Facing = {
    RIGHT: "facing_right",
    LEFT: "facing_left",
}

/**
 * THIS CLASS IS TOO DAMN BIG!!!
 * Many restrucuring needed.... terrible
 */
export class Player {
    /** @type {EntityComponent} */
    #entity = new EntityComponent(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    /** @type {Cooldown} */
    #placementCooldown = new Cooldown(TILE_PLACEMENT_DELAY_MS);
    /** @type {SpriteRenderer} */
    #renderer;
    /** @type {PlayerState} */
    #state;
    /** @type {Facing} */
    #facing = Facing.RIGHT;
    /** @type {Facing|null} */
    #moving = null;

    /** @type {number} */
    cheetahFrames = 0;
    /** @type {MiningAction|null} */
    miningAction = null;

    /** Notifies subscribers when an item is picked up */
    itemPickupSubject = new Observable();
    /** Notifies subscribers when UI is rendered. TODO refactor */
    uiRenderSubject = new Observable();

    // Currently unused
    health = new StatBar(50, 50);

    spritesheet = new Spritesheet({
        source: sprites.entities.player,
        spriteWidth: 96,
        spriteHeight: 96,
    })

    /** @type {PlayerInventory} */
    inventory;

    hotbarText = new HotbarText(); 
    itemInfoDisplay = new ItemInfoDisplay(this);
    camera = new PlayerCamera(this);
    
    animations = new AnimationSet({
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
    })

    /**
     * @param {Game} game
     */
    constructor(game) {
        this.game = game;
        this.world = game.world;

        // CraftingMenu gets game property so this can't be done outside of constructor
        this.craftingMenu = new CraftingMenu(this);

        this.inventory = new PlayerInventory(INVENTORY_WIDTH, INVENTORY_HEIGHT, game);

        this.#renderer = new SpriteRenderer(this.spritesheet);
        this.#renderer.setSpriteSize(96);
        this.#renderer.alignY = AlignmentY.BOTTOM;

        // When bumping head into ceiling, start falling immediately
        this.#entity.bottomCollisionSubject.subscribe(({ tile, velocity }) => {
            this.setState(Player.States.FALLING);
        });

        // Get velocity to calculate fall damage
        this.#entity.topCollisionSubject.subscribe(({ tile, velocity }) => {
            if(velocity > PLAYER_FALL_DAMAGE_THRESHOLD) {
                const excess = velocity - PLAYER_FALL_DAMAGE_THRESHOLD;
                const damage = Math.round(excess * 2);
                this.health.decreaseBy(damage);
            }
        });

        const INPUT = this.game.input;

        // Observe keypresses for player controls
        INPUT.keyDown.subscribe(({ key }) => {
            if(key === 'X') giveDevTools(this);

            else if(key === 'A') this.#moving = this.#facing = Facing.LEFT;
            else if(key === 'D') this.#moving = this.#facing = Facing.RIGHT;
            
            else if(key === 'E') this.inventory.toggle();
            else if(key === 'C' && this.inventory.isOpen) this.craftingMenu.open(); 

            for(const i of Range(0, this.inventory.width)) {
                if((i + 1).toString() === key) {
                    this.inventory.selectedIndex = i;
                }
            }
        })

        INPUT.keyUp.subscribe(({ key }) => {
            if(key === 'A') {
                if(INPUT.keys.includes('D')) 
                    this.#moving = this.#facing = Facing.RIGHT;
                else 
                    this.#moving = null;
            }

            if(key === 'D') {
                if(INPUT.keys.includes('A')) 
                    this.#moving = this.#facing = Facing.LEFT;
                else 
                    this.#moving = null;
            }
        })

        // Observe when items are selected
        this.inventory.selectionChangedSubject.subscribe((stack) => {
            this.miningAction = null;
            // Todo observe selectionChangedSubject in HotbarText, for less coupling
            if(stack !== null) {
                this.hotbarText.item = stack.item;
            }
        })
    }

    //#region Enums

    static States = {
        STANDING: new PlayerStanding(), 
        RUNNING: new PlayerRunning(), 
        JUMPING: new PlayerJumping(),
        FALLING: new PlayerFalling(), 
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

    get selectedSlot() {
        return this.inventory.container.get(this.inventory.selectedIndex, this.inventory.height - 1); // ??
    }

    get selectedItem() {
        return this.selectedSlot?.item ?? null;
    }

    get reach() {
        return (this.selectedItem?.reach ?? PLAYER_DEFAULT_REACH) * TILE_SIZE;
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

    /**
     * @param {number} deltaTime 
     * @param {InputHandler} input 
     */
    update(deltaTime, input) {
        this.inLiquid = false;
        this.#entity.grounded = false;

        this.dx = this.#calculateHorizontalSpeed(this.#moving, deltaTime);
        this.#entity.updateCollision(this.world);

        this.hotbarText.update(deltaTime);

        this.state.handleInput(input, deltaTime);
        this.state.updatePhysics(deltaTime);
        this.state.updateAnimation();
        this.animations.getActive()?.update(deltaTime);

        // Tile interaction
        if(input.mouse.click && !this.inventory.isOpen) {

            if(this.selectedItem && this.selectedItem.placeable) {
                this.placeHeldItem(input.mouse.gridX, input.mouse.gridY);
            } else {
                const miningTarget = this.#getMiningTarget(input, this.world);
                if(miningTarget !== null) {
                    this.#updateMining(miningTarget, input, deltaTime);
                } 
                else this.miningAction = null;
            }
        } 
        else this.miningAction = null;

        // Crafting menu
        if(this.craftingMenu.isOpen) {
            this.craftingMenu.handleInput(input);
            this.craftingMenu.update();
            return;
        }

        this.updatePosition(deltaTime, input);
        this.camera.update();

        //#region Old water physics
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
        //#endregion
    }

    /**
     * @param {InputHandler} input 
     * @param {World} world 
     * @returns {Tile|null}
     */
    #getMiningTarget(input, world) {
        const tile = world.tiles.get(input.mouse.gridX, input.mouse.gridY);
        if(tile && tile.canBeMined(this.selectedItem, world)) 
            return tile;

        const wall = world.walls.get(input.mouse.gridX, input.mouse.gridY);
        if(wall && wall.canBeMined(this.selectedItem, world)) 
            return wall;

        return null;
    }

    /**
     * @param {Tile} tile
     * @param {InputHandler} input 
     * @param {number} dt Delta time
     */
    #updateMining(tile, input, dt) {
        if(!tile instanceof Tile || !input instanceof InputHandler || !validNumbers(dt)) 
            throw new TypeError();

        
        if(this.miningAction !== null) {
            // If not in range of the block, cancel Mining event
            if(calculateDistance(this, this.miningAction.tile) > this.reach) {
                this.miningAction = null;
                return;
            }
            // If mouse has moved outside the previous block being mined, create new Event
            if(Tile.isHoveringTile(this.miningAction.tile, input) === false) {
                this.miningAction = null;
            }
        }

        // If not currently mining the block, create a new Mining event
        this.miningAction ??= new MiningAction(tile, this.selectedItem);
        this.miningAction.actionFinishedSubject.subscribe(() => this.miningAction = null);

        // Increase mining progress.
        this.miningAction.update(dt);
    }
        
    /**
     * @param {Facing|null} direction 
     * @param {number} dt Delta time
     */
    #calculateHorizontalSpeed(direction, dt) {
        const ACC = PLAYER_ACCELERATION * getPhysicsMultiplier(dt);
        const DEC = PLAYER_DECELERATION * getPhysicsMultiplier(dt);

        let dx = this.dx;
        
        // Accelerate left or right
        if(direction === Facing.LEFT) dx -= ACC;
        else if(direction === Facing.RIGHT) dx += ACC;

        // If player is not moving left but has left momentum, slow down.
        if(direction !== Facing.LEFT && dx < 0) {
            dx = Math.min(0, dx + DEC);
        } 

        // If player is not moving right but has right momentum, slow down.
        if(direction !== Facing.RIGHT && dx > 0) {
            dx = Math.max(0, dx - DEC);
        }

        // Limit speed to max running speed
        return clamp(dx, -PLAYER_WALKING_SPEED, PLAYER_WALKING_SPEED);
    }

    // Move player and camera by dx and dy
    updatePosition(deltaTime, input) {
        this.#entity.move(this.dx, this.dy, deltaTime);
        input.mouse.updateGridPos();
    }

    /**
     * @param {ItemStack} stack 
     */
    pickUpItem(stack) {
        let initialAmount = stack.amount;
        let remaining = this.inventory.container.addItem(stack)?.amount;
        stack.amount = remaining ?? 0;

        if(initialAmount != stack.amount) {
            this.itemPickupSubject.notify({ 
                item: stack.item,
                amount: initialAmount - stack.amount,
            });
        }
        return stack.amount === 0;
    }

    //#endregion

    placeHeldItem(gridX, gridY) {

        if(this.#placementCooldown.isFinished() === false) return;

        const placement = new TilePlacement(this.world);

        // 'result' should contain properties 'success', 'info', and 'tile'
        let result = placement.placeFromStack(this, this.selectedSlot, gridX, gridY);
        
        if(result.success) {
            this.inventory.container.clearEmptySlots();
            this.#placementCooldown.start();
        } 
        else {
            console.log(result.info);
        }
    }

    //#region Rendering methods

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

/**
 * Put the player in the center of the map
 * @param {Player} player 
 * @param {World} world 
 */
export function spawnPlayerInWorld(player, world) {

    let spawnX = Math.floor(world.width / 2);

     // Find suitable spawn tile
    const tiles = world.tiles.column(spawnX).filter(tile => tile != null && tile.type == Tile.types.SOLID);
    const topTile = tiles[tiles.length - 1];

    // Set player values
    player.x = Math.round(spawnX * TILE_SIZE + (TILE_SIZE - player.width) / 2);
    player.y = Math.round(-(topTile.gridY + 3) * TILE_SIZE);
    player.setState(Player.States.FALLING);
}

/**
 * Add the Dev toolset to the player's inventory
 * (Dev pickaxe, axe, hammer, and shovel)
 * @param {Player} player
 */
function giveDevTools(player) {
    console.log("Giving player developer tools...");
    player.pickUpItem(new ItemStack(Items.DEV_PICKAXE, 1));
    player.pickUpItem(new ItemStack(Items.DEV_AXE, 1));
    player.pickUpItem(new ItemStack(Items.DEV_HAMMER, 1));
    player.pickUpItem(new ItemStack(Items.DEV_SHOVEL, 1));
}