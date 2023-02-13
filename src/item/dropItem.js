import { rng } from "../misc/util.js";

export function dropItemFromBlock(tile,item,amount,game) {

    // Generate random vector for item movement
    let dx = rng(-20,20) / 10;
    let dy = rng(-20,0) / 10;

    if(item) {
        console.log(tile);
        game.itemEntities.addEntity(tile.getCenterX(),tile.getCenterY(),dx,dy,amount,item);
    }
}
