import { sprites } from "../../game/graphics/loadAssets.js";
import PlacementPreview from "../../player/placementPreview.js";
import ItemBase from "./base/itemBase.js";

export class ItemAcorn extends ItemBase {
    constructor() {
        super();
        this.setRegistryName("acorn");
        this.setRarity(0);
        this.placeable = true;

        this.setSprite(sprites.items.acorn);
        this.placementPreview = new PlacementPreview(sprites.items.acorn,0,0);
    }
}