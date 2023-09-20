
export function autoResizeCanvas(canvas) {
    updateCanvasSize(canvas);
    window.addEventListener("resize", () => updateCanvasSize(canvas));
}

// Set canvas to cover whole screen
function updateCanvasSize(canvas) {
    canvas.setAttribute("height", Math.round(window.innerHeight));
    canvas.setAttribute("width", Math.round(window.innerWidth));
}