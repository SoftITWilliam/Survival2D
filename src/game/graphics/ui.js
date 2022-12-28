
import { canvas, ctx } from '../const.js';
import { player } from '../../player/player.js';
import { limitCameraX, setAttributes } from '../../misc/util.js';

export function drawStatBar(barType,max,current,color,y) {
    let m = 8;
    let barLength = max * m;
    let barHeight = 32;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.rect(limitCameraX(player.cameraX) + 17, player.cameraY + y, barLength + 6,barHeight + 6);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.rect(limitCameraX(player.cameraX) + 20, player.cameraY + y + 3, barLength, barHeight);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(limitCameraX(player.cameraX) + 22, player.cameraY + y + 5, current * m, barHeight-4);

    setAttributes(ctx,{fillStyle:"rgb(255,255,255)",font:"24px Font1",textAlign:"center"});
    ctx.fillText(current + "/" + max,limitCameraX(player.cameraX) + 23 + barLength / 2, player.cameraY + y + 28);
}