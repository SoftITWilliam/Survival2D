


let fpsCounter = 0;

export let fpsDisplay = 0;

export function incrementFPS() {
    fpsCounter += 1;
}

function updateFPSdisplay() {
    fpsDisplay = fpsCounter;
    fpsCounter = 0;
}

let fpsInterval = setInterval(updateFPSdisplay,1000);