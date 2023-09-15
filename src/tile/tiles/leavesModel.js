import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";
import { Tile } from "../Tile.js";
import Item from "../../item/item.js";

export class LeavesModel extends TileBase {
    constructor(registryName) {
        super(registryName);
        this.type = Tile.types.NON_SOLID;
        this.transparent = true;
        this.setMiningProperties(Item.toolTypes.AXE, 0, 0.6, false);

        this.tileDrops = [
            new TileDrop(Items.BRANCH, 1, 2).chance(25).affectedByMultipliers(),
            new TileDrop(Items.ACORN).chance(15).affectedByMultipliers(),
        ]
    }

    render(ctx, tile) {
        ctx.fillStyle = "rgba(60,120,35,0.8)";
        ctx.fillRect(tile.x, tile.y, this.w, this.h);
    }
}