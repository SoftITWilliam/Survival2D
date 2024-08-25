import { Grid } from "../class/Grid.js";
import { TILE_SIZE } from "../game/global.js";
import { rgba } from "../helper/canvashelper.js";
import { clamp } from "../helper/helper.js";
import { Tile } from "../tile/Tile.js";
import { World } from "./World.js";

export class LightSource {
    constructor(radius, brightness, color) {
        this.radius = radius;
        this.brightness = brightness;
        this.color = color;
    }

    sameAs(source) {
        return (source != null &&
                source.radius === this.radius && 
                source.brightness === this.brightness && 
                source.color === this.color);
    }
}

/**
 * The lighting consists of a bunch of gradient balls drawn on a secondary canvas.
 * That canvas is then drawn onto the main canvas with a 'multiply' composite operation.
 * 
 * Drawing these gradient balls onto the secondary canvas is incredibly performance heavy, 
 * so this code's primary concern is minimizing redraws.
 * 
 * I have no idea what to do when I want to implement day/night cycles. 
 * That might warrant another complete rewrite - or scrapping the whole project.
 */
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

        this.naturalLight = new Grid(this.world.width, this.world.height);
        this.artificialLight = new Grid(this.world.width, this.world.height);

        this.world.tileUpdateObservable.subscribe(({ x, y }) => {
            try {
                this.updateLightAt(x, y);
            }
            catch (error) {
                console.warn(error)
            }
        });

        // Track light changes between update() calls - and then redraw them all at once.
        this.changedLightSources = [];

        this.naturalLight.onChange.subscribe(({ x, y, value }) => {
            this.changedLightSources.push({ x, y, value });
        });

        this.artificialLight.onChange.subscribe(({ x, y, value }) => {
            this.changedLightSources.push({ x, y, value });
        });
    }

    async initialize() {
        return new Promise(async (resolve) => {
            this.canvas.width = this.world.width * TILE_SIZE;
            this.canvas.height = this.world.height * TILE_SIZE;

            this.reset(0, 0, this.canvas.width, this.canvas.height);
            
            this.updateNaturalLight();
            resolve();
        })
    }

    reset(x, y, width, height) {
        this.ctx.clearRect(x, y, width, height);
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(x, y, width, height);
    }

    update() {
        if(this.changedLightSources.length === 0)
            return;

        // area to update
        const minX = Math.min(...this.changedLightSources.map(s => s.x));
        const maxX = Math.max(...this.changedLightSources.map(s => s.x));
        const minY = Math.min(...this.changedLightSources.map(s => s.y));
        const maxY = Math.max(...this.changedLightSources.map(s => s.y));

        // Calculate necessary margin based on the tile with the highest light radius
        const radiuses = this.changedLightSources
            .map(s => s.value?.radius)
            .filter(r => typeof r == "number" && !isNaN(r));

        const maxRadius = Math.max(...radiuses);
        const margin = (isNaN(maxRadius) || maxRadius === 0) ? 2 : (Math.ceil(maxRadius / TILE_SIZE));

        console.log(`Updating light sources in ${this.changedLightSources.length} tiles`, 
                    `\nMax radius: ${maxRadius} px`, 
                    `\nMargin: ${margin} tiles`);

        // pad the area and clamp to world size
        const pos = {
            x1: clamp(minX - margin, 0, this.world.width),
            y1: clamp(maxY + margin + 1, 0, this.world.height),
            x2: clamp(maxX + margin + 1, 0, this.world.width),
            y2: clamp(minY - margin, 0, this.world.height),
        };
        // rect to clear (updated area + margin of 2 tiles)
        const rect = {
            x: pos.x1,
            y: pos.y1,
            width: pos.x2 - pos.x1,
            height: pos.y1 - pos.y2, 
        };

        // Grid coordinates => canvas coordinates
        const clipX = rect.x * TILE_SIZE;
        const clipY = this.canvas.height - (rect.y * TILE_SIZE);
        const clipWidth = rect.width * TILE_SIZE;
        const clipHeight = rect.height * TILE_SIZE;

        // reset & clip
        this.reset(clipX, clipY, clipWidth, clipHeight);
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(clipX, clipY, clipWidth, clipHeight)
        this.ctx.clip();

        // Add extra margin to the area
        rect.x -= margin;
        rect.y += margin;
        rect.width += margin * 2;
        rect.height += margin * 2;

        // Redraw all light sources within the area
        for(let x = rect.x; x < rect.x + rect.width && x < this.world.width; x++) {
            for(let y = rect.y; y > rect.y - rect.height && y >= 0; y--) {
                const naturalSource = this.naturalLight.get(x, y);
                this.drawLightSource(x, y, naturalSource);

                const artificialSource = this.artificialLight.get(x, y);
                this.drawLightSource(x, y, artificialSource);
            }
        }

        this.ctx.restore();
        this.changedLightSources = [];
    }

    // Update natural light levels in the entire grid
    updateNaturalLight() {
        for(let x = 0; x < this.world.width; x++) {
            for(let y = this.world.height - 1; y >= 0; y--) {
                this.updateLightAt(x, y);
            }
        }
    }

    updateLightAt(x, y) {

        const tile = this.world.tiles.get(x, y);
        const level = this.getNaturalLightLevel(x, y);

        if(level > 0) {
            const source = new LightSource(this.config.NATURAL_LIGHT_RADIUS, level, this.config.NATURAL_LIGHT_COLOR_DAY);
            this.setLightLevel(this.naturalLight, x, y, source);
        } 
        else {
            this.setLightLevel(this.naturalLight, x, y, null);
        }

        if(Tile.isTile(tile) && tile.emitsLight) {
            const source = tile.getLightSource();
            this.setLightLevel(this.artificialLight, x, y, source)
        } 
        else {
            this.setLightLevel(this.artificialLight, x, y, null);
        }

        if(!this.isOpaqueTile(x, y - 1) && this.isOpaqueWall(x, y - 1)) {
            this.updateLightAt(x, y - 1);
        }
    }

    // Make sure light level has actually changed before calling 'this.naturalLight.set'
    // (This is an optimization to prevent unnecessary redraws)
    setLightLevel(grid, x, y, source = null) {
        const previous = grid.get(x, y);

        if(source === null && previous !== null) {
            // Instead of removing the source, we set its brightness to 0.
            // This is dumb, but it's currently the best way to reset the whole area at once
            source = new LightSource(previous.radius, 0, previous.color);
            grid.set(x, y, source);
        }
        else if(source !== null && !source.sameAs(previous)) {
            grid.set(x, y, source);
        }
    }

    /**
     * Calculate natural brightness level at a certain tile
     * @param {number} gridX 
     * @param {number} gridY 
     * @returns {number} Brightness (0-1)
     */
    getNaturalLightLevel(gridX, gridY) {

        // Solid opaque block, no light passes through.
        if(this.isOpaqueTile(gridX, gridY))
            return 0;

        // Sky view, a 'natural' light source
        if(!this.isOpaqueWall(gridX, gridY))
            return 1;

        // Light 'dripping' effect (Decaying light levels in caves/holes)
        let decay = 0;

        for(let y = gridY + 1; y < this.world.height; y++) {
            decay += this.config.NATURAL_LIGHT_DECAY;
            if(this.isOpaqueTile(gridX, y) || decay >= 1) {
                break;
            }
            if(!this.isOpaqueWall(gridX, y)) {
                return Math.max(0, 1 - decay.toFixed(2));
            }
        }
        return 0;
    }

    /**
     * @param {number} gridX 
     * @param {number} gridY 
     * @returns {boolean}
     */
    isOpaqueTile(gridX, gridY) {
        const tile = this.world.tiles.get(gridX, gridY);
        return (tile && !tile.transparent);
    }

    /**
     * @param {number} gridX 
     * @param {number} gridY 
     * @returns {boolean}
     */
    isOpaqueWall(gridX, gridY) {
        const wall = this.world.walls.get(gridX, gridY);
        return (wall && !wall.transparent);
    }

    drawLightSource(gridX, gridY, source = null) {
        if(!source)
            return;

        let x = (gridX + 0.5) * TILE_SIZE;
        let y = this.canvas.height - ((gridY + 0.5) * TILE_SIZE);

        const gradient = this.ctx.createRadialGradient(x, y, source.radius, x, y, 16);

        gradient.addColorStop(0, rgba(source.color, 0));
        gradient.addColorStop(0.5, rgba(source.color, source.brightness * 0.25)); // Makes the transition between light/dark a lot more smooth
        gradient.addColorStop(1, rgba(source.color, source.brightness));

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - source.radius, y - source.radius, source.radius * 2, source.radius * 2)
    }

    render(ctx, camera) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.drawImage(this.canvas, 0, (-this.world.height + 1) * TILE_SIZE);
        ctx.restore();
    }
}