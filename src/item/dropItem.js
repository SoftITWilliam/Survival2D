import { Player } from "../player/player.js";
import { ItemStack } from "./itemStack.js";

/**
 * TODO move elsewhere
 * @param {Player} player Player who is dropping the item
 * @param {ItemStack} stack Stack being dropped 
 */
export function dropItemFromPlayer(player, stack) {
    if(!player instanceof Player || !stack instanceof ItemStack) return;
    
    if(player.facing == "left") {
        var x = player.x - stack.item.entitySize / 2;
        var dx = -5;
    }
    else if(player.facing == "right") {
        var x = player.x2 + stack.item.entitySize / 2;
        var dx = 5;
    }
    else {
        console.warn("Cannot drop item - invalid player.facing value!");
        return;
    }

    var y = player.y + player.height / 4;

    console.log(player.world);
    let entity = player.world.itemEntities.add(x, y, stack);
    entity.vector = { dx: dx, dy: -3 }
}