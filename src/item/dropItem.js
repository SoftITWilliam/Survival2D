import { ItemEntity } from "./itemEntity.js";
import { ItemStack } from "./itemStack.js";

export function dropItemFromTile(tile, item, amount, game) {
    if(!item || !tile || !amount || !game) return;
    
    // Create an item entity and assign a randomzied movement vector to it
    let entity = game.itemEntities.addEntity(tile.centerX, tile.centerY, new ItemStack(item, amount));
    let v = ItemEntity.generateVector(game.physicsMultiplier);
    entity.vector = v;
}
