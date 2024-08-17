import { TileDrop } from "../tileDrop.js";
import WallBase from "../base/WallBase.js";
import { ItemRegistry } from "../../item/itemRegistry.js";
import Item from "../../item/item.js";
import { Tile } from "../Tile.js";
import { TileRegistry } from "../tileRegistry.js";

export class LogModel extends WallBase {
    constructor(registryName) {
        super(registryName);
        this.transparent = true;
        this.setMiningProperties(Item.toolTypes.AXE, 0, 1.5, false);

        this.tileDrops = [
            new TileDrop(ItemRegistry.WOOD, 1, 3).affectedByMultipliers(),
        ]
    }

    // Override
    canBeMined(item) {
        return(!Item.isTool(item, Item.toolTypes.HAMMER));
    }

    /**
     * @param {Tile} tile 
     */
    removeFromWorld(tile) {
        const WORLD = tile.world;
        const RADIUS = 2;

        let tileAbove = WORLD.walls.get(tile.gridX, tile.gridY + 1);
        if(Tile.isTile(tileAbove, TileRegistry.LOG)) {
            tileAbove.break();
        }
        let leaves = WORLD.tiles.get(tile.gridX, tile.gridY);
        if(Tile.isTile(leaves, TileRegistry.LEAVES) && leaves.tileData['generated'] == true) {
            const connectedLeaves = leaves.getConnectedTiles();
            const leavesToRemove = new Set();

            // Check for logs of other trees within a radius of 2 around each leaf
            connectedLeaves.forEach(leaf => {
                let isTouchingOtherTree = false;

                // Scan an area centered on the leaf
                for (let dx = -RADIUS; dx <= RADIUS; dx++) {

                    // Ignore the X coordinate of the tree we're breaking
                    if(leaf.gridX + dx === tile.gridX) 
                        continue; 

                    for (let dy = -RADIUS; dy <= RADIUS; dy++) {
                        const log = WORLD.walls.get(leaf.gridX + dx, leaf.gridY + dy);
                        if (Tile.isTile(log, TileRegistry.LOG)) {
                            isTouchingOtherTree = true;
                            break;
                        }
                    }
                    if (isTouchingOtherTree) break;
                }

                if (isTouchingOtherTree) {
                    leavesToRemove.add(leaf);
                }
            });

            // Remove only the leaves associated with this tree, excluding those connected to other trees
            connectedLeaves.forEach(leaf => {
                if (!leavesToRemove.has(leaf)) {
                    leaf.break();
                }
            });
        }

        super.removeFromWorld(tile);
    }

    render(ctx, tile) {
        ctx.fillStyle = "rgb(150,100,85)";
        ctx.fillRect(tile.x + 5, tile.y, this.w - 10, this.h);
    }
}