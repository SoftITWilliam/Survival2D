import { renderPath } from '../../helper/canvashelper.js';

export function renderStatBar(ctx, barType, max, current, color, y, player) {
    let m = 8;
    let barLength = max * m;
    let barHeight = 32;
    ctx.lineWidth = 3;

    let x = player.camera.getX();
    y += player.camera.getY();

    renderPath(() => {
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.rect(x + 17, y, barLength + 6, barHeight + 6);
        ctx.stroke();
    })
    
    renderPath(() => {
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.rect(x + 20, y + 3, barLength, barHeight);
        ctx.fill();
        ctx.stroke();
    })

    renderPath(() => {
        ctx.fillStyle = color;
        ctx.fillRect(x + 22, y + 5, current * m, barHeight - 4);

        Object.assign(ctx, { fillStyle: "rgb(255,255,255)", font: "24px Font1", textAlign: "center" })
        ctx.fillText(current + "/" + max,x + 23 + barLength / 2, y + 28);
    })
}