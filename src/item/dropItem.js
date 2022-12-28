
// FIXED IMPORTS:
import { rng } from "../misc/util.js";
import { itemEntities, ItemEntity } from "./itemEntity.js";
import { getItemRegistryName, ITEM_REGISTRY } from "./itemRegistry.js";

export function dropItemFromBlock(tile,id,amount) {
    let item = getItemRegistryName(id);

    // Generate random vector for item movement
    let dx = rng(-20,20) / 10;
    let dy = rng(-20,0) / 10;

    if(item) {
        itemEntities.push(new ItemEntity(tile.centerX,tile.centerY,dx,dy,amount,ITEM_REGISTRY[item]));
    }
}