import { rng } from "../misc/util.js";

// This should be converted into a general drop class later, so that it for example could be used for entity drops.
export default class TileDrop {
    /**
     * @param {object} tile Pointer to parent tile
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

    roll(toolType, miningLevel, multiplier) {

        // !! Currently doesn't support gathering multipliers

        if(!multiplier) {
            multiplier = 1;
        }

        if (this.requireTool && (
            !toolType || !miningLevel ||
            toolType != this.tile.toolType ||
            miningLevel < this.tile.miningLevel)
        ) {
            return null;
        }

        let dropRNG = rng(1,100);
        if(dropRNG * multiplier > this.chance){
            return null;
        }

        if(Array.isArray(this.amount)) {
            this.amount = rng(this.amount[0],this.amount[1]);
        } 

        let item = this.game.itemRegistry.get(this.itemName);
        let drop = {item: item, amount: this.amount}
        return drop;
    }
}