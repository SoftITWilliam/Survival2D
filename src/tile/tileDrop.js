import { rng } from "../misc/util.js";
import { TileInstance } from "./tileInstance.js";

// This should be converted into a general drop class later, so that it for example could be used for entity drops.
export class TileDrop {
    /**
     * @param {TileInstance} tile Pointer to parent tile
     * @param {string} itemName Registry name of dropped item. ex. "coal"
     * @param {any} amount If static, give number (ex. 1), if range, give array with min/max amount (ex. [1,3])
     * @param {boolean} increasable Whether the drop amount is affected by multipliers
     * @param {boolean} toolRequired Whether or not a tool is required to drop the item
     */
    constructor(tile,itemName,amount,chance,increasable,requireTool) {
        this.tile = tile;
        this.game = tile.world.game;
        this.itemName = itemName;
        this.amount = amount;
        this.chance = chance;
        this.increasable = increasable;
        this.requireTool = requireTool;
    }

    validTool(toolType, miningLevel) {
        return (!toolType || !miningLevel ||
            toolType != this.tile.getToolType() ||
            miningLevel < this.tile.getMiningLevel())
    }

    roll(toolType, miningLevel, multiplier) {

        // !! Currently doesn't support gathering multipliers

        if(!multiplier) {
            multiplier = 1;
        }

        if (this.requireTool && this.validTool(toolType, miningLevel)) {
            return null;
        }

        let dropRNG = rng(1,100);
        if(dropRNG * multiplier > this.chance){
            return null;
        }

        let dropAmount;
        if(Array.isArray(this.amount)) {
            dropAmount = rng(this.amount[0],this.amount[1]);
        } 

        let item = this.game.itemRegistry.get(this.itemName);
        return {item: item, amount: dropAmount}
    }
}

/** 
 * SelfDrop
 * On roll, return *one* item of the same type as the tile, guarranteed. Not affected by multipliers.
 * Use on tiles that drop themselves (dirt, etc.)
*/
export class SelfDrop extends TileDrop {
    constructor(tile, requireTool) {
        super(tile, tile.registryName, 1, 100, false, requireTool);
    }

    roll(toolType, miningLevel) {
        if (this.requireTool && this.validTool(toolType, miningLevel)) {
            return null;
        }

        let item = this.game.itemRegistry.get(this.itemName);
        return {item: item, amount: this.amount}
    }
}