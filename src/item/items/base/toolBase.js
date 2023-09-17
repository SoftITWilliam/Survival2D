import { ToolModule } from "../../../components/ToolModule.js";
import { sprites } from "../../../graphics/assets.js";
import Item from "../../item.js";

export class ToolBase extends Item {
    constructor(registryName, rarity, module = null) {
        super(registryName, rarity);
        this.type = Item.types.TOOL;

        this.setSprite(sprites.items[this.registryName]);

        this.entitySize = 32;
        this.placeable = false;
        this.stackLimit = 1;

        this._module = null;

        if(module !== null) {
            this.addToolModule(module);
        }
    }

    /**
     * The Tool Module contains tool type and stats
     * @param {ToolModule} module
     */
    addToolModule(module) {
        if(module instanceof ToolModule) {
            this._module = module;
        }
        return this;
    }

    get toolType() { return this._module.toolType }

    get miningLevel() { return this._module.miningLevel }

    get miningSpeed() { return this._module.miningSpeed }
    
    get reach() { return this._module.tileReach }

    isToolType(type) {
        return this.toolType === type;
    }
}