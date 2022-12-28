


// If the interaction between the tile/wall and the tool is valid, return the tile/wall. Else return false.
export function checkToolInteraction(x,y,item) {

    let tile = getTile(x,y);
    let wall = getWall(x,y);

    if(!item) {
        return tile;
    } 

    switch(item.toolType) {
        // Axe can only mine tiles with a tool type of "axe" (logs, leaves, and solid wooden blocks)
        // Will mine solid tiles before logs.
        case "axe":
            if(tile && tile.toolType == "axe") {
                return tile;
            }

            if(wall && wall.toolType == "axe" && !tile) {
                return wall;
            }
            break;

        // Hammer can only mine wall blocks that aren't logs and aren't behind a solid tile.
        case "hammer":
            if(wall && !tile) {
                return wall;
            }
            break;

        // Pickaxe, Shovel and hand can mine all solid blocks
        case "pickaxe":
        case "shovel":
        default:
            return tile;
    }
}