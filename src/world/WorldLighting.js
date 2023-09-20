import { TILE_SIZE, canvas } from "../game/global.js";
import { rgba } from "../helper/canvashelper.js";
import { World } from "./World.js";

export class WorldLighting {
    /**
     * @param {World} world 
     */
    constructor(world) {

        /** @type {World} */
        this.world = world;

        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById("canvas-lighting");

        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.getContext('2d')

        this.config = {
            NATURAL_LIGHT_RADIUS: 128,
            NATURAL_LIGHT_GROWTH: 16,
            NATURAL_LIGHT_DECAY: 0.1,
            NATURAL_LIGHT_COLOR_DAY: {r:240, g:240, b:255},
            NATURAL_LIGHT_COLOR_SUNSET: {r:150, g:100, b:75},
            NATURAL_LIGHT_COLOR_NIGHT: {r:40, g:40, b:80},
            NATURAL_LIGHT_COLOR_MEXICO: {r:200, g:120, b:0},
        }
    }

    initialize() {
        this.canvas.width = this.world.width * TILE_SIZE;
        this.canvas.height = this.world.height * TILE_SIZE;

        this.reset();
        this.updateNaturalLight();
    }

    update() {
        //todo
    }

    updateNaturalLight() {
        let lightLevel = 1;
        let lightWidth = this.config.NATURAL_LIGHT_RADIUS;

        // maybe placeholder. it's not amazing but it gets the job done
        for(let x = 0; x < this.world.width; x++) {
            for(let y = this.world.height - 1; y >= 0; y--) {
                const tile = this.world.tiles.get(x, y);
                const wall = this.world.walls.get(x, y);

                if((!tile || tile.transparent) && (!wall || wall.transparent)) {
                    lightLevel = 1;
                    lightWidth = this.config.NATURAL_LIGHT_RADIUS;
                }

                if(tile && !tile.transparent) {
                    lightLevel = 0;
                }

                else if(wall && !wall.transparent) {
                    lightLevel -= this.config.NATURAL_LIGHT_DECAY;
                    lightWidth += this.config.NATURAL_LIGHT_GROWTH;
                }

                if(lightLevel > 0) {
                    this.addGridLightSource(x, y, lightWidth, 
                        this.config.NATURAL_LIGHT_COLOR_DAY, 
                        lightLevel);
                }
            }
        }
    }

    updateNonNaturalLight() {
        
    }

    reset() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addGridLightSource(gridX, gridY, radius, color, brightness) {
        let x = (gridX + 0.5) * TILE_SIZE;
        let y = (gridY + 0.5) * TILE_SIZE;
        this.addLightSource(x, y, radius, color, brightness);
    }

    addLightSource(x, y, radius, color = {r:255, g:255, b:255}, brightness = 1) {
        y = this.canvas.height - y;

        const gradient = this.ctx.createRadialGradient(x, y, radius, x, y, 16);

        gradient.addColorStop(0, rgba(color, 0));
        gradient.addColorStop(0.5, rgba(color, brightness * 0.25)); // Makes the transition between light/dark a lot more smooth
        gradient.addColorStop(1, rgba(color, brightness));

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }

    render(ctx, camera) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(this.canvas, 0, (-this.world.height + 1) * TILE_SIZE);

        /*
        ctx.globalCompositeOperation = "lighter";

        const gradient = this.ctx.createLinearGradient(camera.x, 0, camera.x2, 0);
        gradient.addColorStop(0, "rgb(50, 75, 100)");
        gradient.addColorStop(1, "black");
        ctx.fillStyle = gradient;
        ctx.fillRectObj(camera);
        */
        ctx.restore();
    }
}