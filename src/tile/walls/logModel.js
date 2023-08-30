import { ctx } from "../../game/global.js";
import { TileDrop } from "../tileDrop.js";
import WallBase from "../base/WallBase.js";
import toolTypes from "../../item/toolTypesEnum.js";

export class LogModel extends WallBase {
    constructor(world, registryName) {
        super(world, registryName);
        this.transparent = true;
        this.setMiningProperties(toolTypes.AXE, 0, 1.5, false);

        this.tileDrops = [
            new TileDrop(this, "wood", [1,3], 100, true, false),
        ]
    }

    // Override
    canBeMined(item) {
        if(item && item.toolType == toolTypes.HAMMER) {
            return false;
        }
        return true;
    }

    breakTile(tile, toolType, miningLevel) {
        let tileAbove = this.world.getWall(tile.gridX, tile.gridY + 1);
        if(tileAbove && tileAbove.registryName == "log") {
            tileAbove.breakTile(tileAbove, toolType, miningLevel);
        }

        // Remove tile
        this.world.clearWall(tile.gridX, tile.gridY);

        this.dropItems(tile, toolType, miningLevel);
        this.world.updateNearbyTiles(tile.gridX, tile.gridY);
    }

    render(x, y) {
        ctx.fillStyle = "rgb(200,130,110)";
        ctx.fillRect(x + 4, y, this.w - 8, this.h);
    }
}