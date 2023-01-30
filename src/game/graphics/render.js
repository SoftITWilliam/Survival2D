
// FIXED IMPORTS:
import { drawStatBar } from './ui.js';
import { ctx, canvas, DRAWDIST, DRAW_LIGHTING, DEBUG_MODE } from '../global.js';
import { calculateDistance, clamp, setAttributes } from '../../misc/util.js';
import { drawDebugUI } from './debug.js';

export default function render(game,player) {
    ctx.save();
    ctx.translate(-player.camera.getX(),-player.camera.getY());
    ctx.clearRect(player.camera.getX(),player.camera.getY(),canvas.width,canvas.height);

    // Background
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(player.camera.getX(),player.camera.getY(),canvas.width,canvas.height);

    // Wall Tiles

    let gX = clamp(player.gridX, DRAWDIST.x, game.world.width - DRAWDIST.x);
    let gY = clamp(player.gridY, DRAWDIST.y, game.world.height - DRAWDIST.y);

    // If player is near the edge of the map, render all tiles on screen instead of within a radius.
    // Only tiles on screen are drawn
    // This is a *very* major optimization!
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x + 1 ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y + 1 ; y++) {
            if(game.world.outOfBounds(x,y)) {
                continue;
            }

            let wall = game.world.wallGrid[x][y];
            if(wall) {
                wall.draw();
            }
            
            let tile = game.world.getTile(x,y);
            if(tile) {
                tile.draw();
            }
        }
    }
    
    // Player
    player.draw();
    if(player.miningEvent) {
        player.miningEvent.drawProgress();
    }

    // Item entities
    game.itemEntities.drawAll();

    // Lighting
    if(DRAW_LIGHTING) {  
        game.world.lighting.draw(gX,gY);
    }

    player.drawPlacementPreview(game.input);

    // Tile hover effect
    drawHoverEffect(game,game.input);

    // UI
    drawStatBar("health",player.health.max,player.health.current,"rgb(220,60,50)",16,player);
    //drawStatBar("hunger",player.hunger.max,player.hunger.current,"rgb(180,120,100)",72);
    //drawStatBar("thirst",player.thirst.max,player.thirst.current,"rgb(80,160,220)",128);

    if(player.craftingMenu.isOpen) {
        player.craftingMenu.render(player.camera.getX(),player.camera.getY(),game.input);
    } else {
        player.inventory.draw();
        player.inventory.drawItems(game.input);
        player.inventory.drawSelection(game.input);
        
        player.hotbarText.draw();
        player.pickupLabels.draw();
        player.itemInfoDisplay.draw(game.input);
    }
    
    // Debug UI
    if(DEBUG_MODE) {
        drawDebugUI(game);
    }
    ctx.restore();
}

function drawHoverEffect(game,input) {
    let tile = game.world.getTile(input.mouse.gridX,input.mouse.gridY);
    let wall = game.world.getWall(input.mouse.gridX,input.mouse.gridY);

    // Cannot interact with tiles while inventory is open
    if(game.player.inventory.view) {
        return;
    }

    // Check if player is able to interact with tile or wall using the tool they're currently holding
    let obj;
    if(tile && tile.canBeMined(game.player.heldItem)) {
        obj = tile;
    } else if(wall && wall.canBeMined(game.player.heldItem)) {
        obj = wall;
    } else {
        return;
    }

    ctx.beginPath();

    // Different look depending on if tile is in range or not
    if(calculateDistance(game.player,obj) > game.player.reach) {
        setAttributes(ctx,{lineWidth:1,strokeStyle:"rgba(255,255,255,0.25)",fillStyle:"rgba(0,0,0,0)"});
    } else {
        setAttributes(ctx,{lineWidth:3,strokeStyle:"rgba(255,255,255,0.5)",fillStyle:"rgba(255,255,255,0.05)"});
    }
    
    // Draw hover effect
    ctx.rect(obj.x,obj.y,obj.h,obj.w);
    ctx.stroke();
    ctx.fill();
}