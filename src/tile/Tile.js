import GameObject from "../game/gameObject.js";
import { TILE_SIZE } from "../game/global.js";
import Item from "../item/item.js";
import { toolTypes as tool } from "../item/itemTypes.js";
import { TileRegistry } from "./tileRegistry.js";

export class Tile extends GameObject {
    constructor(world, gridX, gridY, model) {
        super(world.game, gridX * TILE_SIZE, -gridY * TILE_SIZE)
        this.world = world;
        this.setModel(model);
    }

    setModel(model) {
        this.model = TileRegistry.get(model);
    }
    
    // Override
    get height() { return this.model?.height ?? 0 }

    // Override
    get width() { return this.model?.width ?? 0 }

    get registryName() {
        return this.model?.registryName ?? "";
    }

    get displayName() {
        return this.model?.displayName ?? "";
    }

    get requiresTool() { return this.model?.requiredTool ?? false }
    requiresTool() { return this.model?.requiredTool ?? false }

    get miningTime() { return this.model?.miningTime ?? 0 }
    getMiningTime() { return this.model?.miningTime ?? 0 }

    get toolType() { return this.model?.toolType ?? null }
    getToolType() { return this.model?.toolType ?? null }

    getType() {
        return this.model?.objectType ?? null;
    }

    isTransparent() {
        return this.model?.transparent ?? false;
    }

    isConnective() {
        return this.model?.connective ?? false;
    }

    // Runs whenever the tile is "refreshed", i.e. something happens to an adjacent tile.
    tileUpdate() {
        this.model.tileUpdate(this, this.world);
    }

    // Runs at a regular interval (not every frame)
    tickUpdate() {
        this.model.tickUpdate(this, this.world);
    }

    canBeMined(item, world) {
        return this.model ? this.model.canBeMined(item, world) : false;
    }

    breakTile(x, y, item) {
        this.model.breakTile(x, y, item, this.world);
    }

    isMineableBy(item) {
        if (this.toolType === null || this.toolType === tool.NONE) {
            return true;
        }

        if (Item.isTool(item, this.toolType) && 
            item.miningLevel >= this.model.toolLevel) {
                return true;
        }

        return false;
    }

    getSpritePosition() {
        let adjacent = this.getAdjacent();
        let position = this.model.getSpritePosition(adjacent);

        let spriteSize = 48;
        let spriteGap = 12;
        this.sx = position.x * (spriteSize + spriteGap);
        this.sy = position.y * (spriteSize + spriteGap);
        if(this.isConnective()) {
            this.sx += spriteGap;
            this.sy += spriteGap;
        }
    }

    /**
     * Set sprite offset position
     * (Used for spritesheets)
     * 
     * @param {int} offsetX // X offset in pixels
     * @param {int} offsetY // Y offset in pixels
     */
     setSpriteOffset(offsetX,offsetY) {
        if(!offsetX || !offsetY) {
            this.sx = 0;
            this.sy = 0;
        } else {
            this.sx = offsetX;
            this.sy = offsetY;
        }
    }

    getAdjacent() {

        let checkTile = (x, y) => {
            let tile = this.world.getTile(x, y);
            return (tile && !tile.isTransparent());
        }

        let adjacent = {
            tl: checkTile(this.gridX -1, this.gridY + 1), // Top Left
            tm: checkTile(this.gridX, this.gridY + 1),
            tr: checkTile(this.gridX + 1, this.gridY + 1),
            ml: checkTile(this.gridX - 1, this.gridY),
            mr: checkTile(this.gridX + 1, this.gridY),
            bl: checkTile(this.gridX - 1, this.gridY - 1),
            bm: checkTile(this.gridX, this.gridY - 1),
            br: checkTile(this.gridX + 1, this.gridY - 1),
        };

        return adjacent;
    }

    /** 
     * Returns true if 'arg' is of type Item.
     * If parameter 'item' is provided, returns true if 'arg' is the same as 'item'
     * @param {any} arg
     * @param {Tile?} tile (Optional) Check if 'arg' is the same tile as this
    */
    static isTile(arg, tile = null) {
        if(arg instanceof Tile) {
            return (tile instanceof Tile) ? (arg.registryName === tile.registryName) : true;
        }
        return false;
    }

    render() {
        this.model.render(this.x, this.y, this.sx, this.sy);
    }
}