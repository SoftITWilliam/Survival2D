
import { canvas, RENDER_LIGHTING, DEBUG_MODE, TILE_SIZE } from '../game/global.js';
import { Game } from '../game/game.js';
import { calculateDistance, clamp } from '../helper/helper.js';
import { rgbm } from '../helper/canvashelper.js';
import { Tile } from '../tile/Tile.js';
import { Player } from '../player/player.js';
import { renderMiningProgress } from '../player/mining.js';
import { StatBarRenderer } from '../player/statBar.js';

/**
 * Renders everything in the game
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Game} game 
 * @param {Player} player 
 */
export default function render(ctx, game, player) {

    const CAMERA = player.camera;

    ctx.save();
    ctx.translate(-CAMERA.x, -CAMERA.y);
    ctx.clearRect(CAMERA.x, CAMERA.y, CAMERA.width, CAMERA.height);

    renderSky(ctx, CAMERA);

    let vW = Math.ceil(CAMERA.width / TILE_SIZE / 2 + 1) * 2;
    let vH = Math.ceil(CAMERA.height / TILE_SIZE / 2 + 1) * 2;
    let vX = clamp(player.gridX - vW / 2, 0, game.world.width - vW);
    let vY = clamp(player.gridY - vH / 2, 0, game.world.height - vH);

    const visibleWalls = game.world.walls.asArray(vX, vY, vW, vH, true);
    const visibleTiles = game.world.tiles.asArray(vX, vY, vW, vH, true);

    // Walls
    visibleWalls.forEach(wall => wall.render(ctx));

    // Non-solid tiles
    visibleTiles.filter(tile => tile.type != Tile.types.SOLID).forEach(tile => tile.render(ctx));
    
    // Player
    player.render(ctx);

    // Solid Tiles
    visibleTiles.filter(tile => tile.type == Tile.types.SOLID).forEach(tile => tile.render(ctx));

    // Mining progress
    if(player.miningAction !== null) {
        renderMiningProgress(ctx, player.miningAction.tile, player.miningAction.progressDecimal);
    }

    player.renderPlacementPreview(ctx, game.input);

    // Item entities
    game.world.itemEntities.render(ctx, CAMERA, game.input);

    // Lighting
    if(RENDER_LIGHTING) {  
        game.world.lighting.render(ctx, CAMERA);
    }

    // Tile hover effect
    if(player.inventory2.isOpen == false) {
        renderHoverEffect(ctx, game, game.input);
    }

    /* === Render UI === */

    player.health.renderer.barColor = 'rgba(220, 60, 50)';
    player.health.renderer.offsetX = -20;
    player.health.renderer.offsetY = 20;
    player.health.renderer.width = 400;
    player.health.renderer.render(ctx, player.health.max, player.health.value, CAMERA);

    if(player.craftingMenu.isOpen) {
        player.craftingMenu.render(ctx, CAMERA.x, CAMERA.y, game.input);
    } else {
        player.renderUI(ctx, game.input);

        player.inventory2.render(ctx, CAMERA, game.input);
        //player.inventory2.renderItems(ctx, game.input);
        //player.selectedSlot.renderSelection(ctx);
        player.hotbarText.render(ctx, player);
        player.itemInfoDisplay.render(ctx, game.input);
    }
    
    // Debug UI
    if(DEBUG_MODE) {
        game.debugUI.render(ctx, game);
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

function renderHoverEffect(ctx, game, input) {
    let tile = game.world.tiles.get(input.mouse.gridX, input.mouse.gridY);
    let wall = game.world.walls.get(input.mouse.gridX, input.mouse.gridY);

    // Check if player is able to interact with tile or wall using the tool they're currently holding
    let obj;
    if(tile && tile.canBeMined(game.player.selectedItem, game.world)) {
        obj = tile;
    } else if(wall && wall.canBeMined(game.player.selectedItem, game.world)) {
        obj = wall;
    } else {
        return;
    }

    ctx.beginPath();

    // Different look depending on if tile is in range or not
    let styling = calculateDistance(game.player,obj) > game.player.reach ?
        { lineWidth: 1, strokeStyle: "rgba(255,255,255,0.25)", fillStyle: "rgba(0,0,0,0)" } :
        { lineWidth: 3, strokeStyle: "rgba(255,255,255,0.5)", fillStyle: "rgba(255,255,255,0.05)" }

    Object.assign(ctx, styling);
    
    ctx.rectObj(obj);
    ctx.stroke();
    ctx.fill();
}