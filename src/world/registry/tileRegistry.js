import * as tile from '../../objects/parents/tileParent.js';

// List of all tiles in the game
export const TILE_REGISTRY = {
    tile_dirt: new tile.Dirt(),
    tile_grass: new tile.Grass(),
    tile_stone: new tile.DevAxe(),
    wall_log: new tile.Log(),
    tile_leaves: new tile.Leaves(),
    liquid_water: new tile.Water(),
    wall_dirt: new tile.DirtWall(),
    wall_stone: new tile.StoneWall(),
}

export function getTileRegistryName(id) {
    for(let i=0;i<ID_NAME_LINK.length;i++) {
        if(ID_NAME_LINK[i].id == id) {
            return ID_NAME_LINK[i].registryName;
        }
    }
    return false;
}

