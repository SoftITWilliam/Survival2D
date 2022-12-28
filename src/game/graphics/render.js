
// FIXED IMPORTS:
import { player } from '../../player/player.js';
import { wallGrid } from '../../world/world.js';
import { drawStatBar } from './ui.js';
import { ctx, canvas, WORLD_HEIGHT, WORLD_WIDTH, TILE_SIZE, DRAWDIST, DRAW_LIGHTING, DEBUG_MODE } from '../const.js';
import { mouse } from '../controls.js';
import { calculateDistance, clamp, disableShadow, gridXfromCoordinate, gridYfromCoordinate, limitCameraX, setAttributes } from '../../misc/util.js';
import { getTile } from '../../tile/tile.js';
import { itemEntities } from '../../item/itemEntity.js';
import { lightGrid } from '../../world/lighting.js';
import { fpsDisplay } from './FPScounter.js';
import { checkToolInteraction } from '../../tile/toolInteraction.js';
import { hotbarText } from '../../player/hotbarText.js';
import { itemInfoDisplay } from '../../player/itemInfo.js';

export default function render() {
    ctx.save();
    ctx.translate(-limitCameraX(player.cameraX),-player.cameraY);
    ctx.clearRect(limitCameraX(player.cameraX),player.cameraY,canvas.width,canvas.height);

    // Background
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(limitCameraX(player.cameraX),player.cameraY,canvas.width,canvas.height);

    // Wall Tiles

    let gX = clamp(player.gridX, DRAWDIST.x, WORLD_WIDTH - DRAWDIST.x);
    let gY = clamp(player.gridY, DRAWDIST.y, WORLD_HEIGHT - DRAWDIST.y);

    // If player is near the edge of the map, render all tiles on screen instead of within a radius.
    // Only tiles on screen are drawn
    // This is a *very* major optimization!
    for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x + 1 ; x++) {
        for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y + 1 ; y++) {
            if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
                continue;
            }

            let wall = wallGrid[x][y];
            if(wall) {
                wall.draw();
            }
            
            let tile = getTile(x,y);
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
    for(let i=0;i<itemEntities.length;i++) {
        itemEntities[i].draw();
    }

    // Lighting
    if(DRAW_LIGHTING) {  
        for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x + 1 ; x++) {
            for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y + 1 ; y++) {

                // Cannot draw outside map
                if(x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) {
                    continue;
                }

                // Calculate opacity based on light level
                let light = lightGrid[x][y];
                let a = clamp(1 - light.level / 15, 0, 1);

                ctx.fillStyle = "rgba(0,0,0,"+a+")";
                ctx.fillRect(x * TILE_SIZE, -y * TILE_SIZE,TILE_SIZE,TILE_SIZE);
                ctx.globalAlpha = 1;
            }
        }
    }

    player.drawPlacementPreview();

    // Tile hover effect
    drawHoverEffect();

    // UI
    drawStatBar("health",player.health.max,player.health.current,"rgb(220,60,50)",16);
    //drawStatBar("hunger",player.hunger.max,player.hunger.current,"rgb(180,120,100)",72);
    //drawStatBar("thirst",player.thirst.max,player.thirst.current,"rgb(80,160,220)",128);
    
    player.inventory.draw();
    player.inventory.drawItems();
    player.inventory.drawSelection();
    
    hotbarText.draw();
    player.pickupLabels.draw();
    itemInfoDisplay.draw();
    
    // Debug UI
    if(DEBUG_MODE) {
        setAttributes(ctx,{fillStyle:"white",font:"20px Font1",textAlign:"left",
        shadowOffsetX:2,shadowOffsetY:2,shadowColor:"black",shadowBlur:5});

        let uiX = limitCameraX(player.cameraX) + canvas.width - 256;

        // FPS counter
        ctx.fillText("FPS: " + fpsDisplay,uiX,player.cameraY + 32);

        // Entity Count
        ctx.fillText("Entity Count: " + itemEntities.length,uiX,player.cameraY + 64);

        // Player info
        ctx.fillText("Player Pos: " + "X: " + gridXfromCoordinate(player.centerX) + ", Y: " + (gridYfromCoordinate(player.centerY)-1),uiX,player.cameraY + 96); 

        

        // Tile info
        let tile = getTile(mouse.gridX,mouse.gridY);

        let t1,t2;

        if(tile) {
            t1 = "X " + tile.gridX + ", Y: " + tile.gridY; 
            t2 = tile.registryName;
        } else {
            t1 = null;
            t2 = null;
        }

        ctx.fillText("Tile Pos: " + t1,uiX,player.cameraY + 128); 
        ctx.fillText("Tile Type: " + t2,uiX,player.cameraY + 160); 

        disableShadow(ctx);
    }

    

    ctx.restore();
}

function drawHoverEffect() {


    let obj = checkToolInteraction(mouse.gridX,mouse.gridY,player.heldItem);

    if(!obj) {
        return;
    }

    // Cannot interact with tiles while inventory is open
    if(player.inventory.view) {
        return;
    }

    ctx.beginPath();

    // Different look depending on if tile is in range or not
    if(calculateDistance(player,obj) > player.reach) {
        setAttributes(ctx,{lineWidth:1,strokeStyle:"rgba(255,255,255,0.25)",fillStyle:"rgba(0,0,0,0)"});
    } else {
        setAttributes(ctx,{lineWidth:3,strokeStyle:"rgba(255,255,255,0.5)",fillStyle:"rgba(255,255,255,0.05)"});
    }
    
    // Draw hover effect
    ctx.rect(obj.x,obj.y,obj.h,obj.w);
    ctx.stroke();
    ctx.fill();
}