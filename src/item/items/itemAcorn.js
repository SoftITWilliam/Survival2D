import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../ui/placementPreview.js";
import ItemBase from "./base/itemBase.js";

export class ItemAcorn extends ItemBase {
    constructor(game) {
        super(game);
        this.setRegistryName("acorn");
        this.setRarity(0);
        this.placeable = false;

        this.setSprite(sprites.items.acorn);
        //this.placementPreview = new PlacementPreview(sprites.items.acorn,0,0);
    }
}