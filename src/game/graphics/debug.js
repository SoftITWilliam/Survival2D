import { setAttributes, gridXfromCoordinate, gridYfromCoordinate, disableShadow } from "../../misc/util.js";
import { ctx } from "../global.js";

export function drawDebugUI(game) {
    setAttributes(ctx,{fillStyle:"white",font:"20px Font1",textAlign:"left",
    shadowOffsetX:2,shadowOffsetY:2,shadowColor:"black",shadowBlur:5});

    let uiX = game.player.camera.getX() + canvas.width - 256;

    // FPS counter
    ctx.fillText("FPS: " + game.fpsCounter.display,uiX,game.player.camera.getY() + 32);

    // Entity Count
    ctx.fillText("Entity Count: " + game.itemEntities.entities.length,uiX,game.player.camera.getY() + 64);

    // Player info
    ctx.fillText("Player Pos: " + "X: " + gridXfromCoordinate(game.player.centerX) + ", Y: " + (gridYfromCoordinate(game.player.centerY)-1),uiX,game.player.camera.y + 96); 

    ctx.fillText("Player State: " + game.player.state.name,uiX,game.player.camera.getY() + 128)
    

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

    ctx.fillText("Tile Pos: " + t1,uiX,game.player.camera.getY() + 160); 
    ctx.fillText("Tile Type: " + t2,uiX,game.player.camera.getY() + 196); 

    disableShadow(ctx);
}