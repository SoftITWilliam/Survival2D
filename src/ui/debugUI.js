
import { rgba } from '../helper/canvashelper.js';
import { World } from '../world/World.js';

const ROW_HEIGHT_PX = 32;
const TEXT_COLOR = { r: 255, g: 255, b: 255, a: 0.8 };

export function renderDebugUI(ctx, game) {
    Object.assign(ctx, {
        fillStyle: rgba(TEXT_COLOR), font: "20px Font1", textAlign: "left", textBaseline: "middle",
    })
    ctx.shadow("black", 5, 2, 2);

    const x = game.player.camera.x + ROW_HEIGHT_PX;
    const y = game.player.camera.y + ROW_HEIGHT_PX;

    const rows = [];

    const addInfoRow = (name, value) => rows.push({ name: name, value: value });

    addInfoRow("FPS", game.fpsCounter.display);
    addInfoRow("Entity Count", game.world.itemEntities.entities.length);

    // Player info
    addInfoRow("Player Pos", `X ${game.player.gridX}, Y ${game.player.gridY}`);
    addInfoRow("Player State", game.player.state.name);

    // Hovered tile info
    const tile = game.world.tiles.get(game.input.mouse.gridX, game.input.mouse.gridY);

    addInfoRow("Tile Pos", tile ? `X ${tile.gridX}, Y ${tile.gridY}` : null);
    addInfoRow("Tile Type", tile?.registryName);
    addInfoRow("Tile Variant", tile ? `${tile.spriteVariantName} (${tile.sheetX},${tile.sheetY}) ` : null);

    // Draw all rows
    for(let i = 0; i < rows.length; i++) {
        let val = rows[i].value;
        if(val == "") val = null;
        ctx.fillText(`${rows[i].name}: ${val ?? "-"}`, x, y + ROW_HEIGHT_PX * i);
    }

    ctx.shadow();
}