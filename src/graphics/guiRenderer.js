import { Game } from "../game/game.js";
import { DEBUG_MODE } from "../game/global.js";
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

    debugInfo = new DebugUI();

    /** 
     * @param {Game} game
     */
    constructor(game) {
        const PLAYER = game.player;
        const INPUT = game.input;
        const WORLD = game.world;
        const FPS = game.fpsCounter;
        if(DEBUG_MODE) {
            this.debugInfo
                .addInfoRow('fps',          'FPS')
                .addInfoRow('ent_count',    'Entity Count')
                .addInfoRow('player_pos',   'Player Pos')
                .addInfoRow('player_state', 'Player State')
                .addInfoRow('mouse_pos',    'Mouse Pos')
                .addInfoRow('tile_type',    'Tile Type')
                .addInfoRow('tile_variant', 'Tile variant');

            const updateRow = (id, value) => this.debugInfo.updateRow(id, value);

            updateRow('ent_count', 0);

            // Info is updated using events, for performance reasons.
            // Updating all rows every frame caused framerate issues.
            FPS.displayUpdated.subscribe(value => updateRow('fps', value));
            PLAYER.stateChangedSubject.subscribe(state => updateRow('player_state', state.name));
            PLAYER.gridPositionChangedSubject.subscribe(pos => updateRow('player_pos', { x: pos.gridX,  y: pos.gridY }));
            WORLD.itemEntities.entityCountChanged.subscribe(n => updateRow('ent_count', n));
            INPUT.mouseGridPositionChanged.subscribe(pos => {
                const tile = WORLD.tiles.get(pos.x, pos.y);
                updateRow('mouse_pos', pos);
                updateRow('tile_type', tile?.registryName);
                updateRow('tile_variant', tile?.spriteVariantName);
            });
        }

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
        this.debugInfo.render();
    }

    render(ctx) {

    }
}