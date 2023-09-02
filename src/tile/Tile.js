import GameObject from "../game/gameObject.js";
import { TILE_SIZE } from "../game/global.js";
import tileRegistry from "./tileRegistry.js";

export class Tile extends GameObject {
    constructor(world, gridX, gridY, model) {
        super(world.game, gridX * TILE_SIZE, -gridY * TILE_SIZE)
        this.world = world;
        this.setModel(model);
    }

    setModel(model) {
        this.model = tileRegistry.get(model);
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

    requiresTool() {
        return this.model?.requiredTool ?? false;
    }

    getMiningTime() {
        return this.model?.miningTime ?? 0;
    }

    getToolType() {
        return this.model?.toolType ?? null;
    }

    getID() {
        return this.model?.id ?? null;
    }

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
        this.model.tileUpdate(this);
    }

    // Runs at a regular interval (not every frame)
    tickUpdate() {
        this.model.tickUpdate(this);
    }

    canBeMined(item) {
        return this.model ? this.model.canBeMined(item) : false;
    }

    breakTile(x, y, toolType, miningLevel) {
        this.model.breakTile(x, y, toolType, miningLevel);
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

    render() {
        this.model.render(this.x, this.y, this.sx, this.sy);
    }
}