import { ToolBase } from "./toolBase.js";

export class AxeBase extends ToolBase {
    constructor(game,registryName,miningLevel,miningSpeed,reach,rarity) {
        super(game,registryName,miningLevel,miningSpeed,reach,rarity);
        this.toolType = 'axe';
    }
}