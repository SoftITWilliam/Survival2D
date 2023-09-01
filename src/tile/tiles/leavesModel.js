import { ctx } from "../../game/global.js";
import { TileDrop } from "../tileDrop.js";
import TileBase from "../base/TileBase.js";
import { toolTypes as tool } from "../../item/itemTypes.js";
import { ItemRegistry as Items } from "../../item/itemRegistry.js";

export class LeavesModel extends TileBase {
    constructor(world, registryName) {
        super(world, registryName);
        this.transparent = true;
        this.setMiningProperties(tool.AXE, 0, 0.6, false);

        this.tileDrops = [
            new TileDrop(Items.BRANCH, 1, 2).chance(25).affectedByMultipliers(),
            new TileDrop(Items.ACORN).chance(15).affectedByMultipliers(),
        ]
    }

    render(x,y) {
        ctx.fillStyle = "rgba(60,150,40,0.8)";
        ctx.fillRect(x, y, this.w, this.h);
    }
}