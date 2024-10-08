import { World } from "../world/World.js";
import ItemEntityManager from "../item/itemEntityManager.js";
import { Player } from "../player/player.js";
import { RecipeManager } from "../crafting/RecipeManager.js";
import FPSCounter from "../graphics/FPScounter.js";
import { InputHandler } from "./InputHandler.js";
import { Testing } from "../tests/testing.js";
import PlacementPreview from "../ui/placementPreview.js";
import { Observable } from "../class/Observable.js";
import { PickupLabelManager } from "../ui/PickupLabelManager.js";
import { GUIRenderer } from "../graphics/guiRenderer.js";
import render from "../graphics/render.js";
import { ItemInfoDisplay } from "../ui/itemInfo.js";

export class Game {
    deltaTime = 0;
    fpsCounter = new FPSCounter();
    gameUpdateSubject = new Observable();

    constructor() {
        this.world = new World(this, 128, 128);
        this.itemEntities = new ItemEntityManager(this);
        this.recipeManager = new RecipeManager(this);
        this.input = new InputHandler(this);
        this.player = new Player(this);
        this.guiRenderer = new GUIRenderer(this);
        this.testing = new Testing(this);

        // Create pickup label manager and subscribe it to its necessary events
        const labelManager = new PickupLabelManager();
        this.gameUpdateSubject.subscribe(args => labelManager.update(args));
        this.player.itemPickupSubject.subscribe(args => labelManager.add(args));
        this.player.uiRenderSubject.subscribe(args => labelManager.render(args));

        this.fpsCounter.displayUpdated.subscribe(value => this.debugInfo.updateRow('fps', value));

        this.player.inventory.interface.slotHoverSubject.subscribe(({ x, y, stack}) => {
            if(stack) {
                ItemInfoDisplay.show(stack.item);
            }
        });
        this.player.inventory.interface.slotHoverOutSubject.subscribe(() => {
            ItemInfoDisplay.hide();
        });
    }

    get debugInfo() {
        return this.guiRenderer.debugInfo;
    }
 
    update(deltaTime) {
        this.deltaTime = deltaTime;
        if(deltaTime > 100) return;

        document.body.style.cursor = "default";

        this.gameUpdateSubject.notify({ deltaTime, input: this.input });

        this.world.tickCounter(deltaTime);
        this.fpsCounter.increment();
        this.player.update(deltaTime, this.input);
        this.player.craftingMenu.ui.update();
       
        PlacementPreview.updateAlpha(deltaTime);

        this.world.itemEntities.update(deltaTime, this.world);
        this.world.itemEntities.updatePickup(this.player);
        this.world.lighting.update();

        if (ItemInfoDisplay.isShowing) {
            ItemInfoDisplay.realignWithMouse(this.input);
        }
    }

    render(ctx) {
        render(ctx, this);
    }
}