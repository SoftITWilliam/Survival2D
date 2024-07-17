import { Game } from "../game/game.js";
import PlayerCamera from "../player/camera.js";
import { Player } from "../player/player.js";
import { DebugUI } from "../ui/debugUI.js";
import { StatBarRenderer } from "../ui/statBarRenderer.js";
import { World } from "../world/World.js";

/**
 * @typedef {object} GUIRenderContext
 * @property {CanvasRenderingContext2D} CTX
 * @property {Game} GAME
 * @property {Player} PLAYER
 * @property {PlayerCamera} CAMERA
 * @property {World} WORLD
 */

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Game} game 
 * @returns {GUIRenderContext}
 */
export const GUIRenderContext = (ctx, game) => ({
    /** @type {CanvasRenderingContext2D} */
    CTX: ctx,
    /** @type {Game} */
    GAME: game,
    /** @type {Player} */
    PLAYER: game.player,
    /** @type {PlayerCamera} */
    CAMERA: game.player.camera,
    /** @type {World} */
    WORLD: game.world,
    /** @type {InputHandler} */
    INPUT: game.input,
});

export class GUIRenderer {

    statBars = {
        /** @type {StatBarRenderer} */
        health: null
    };

    /** @type {DebugUI} */
    debugInfo;


    /** 
     * @param {Game} game
     */
    constructor(game) {

        const PLAYER = game.player;
        const INPUT = game.input;
        const WORLD = game.world;

        const hoveredTile = () => (WORLD.tiles.get(INPUT.mouse.gridX, INPUT.mouse.gridY));

        this.debugInfo = new DebugUI()
            .addInfoRow("FPS", () => game.fpsCounter.display)
            .addInfoRow("Entity Count", () => WORLD.itemEntities.count)
            .addInfoRow("Player Pos", () => ({ x: PLAYER.gridX, y: PLAYER.gridY }))
            .addInfoRow("Player State", () => PLAYER.state.name)
            .addInfoRow("Mouse Pos", () => ({ x: INPUT.mouse.gridX, y: INPUT.mouse.gridY }))
            .addInfoRow("Tile Type", () => hoveredTile()?.registryName)
            .addInfoRow("Tile variant", () => hoveredTile()?.spriteVariantName);

        this.debugInfo.fontSizePx = 22;
        this.debugInfo.rowHeightPx = 36;

        this.statBars.health = new StatBarRenderer();
        
        Object.assign(this.statBars.health, {
            barColor: 'rgba(220, 60, 50)', offsetX: -20, offsetY: 20, width: 400
        });
    }

    /**
     * @param {UIRenderContext} context
     */
    renderStats({ CTX, PLAYER, CAMERA }) {
        this.statBars.health.render(CTX, PLAYER.health.max, PLAYER.health.value, CAMERA);
    }

    /**
     * @param {UIRenderContext} context
     */
    renderDebugInfo({ CTX, GAME }) {
        this.debugInfo.render(CTX, GAME);
    }

    render(ctx) {

    }
}