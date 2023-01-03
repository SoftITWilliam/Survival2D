
import { ctx } from '../global.js';
import { setAttributes } from '../../misc/util.js';

export function drawStatBar(barType,max,current,color,y,player) {
    let m = 8;
    let barLength = max * m;
    let barHeight = 32;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.rect(player.camera.limX() + 17, player.camera.y + y, barLength + 6,barHeight + 6);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.rect(player.camera.limX() + 20, player.camera.y + y + 3, barLength, barHeight);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(player.camera.limX() + 22, player.camera.y + y + 5, current * m, barHeight-4);

    setAttributes(ctx,{fillStyle:"rgb(255,255,255)",font:"24px Font1",textAlign:"center"});
    ctx.fillText(current + "/" + max,player.camera.limX() + 23 + barLength / 2, player.camera.y + y + 28);
}