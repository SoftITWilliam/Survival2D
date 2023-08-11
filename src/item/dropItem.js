import { ItemEntity } from "./itemEntity.js";

export function dropItemFromTile(tile, item, amount, game) {
    if(!item || !tile || !amount || !game) return;
    
    // Create an item entity and assign a randomzied movement vector to it
    let entity = game.itemEntities.addEntity(tile.getCenterX(), tile.getCenterY(), amount, item);
    let v = ItemEntity.generateVector(game.physicsMultiplier);
    entity.vector = v;
}
