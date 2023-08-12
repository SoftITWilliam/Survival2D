import toolTypes from "../../toolTypesEnum.js";
import { ToolBase } from "./toolBase.js";

export class PickaxeBase extends ToolBase {
    constructor(game, registryName, miningLevel, miningSpeed, reach, rarity) {
        super(game, registryName, miningLevel, miningSpeed, reach, rarity);
        this.toolType = toolTypes.PICKAXE;
    }
}