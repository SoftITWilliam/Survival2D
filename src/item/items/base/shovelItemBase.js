import toolTypes from "../../toolTypesEnum.js";
import { ToolBase } from "./toolBase.js";

export class ShovelBase extends ToolBase {
    constructor(registryName, miningLevel, miningSpeed, reach, rarity) {
        super(registryName, miningLevel, miningSpeed, reach, rarity);
        this.toolType = toolTypes.SHOVEL;
    }
}