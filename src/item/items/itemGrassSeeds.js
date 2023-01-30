import { sprites } from "../../game/graphics/loadAssets.js";
import { Grass } from "../../tile/tileParent.js";
import PlacementPreview from "../../ui/placementPreview.js";
import PlaceableBase from "./base/placeableItemBase.js";

export class ItemGrassSeeds extends PlaceableBase {
    constructor(game) {
        super(game);
        this.setRegistryName("grass_seeds");
        this.setRarity(1);

        this.setSprite(null);
        this.placementPreview = new PlacementPreview(sprites.tiles.tile_grass,72,12,this.game,this);
    }

    canBePlaced(x,y) {
        let tile = this.game.world.getTile(x,y);
        if(tile && tile.registryName == "tile_dirt" && !this.game.world.getTile(x,y+1)) {
            return true;
        }
        return false;
    }

    place(x,y) {
        return new Grass(x,y,this.game.world);
    }
}