import { drawStatBar } from './ui.js';
import { ctx, canvas, DRAWDIST, DRAW_LIGHTING, DEBUG_MODE, TILE_SIZE } from '../global.js';
import { drawDebugUI } from './debug.js';
import { calculateDistance, clamp } from '../../helper/helper.js';
import { rgbm } from '../../helper/canvashelper.js';
import { Tile } from '../../tile/Tile.js';

export default function render(game, player) {

    let camera = player.camera;

    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height);

    renderSky(camera);

    /* === Render walls and tiles === */

    let vW = Math.ceil(canvas.width / TILE_SIZE / 2 + 1) * 2;
    let vH = Math.ceil(canvas.height / TILE_SIZE / 2 + 1) * 2;

    let vX = clamp(player.gridX - vW / 2, 0, game.world.width - vW);
    let vY = clamp(player.gridY - vH / 2, 0, game.world.height - vH);

    const visibleWalls = game.world.walls.asArray(vX, vY, vW, vH, true);
    const visibleTiles = game.world.tiles.asArray(vX, vY, vW, vH, true);

    // Walls
    visibleWalls.forEach(wall => wall.render());

    // Non-solid tiles
    visibleTiles.filter(tile => tile.type != Tile.types.SOLID).forEach(tile => tile.render());
    
    // Player
    player.draw();

    // Solid Tiles
    visibleTiles.filter(tile => tile.type == Tile.types.SOLID).forEach(tile => tile.render());

    player.miningAction?.drawProgress();
    player.drawPlacementPreview(game.input);

    // Item entities
    game.itemEntities.drawAll();

    // Lighting
    if(DRAW_LIGHTING) {  
        game.world.lighting.draw(vX, vY, vW, vH);
    }

    // Tile hover effect
    drawHoverEffect(game, game.input);

    /* === Render UI === */

    //drawStatBar("health", player.health.max, player.health.current, "rgb(220,60,50)", 16, player);
    //drawStatBar("hunger",player.hunger.max,player.hunger.current,"rgb(180,120,100)",72);
    //drawStatBar("thirst",player.thirst.max,player.thirst.current,"rgb(80,160,220)",128);

    if(player.craftingMenu.isOpen) {
        player.craftingMenu.render(player.camera.x, player.camera.y, game.input);
    } else {
        player.inventory.draw();
        player.inventory.drawItems(game.input);
        player.selectedSlot.drawSelection();
        
        player.hotbarText.draw();
        player.pickupLabels.draw();
        player.itemInfoDisplay.draw(game.input);
    }
    
    // Debug UI
    if(DEBUG_MODE) drawDebugUI(game);

    ctx.restore();
}

const SKY_COLOR_1 = { r: 50, g: 160, b: 215 };
const SKY_COLOR_2 = { r: 250, g: 170, b: 170 };

function renderSky(camera) {

    let brightness = 1;

    const skyGradient = ctx.createLinearGradient(0, camera.y, 0, camera.y2);
    skyGradient.addColorStop(0, rgbm(SKY_COLOR_1, brightness));
    skyGradient.addColorStop(1, rgbm(SKY_COLOR_2, brightness));

    ctx.fillStyle = skyGradient;
    ctx.fillRectObj(camera);
}

function drawHoverEffect(game,input) {
    let tile = game.world.tiles.get(input.mouse.gridX, input.mouse.gridY);
    let wall = game.world.walls.get(input.mouse.gridX, input.mouse.gridY);

    // Cannot interact with tiles while inventory is open
    if(game.player.inventory.view) return;

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
    
    // Draw hover effect
    ctx.rectObj(obj);
    ctx.stroke();
    ctx.fill();
}