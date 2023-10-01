import { Game } from "../game/game.js";
import { Player } from "../player/player.js";
import { Tile } from "../tile/Tile.js";
import Item from "./item.js";
import { ItemEntity } from "./itemEntity.js";
import { ItemStack } from "./itemStack.js";


/**
 * 
 * @param {Tile} tile Tile which the item is being dropped from. Used for position only
 * @param {Item} item Item being dropped 
 * @param {number} amount Amount of item being dropped
 * @param {Game} game Game object, used to access the Item Entity Manager
 */
export function dropItemFromTile(tile, stack, game) {
    if (!tile instanceof Tile || !stack instanceof ItemStack || !game instanceof Game) return;
    
    // Create an item entity and assign a randomzied movement vector to it
    let entity = game.itemEntities.addEntity(tile.centerX, tile.centerY, stack);
    let v = ItemEntity.generateVector();
    entity.vector = v;
}

/**
 * 
 * @param {Player} player Player who is dropping the item
 * @param {Item} item Item being dropped 
 * @param {number} amount Amount of item being dropped
 * @param {Game} game Game object, used to access the Item Entity Manager
 */
export function dropItemFromPlayer(player, item, amount, game) {
    if(!player || !item || !amount || !game) return;
    
    if(player.facing == "left") {
        var x = player.x - item.entitySize / 2;
        var dx = -5;
    }
    else if(player.facing == "right") {
        var x = player.x2 + item.entitySize / 2;
        var dx = 5;
    }
    else {
        console.warn("Cannot drop item - invalid player.facing value!");
        return;
    }

    var y = player.y + player.height / 4;

    let entity = game.itemEntities.addEntity(x, y, new ItemStack(item, amount));
    entity.vector = { dx: dx, dy: -3 }
}