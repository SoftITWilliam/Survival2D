import { rng } from "../helper/helper.js";
import Item from "../item/item.js";

// This should be converted into a general drop class later, so that it for example could be used for entity drops.
export class TileDrop {
    /**
     * @param {Item} item Dropped item
     * @param {number} amount How many items should drop
     * @param {number} maxAmount Leave blank for static amount
     */
    constructor(item, amount = 1, maxAmount = null) {
        this._item = item;
        this._amount = maxAmount ? [amount, maxAmount] : amount;
        this._chance = 100;
        this._increasable = false;
        this._requiresTool = false;
    }

    requireTool() {
        this._requiresTool = true;
        return this;
    }

    chance(percent) {
        this._chance = percent;
        return this;
    }

    affectedByMultipliers() {
        this._increasable = true;
        return this;
    }

    static #isValidTool(tile, toolType, miningLevel) {
        return (
            toolType && miningLevel &&
            toolType == tile.getToolType() ||
            miningLevel >= tile.getMiningLevel()
        );
    }

    roll(tile, toolType, miningLevel, multiplier) {

        // !! Currently doesn't support gathering multipliers
        multiplier ??= 1;

        if (this._requiresTool && !TileDrop.#isValidTool(tile, toolType, miningLevel)) return null;

        let dropRNG = rng(1, 100);
        if(dropRNG * multiplier > this._chance) return null;

        let dropAmount;
        if(Array.isArray(this._amount)) {
            dropAmount = rng(this._amount[0], this._amount[1]);
        } else {
            dropAmount = this._amount;
        }

        return {item: this._item, amount: dropAmount}
    }
}