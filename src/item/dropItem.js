
// FIXED IMPORTS:
import { rng } from "../misc/util.js";

export function dropItemFromBlock(tile,id,amount,game) {
    let item = game.itemRegistry.getFromID(id);

    // Generate random vector for item movement
    let dx = rng(-20,20) / 10;
    let dy = rng(-20,0) / 10;

    if(item) {
        game.itemEntities.addEntity(tile.centerX,tile.centerY,dx,dy,amount,item);
    }
}