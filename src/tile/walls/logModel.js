import { ctx } from "../../game/global.js";
import { TileDrop } from "../tileDrop.js";
import WallBase from "../base/WallBase.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import Item from "../../item/item.js";

export class LogModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.transparent = true;
        this.setMiningProperties(tool.AXE, 0, 1.5, false);

        this.tileDrops = [
            new TileDrop(Items.WOOD, 1, 3).affectedByMultipliers(),
        ]
    }

    // Override
    canBeMined(item) {
        return(!Item.isTool(item, tool.HAMMER));
    }

    breakTile(tile, item, world) {
        let tileAbove = world.getWall(tile.gridX, tile.gridY + 1);
        if(tileAbove && tileAbove.registryName == "log") {
            tileAbove.breakTile(tileAbove, item, world);
        }
        super.breakTile(tile, item, world);
    }

    render(x, y) {
        ctx.fillStyle = "rgb(150,100,85)";
        ctx.fillRect(x + 5, y, this.w - 10, this.h);
    }
}