import { World } from "../world/World.js";
import ItemEntityManager from "../item/itemEntityManager.js";
import { Player } from "../player/player.js";
import { RecipeManager } from "../crafting/RecipeManager.js";
import FPSCounter from "../graphics/FPScounter.js";
import { InputHandler } from "./InputHandler.js";
import { Testing } from "../tests/testing.js";
import PlacementPreview from "../ui/placementPreview.js";
import { DebugUI } from "../ui/debugUI.js";
import { Observable } from "../class/Observable.js";
import { PickupLabelManager } from "../ui/PickupLabelManager.js";

export class Game {
    deltaTime = 0;
    #fpsCounter = new FPSCounter();
    gameUpdateSubject = new Observable();

    constructor() {
        this.world = new World(this, 128, 128);
        this.itemEntities = new ItemEntityManager(this);
        this.recipeManager = new RecipeManager(this);
        this.input = new InputHandler(this);
        this.player = new Player(this);

        // Create pickup label manager and subscribe it to its necessary events
        const labelManager = new PickupLabelManager();
        this.gameUpdateSubject.subscribe(args => labelManager.update(args));
        this.player.itemPickupSubject.subscribe(args => labelManager.add(args));
        this.player.uiRenderSubject.subscribe(args => labelManager.render(args));

        this.testing = new Testing(this);

        const hoveredTile = () => (
            this.world.tiles.get(this.input.mouse.gridX, this.input.mouse.gridY)
        );

        this.debugUI = new DebugUI()
            .addInfoRow("FPS", () => this.#fpsCounter.display)
            .addInfoRow("Entity Count", () => this.world.itemEntities.count)
            .addInfoRow("Player Pos", () => ({ x: this.player.gridX, y: this.player.gridY }))
            .addInfoRow("Player State", () => this.player.state.name)
            .addInfoRow("Mouse Pos", () => ({ x: this.input.mouse.gridX, y: this.input.mouse.gridY }))
            .addInfoRow("Tile Type", () => hoveredTile()?.registryName)
            .addInfoRow("Tile variant", () => hoveredTile()?.spriteVariantName);

        this.debugUI.fontSizePx = 22;
        this.debugUI.rowHeightPx = 36;
    }

    update(deltaTime) {
        this.deltaTime = deltaTime;
        if(deltaTime > 500) return;

        document.body.style.cursor = "default";

        this.gameUpdateSubject.notify({ deltaTime, input: this.input });

        this.world.tickCounter();
        this.#fpsCounter.increment();
        this.player.update(deltaTime, this.input);
        this.player.craftingMenu.ui.update();
       
        PlacementPreview.updateAlpha(deltaTime);

        this.world.itemEntities.update(deltaTime, this.world);
        this.world.itemEntities.updatePickup(this.player);
    }
}