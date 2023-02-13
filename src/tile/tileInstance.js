import GameObject from "../game/gameObject.js";
import { TILE_SIZE } from "../game/global.js";

export class TileInstance extends GameObject {
    constructor(world, x, y, model) {
        super(world.game, x * TILE_SIZE, -y * TILE_SIZE)
        this.world = world;

        this.setModel(model);

        this.gridX = x;
        this.gridY = y;
        this.setSpriteOffset();
        this.updateCenterPos();
    }

    // SO MUCH FCKING BOILERPLATE!!! DAMN!

    setModel(model) {
        this.model = this.game.tileRegistry.get(model);
    }

    // Override
    getHeight() {
        return this.model ? this.model.h : 0;
    }

    // Override
    getWidth() {
        return this.model ? this.model.w : 0;
    }

    getRegistryName() {
        return this.model ? this.model.registryName : "";
    }

    getDisplayName() {
        return this.model ? this.model.displayName : "";
    }

    requiresTool() {
        return this.model ? this.model.requiredTool : false;
    }

    getMiningTime() {
        return this.model ? this.model.miningTime : 0;
    }

    getToolType() {
        return this.model ? this.model.toolType : null;
    }

    getID() {
        return this.model ? this.model.id : null;
    }

    getType() {
        return this.model ? this.model.objectType : null;
    }

    isTransparent() {
        return this.model ? this.model.transparent : false;
    }

    isConnective() {
        return this.model ? this.model.connective : false;
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
        let adjacent = {
            tl:false,tm:false,tr:false,ml:false,mr:false,bl:false,bm:false,br:false
        };

        let checkTile = (x,y) => {
            try {
                let tile = this.world.getTile(x,y);
                if(tile && !tile.isTransparent()) {
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        }

        adjacent.tl = checkTile(this.gridX -1, this.gridY + 1);
        adjacent.tm = checkTile(this.gridX, this.gridY + 1);
        adjacent.tr = checkTile(this.gridX + 1, this.gridY + 1);
        adjacent.ml = checkTile(this.gridX - 1, this.gridY);
        adjacent.mr = checkTile(this.gridX + 1, this.gridY);
        adjacent.bl = checkTile(this.gridX - 1, this.gridY - 1);
        adjacent.bm = checkTile(this.gridX, this.gridY - 1);
        adjacent.br = checkTile(this.gridX + 1, this.gridY - 1);

        return adjacent;
    }

    render() {
        this.model.render(this.x,this.y,this.sx,this.sy);
    }
}