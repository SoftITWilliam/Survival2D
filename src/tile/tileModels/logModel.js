import { ctx } from "../../game/global.js";
import TileDrop from "../tileDrop.js";
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

    breakTile(x,y) {
        
        // If

        let tileAbove = this.world.getWall(x,y+1);
        if(tileAbove && tileAbove.getRegistryName() == "log") {
            tileAbove.breakTile()
        }

        // Remove tile
        this.world.clearWall(x,y);

        this.dropItems();
        this.world.updateNearbyTiles(x,y);
    }

    render(x,y) {
        ctx.fillStyle = "rgb(200,130,110)";
        ctx.fillRect(x+4,y,this.w-8,this.h);
    }
}