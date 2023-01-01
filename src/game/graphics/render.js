
// FIXED IMPORTS:
import { drawStatBar } from './ui.js';
import { ctx, canvas, TILE_SIZE, DRAWDIST, DRAW_LIGHTING, DEBUG_MODE } from '../global.js';
import { calculateDistance, clamp, disableShadow, gridXfromCoordinate, gridYfromCoordinate, setAttributes } from '../../misc/util.js';
import { checkToolInteraction } from '../../tile/toolInteraction.js';

export default function render(game,player) {
    ctx.save();
    ctx.translate(-player.camera.limX(),-player.camera.y);
    ctx.clearRect(player.camera.limX(),player.camera.y,canvas.width,canvas.height);

    // Background
    ctx.fillStyle = "rgb(150,180,250)";
    ctx.fillRect(player.camera.limX(),player.camera.y,canvas.width,canvas.height);

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
        for(let x = gX - DRAWDIST.x ; x < gX + DRAWDIST.x + 1 ; x++) {
            for(let y = gY - DRAWDIST.y ; y < gY + DRAWDIST.y + 1 ; y++) {

                // Cannot draw outside map
                if(game.world.outOfBounds(x,y)) {
                    continue;
                }

                // Calculate opacity based on light level
                let light = game.world.lightGrid[x][y];
                let a = clamp(1 - light.level / 15, 0, 1);

                ctx.fillStyle = "rgba(0,0,0,"+a+")";
                ctx.fillRect(x * TILE_SIZE, -y * TILE_SIZE,TILE_SIZE,TILE_SIZE);
                ctx.globalAlpha = 1;
            }
        }
    }

    player.drawPlacementPreview(game.input);

    // Tile hover effect
    drawHoverEffect(game,game.input);

    // UI
    drawStatBar("health",player.health.max,player.health.current,"rgb(220,60,50)",16,player);
    //drawStatBar("hunger",player.hunger.max,player.hunger.current,"rgb(180,120,100)",72);
    //drawStatBar("thirst",player.thirst.max,player.thirst.current,"rgb(80,160,220)",128);
    
    player.inventory.draw();
    player.inventory.drawItems(game.input);
    player.inventory.drawSelection(game.input);
    
    player.hotbarText.draw();
    player.pickupLabels.draw();
    player.itemInfoDisplay.draw(game.input);
    
    // Debug UI
    if(DEBUG_MODE) {
        setAttributes(ctx,{fillStyle:"white",font:"20px Font1",textAlign:"left",
        shadowOffsetX:2,shadowOffsetY:2,shadowColor:"black",shadowBlur:5});

        let uiX = player.camera.limX() + canvas.width - 256;

        // FPS counter
        ctx.fillText("FPS: " + game.fpsCounter.display,uiX,player.camera.y + 32);

        // Entity Count
        ctx.fillText("Entity Count: " + game.itemEntities.entities.length,uiX,player.camera.y + 64);

        // Player info
        ctx.fillText("Player Pos: " + "X: " + gridXfromCoordinate(player.centerX) + ", Y: " + (gridYfromCoordinate(player.centerY)-1),uiX,player.camera.y + 96); 

        

        // Tile info
        let tile = game.world.getTile(game.input.mouse.gridX,game.input.mouse.gridY);

        let t1,t2;

        if(tile) {
            t1 = "X " + tile.gridX + ", Y: " + tile.gridY; 
            t2 = tile.registryName;
        } else {
            t1 = null;
            t2 = null;
        }

        ctx.fillText("Tile Pos: " + t1,uiX,player.camera.y + 128); 
        ctx.fillText("Tile Type: " + t2,uiX,player.camera.y + 160); 

        disableShadow(ctx);
    }
    ctx.restore();
}

function drawHoverEffect(game,input) {


    let obj = checkToolInteraction(input.mouse.gridX,input.mouse.gridY,game.player.heldItem,game.world);

    if(!obj) {
        return;
    }

    // Cannot interact with tiles while inventory is open
    if(game.player.inventory.view) {
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