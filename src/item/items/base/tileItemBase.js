import { ITEM_SIZE } from "../../../game/global.js";
import Item from "../../../item/item.js";

export default class TileItemBase extends Item {
    constructor(game) {
        super(game);
        this.itemType = 'tile';
        this.placeable = true;
        this.stackLimit = 99;
        this.entitySize = ITEM_SIZE;
    }

    canBePlaced(x,y) {
        let world = this.game.world;
        // Check for unavalible tile
        if(world.outOfBounds(x,y) || world.getTile(x,y)) {
            return false;
        } 
        
        // Check for adjacent tile or wall
        if (world.getTile(x-1,y) ||
            world.getTile(x,y+1) ||
            world.getTile(x+1,y) ||
            world.getTile(x,y-1) ||
            world.getWall(x,y)
        ) {
            return true;
        }

        return false;
    }

    place(x,y) {
        
    }
}