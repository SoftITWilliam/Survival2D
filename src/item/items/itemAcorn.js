import { sprites } from "../../game/graphics/loadAssets.js";
import { Sapling } from "../../tile/tileParent.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemAcorn extends PlaceableBase {
    constructor(game) {
        super(game);
        this.setRegistryName("acorn");
        this.setRarity(0);
        this.placeable = true;

        this.setSprite(sprites.items.acorn);
        this.placementPreview = new PlacementPreview(sprites.placeables.sapling,0,0,this);
    }

    // Return true if position isn't occupied and tile below is either dirt or grass
    canBePlaced(x,y) {
        if(this.game.world.outOfBounds(x,y) || this.game.world.getTile(x,y)) {
            return false;
        }

        let tileBelow = this.game.world.getTile(x,y-1);
        if(!tileBelow || (tileBelow.registryName != "tile_dirt" && tileBelow.registryName != "tile_grass")) {
            return false;
        }

        return true;
    }

    place(x,y) {
        return new Sapling(x,y,this.game.world);
    }
}