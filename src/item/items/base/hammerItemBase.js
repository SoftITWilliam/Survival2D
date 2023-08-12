import toolTypes from "../../toolTypesEnum.js";
import { ToolBase } from "./toolBase.js";

export class HammerBase extends ToolBase {
    constructor(game, registryName, miningLevel, miningSpeed, reach, rarity) {
        super(game, registryName, miningLevel, miningSpeed, reach, rarity);
        this.toolType = toolTypes.HAMMER;
    }
}