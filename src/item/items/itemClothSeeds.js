import { sprites } from "../../game/graphics/loadAssets.js";
import { ClothPlant } from "../../tile/placeables/clothPlant.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemClothSeeds extends PlaceableBase {
    constructor(game) {
        super(game);
        this.setRegistryName("grass_seeds");
        this.setRarity(1);

        this.setSprite(sprites.items.grass_seeds);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_grass,72,12,this);
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
        return new ClothPlant(x,y,this.game.world);
    }
}