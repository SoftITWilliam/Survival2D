import { TILE_SIZE } from "../../game/global.js";
import { TileModel } from "../tileModel.js";

export default class WallBase extends TileModel {
    constructor(world, registryName) {
        super(world, registryName, TILE_SIZE, TILE_SIZE);
        this.setType("wall");
        this.toolType = "hammer";
        this.requireTool = true;
        this.transparent = false;
        this.connective = true;
    }

    // Override
    canBeMined(item) {
        if(item && item.placeable) {
            return false;
        }

        if(this.world.getTile(this.gridX,this.gridY) && !this.world.getTile(this.gridX,this.gridY).transparent) {
            return false;
        }

        if(this.requireTool) {
            if(!item) {
                return false;
            }

            if(item.toolType != "hammer") {
                return false;
            }
        }

        return true;
    }
}