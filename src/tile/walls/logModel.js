import { ctx } from "../../game/global.js";
import { TileDrop } from "../tileDrop.js";
import WallBase from "./WallBase.js";

export class LogModel extends WallBase {
    constructor(world, registryName) {
        super(world, registryName);
        this.transparent = true;
        this.setMiningProperties("axe", 0, 1.5, false);

        this.tileDrops = [
            new TileDrop(this, "wood", [1,3], 100, true, false),
        ]
    }

    // Override
    canBeMined(item) {
        if(item && item.toolType == "hammer") {
            return false;
        }
        return true;
    }

    breakTile(tile, toolType, miningLevel) {
        // If

        let tileAbove = this.world.getWall(tile.x,tile.y+1);
        if(tileAbove && tileAbove.getRegistryName() == "log") {
            tileAbove.breakTile(tileAbove, toolType, miningLevel);
        }

        // Remove tile
        this.world.clearWall(tile.x,tile.y);

        this.dropItems(tile, toolType, miningLevel);
        this.world.updateNearbyTiles(tile.x,tile.y);
    }

    render(x,y) {
        ctx.fillStyle = "rgb(200,130,110)";
        ctx.fillRect(x+4,y,this.w-8,this.h);
    }
}