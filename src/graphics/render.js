
import { RENDER_LIGHTING, DEBUG_MODE, TILE_SIZE } from '../game/global.js';
import { Game } from '../game/game.js';
import { calculateDistance, clamp } from '../helper/helper.js';
import { rgbm } from '../helper/canvashelper.js';
import { Tile } from '../tile/Tile.js';
import { renderMiningProgress } from '../player/mining.js';
import { GUIRenderContext } from './guiRenderer.js';

/**
 * Renders everything in the game
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Game} game 
 */
export default function render(ctx, game) {

    const PLAYER = game.player;
    const CAMERA = game.player.camera;
    const GUI = game.guiRenderer;
    const WORLD = game.world;
    const INPUT = game.input;
    const GUI_CONTEXT = GUIRenderContext(ctx, game);

    ctx.save();
    ctx.translate(-CAMERA.x, -CAMERA.y);
    ctx.clearRect(CAMERA.x, CAMERA.y, CAMERA.width, CAMERA.height);

    renderSky(ctx, CAMERA);

    let vW = Math.ceil(CAMERA.width / TILE_SIZE / 2 + 1) * 2;
    let vH = Math.ceil(CAMERA.height / TILE_SIZE / 2 + 1) * 2;
    let vX = clamp(PLAYER.gridX - vW / 2, 0, WORLD.width - vW);
    let vY = clamp(PLAYER.gridY - vH / 2, 0, WORLD.height - vH);

    const visibleWalls = WORLD.walls.asArray(vX, vY, vW, vH, true);
    const visibleTiles = WORLD.tiles.asArray(vX, vY, vW, vH, true);

    // Walls
    visibleWalls.forEach(wall => wall.render(ctx));

    // Non-solid tiles
    visibleTiles.filter(tile => tile.type != Tile.types.SOLID).forEach(tile => tile.render(ctx));
    
    // Player
    PLAYER.render(ctx);

    // Solid Tiles
    visibleTiles.filter(tile => tile.type == Tile.types.SOLID).forEach(tile => tile.render(ctx));

    // Mining progress
    if(PLAYER.miningAction !== null) {
        renderMiningProgress(ctx, PLAYER.miningAction.tile, PLAYER.miningAction.progressDecimal);
    }

    PLAYER.renderPlacementPreview(ctx, INPUT);

    // Item entities
    WORLD.itemEntities.render(ctx, CAMERA, INPUT);

    // Lighting
    if(RENDER_LIGHTING) {  
        WORLD.lighting.render(ctx, CAMERA);
    }

    // Tile hover effect
    if(PLAYER.inventory2.isOpen == false) {
        renderHoverEffect(GUI_CONTEXT);
    }

    /* === Render UI === */

    GUI.renderStats(GUI_CONTEXT);

    if(PLAYER.craftingMenu.isOpen) {
        PLAYER.craftingMenu.render(ctx, CAMERA.x, CAMERA.y, INPUT);
    } else {
        PLAYER.renderUI(ctx, game.input);
        PLAYER.inventory2.render(ctx, CAMERA, INPUT);
        PLAYER.hotbarText.render(ctx, PLAYER);
        PLAYER.itemInfoDisplay.render(ctx, INPUT);
    }
    
    // Debug UI
    if(DEBUG_MODE) {
        GUI.renderDebugInfo(GUI_CONTEXT);
    }

    ctx.restore();
}

const SKY_COLOR_1 = { r: 50, g: 160, b: 215 };
const SKY_COLOR_2 = { r: 250, g: 170, b: 170 };

function renderSky(ctx, camera) {

    let brightness = 1;

    const skyGradient = ctx.createLinearGradient(0, camera.y, 0, camera.y2);
    skyGradient.addColorStop(0, rgbm(SKY_COLOR_1, brightness));
    skyGradient.addColorStop(1, rgbm(SKY_COLOR_2, brightness));

    ctx.fillStyle = skyGradient;
    ctx.fillRectObj(camera);
}

/**
 * @param {GUIRenderContext} context 
 */
function renderHoverEffect({ CTX, GAME, PLAYER, INPUT, WORLD }) {
    let tile = WORLD.tiles.get(INPUT.mouse.gridX, INPUT.mouse.gridY);
    let wall = WORLD.walls.get(INPUT.mouse.gridX, INPUT.mouse.gridY);

    // Check if player is able to interact with tile or wall using the tool they're currently holding
    let obj;
    if(tile && tile.canBeMined(PLAYER.selectedItem, WORLD)) {
        obj = tile;
    } else if(wall && wall.canBeMined(PLAYER.selectedItem, WORLD)) {
        obj = wall;
    } else {
        return;
    }

    CTX.beginPath();

    // Different look depending on if tile is in range or not
    const styling = calculateDistance(PLAYER, obj) > PLAYER.reach ?
        { lineWidth: 1, strokeStyle: "rgba(255,255,255,0.25)", fillStyle: "rgba(0,0,0,0)" } :
        { lineWidth: 3, strokeStyle: "rgba(255,255,255,0.5)", fillStyle: "rgba(255,255,255,0.05)" }

    Object.assign(CTX, styling);
    
    CTX.rectObj(obj);
    CTX.stroke();
    CTX.fill();
}