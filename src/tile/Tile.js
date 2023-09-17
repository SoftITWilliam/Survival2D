import GameObject from "../class/GameObject.js";
import { TILE_SIZE } from "../game/global.js";
import Item from "../item/item.js";
import { TileModel } from "./tileModel.js";
import { Tileset } from "./Tileset.js";

export class Tile extends GameObject {
    constructor(world, gridX, gridY, model) {
        super(world.game, gridX * TILE_SIZE, -gridY * TILE_SIZE)
        this.world = world;

        this.model = (model instanceof TileModel) ? model : null;

        this.sheetX = 0;
        this.sheetY = 0;
        this._spriteVariant;
    }

    //#region Enums

    static types = {
        NONE: 0, // (No tile should ever actually have this)
        SOLID: 1,
        NON_SOLID: 2,
        WALL: 3,
        PLATFORM: 4,
    }

    //#endregion

    //#region Property getters/setters
    
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

    get miningTime() { return this.model?.miningTime ?? 0 }

    get toolType() { return this.model?.toolType ?? null }

    get type() { return this.model?.type ?? Tile.types.NONE }

    get transparent() {
        return this.model?.transparent ?? false;
    }

    get connective() {
        return this.model?.connective ?? false;
    }

    get spriteVariantName() {
        let index = Object.values(Tileset.variants).indexOf(this._spriteVariant);
        return index != null ? Object.keys(Tileset.variants)[index] : "";
    }

    //#endregion

    //#region Public methods

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

    breakTile(item) {
        this.model.breakTile(this, item, this.world);
    }

    isMineableBy(item) {
        if (this.toolType === null || this.toolType === Item.toolTypes.NONE) {
            return true;
        }

        if (Item.isTool(item, this.toolType) && 
            item.miningLevel >= this.model.toolLevel) {
                return true;
        }

        return false;
    }

    updateSpritePosition() {
        let adjacent = this.getAdjacent();

        this._spriteVariant = Tileset.getVariant(adjacent);
        let position = Tileset.getSpritesheetPosition(this._spriteVariant, this.model.tilesetTemplate);
        
        this.sheetX = position?.x;
        this.sheetY = position?.y;
    }

    getAdjacent() {

        var check = (this.type == Tile.types.WALL ? 

            (x, y) => (this.world.walls.get(x, y) != null) :

            (x, y) => {
                let tile = this.world.tiles.get(x, y);
                return (tile && !tile.transparent)
            }
        );

        return {
            top: check(this.gridX, this.gridY + 1),
            left: check(this.gridX - 1, this.gridY),
            right: check(this.gridX + 1, this.gridY),
            bottom: check(this.gridX, this.gridY - 1),
            top_left: check(this.gridX -1, this.gridY + 1),
            top_right: check(this.gridX + 1, this.gridY + 1),
            bottom_left: check(this.gridX - 1, this.gridY - 1),
            bottom_right: check(this.gridX + 1, this.gridY - 1),
        };
    }

    render(ctx) {
        this.model.render(ctx, this, this.sheetX, this.sheetY);
    }

    //#endregion

    //#region Static methods

    /** 
     * Returns true if 'arg' is of type Item.
     * If parameter 'item' is provided, returns true if 'arg' is the same as 'item'
     * @param {any} arg
     * @param {Tile?} tile (Optional) Check if 'arg' is the same tile as this
    */
    static isTile(arg, tile = null) {
        if(arg instanceof Tile) {
            if(tile instanceof Tile || tile instanceof TileModel)
                return (arg.registryName === tile.registryName)
            
            else return true;
        }
        return false;
    }

    //#endregion
}