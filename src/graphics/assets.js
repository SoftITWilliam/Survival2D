import { PATH } from "../game/global.js";

async function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image;

        const url = PATH + src + ".png";

        img.onerror = () => { 
            console.warn(`Failed to load sprite (${url})`);
            img = MISSING_TEXTURE;
        }

        img.onload = () => {
            resolve(img);
        }

        img.src = url;
    });
}

/**
 * @param {(Image | Promise<Image> | any)} image 
 * @param {Function} callbackfn 
 */
export async function getImageCallback(image, callbackfn) {
    if(image instanceof Promise) {
        image.then(result => {
            getImageCallback(result, r => callbackfn(r));
        })
    }
    else if (image instanceof Image && image.src) {
        callbackfn(image);
    }
    else {
        callbackfn(MISSING_TEXTURE);
    }
}

export const MISSING_TEXTURE = new Image;
MISSING_TEXTURE.src = "assets/missing_texture.png"; // If this fails to load, it's over.

export function isMissingTexture(img) {
    return (!img instanceof Image || img.src.includes("missing_texture"));
}

export const sprites = {
    
    tilesets: {
        dirt: loadImage("tiles/tileset_dirt"),
        dirt_wall: loadImage("tiles/tileset_dirt_wall"),
        stone: loadImage("tiles/tileset_stone"),
        stone_wall: loadImage("tiles/tileset_stone_wall"),
        grass: loadImage("tiles/tileset_grass"),
    },

    placeables: {
        sapling: loadImage("tiles/sapling"),
        cloth_plant: loadImage("tiles/cloth_plant"),
    },

    items: {
        dev_pickaxe: loadImage("items/dev_pickaxe"),
        dev_axe: loadImage("items/dev_axe"),
        dev_hammer: loadImage("items/dev_hammer"),
        dev_shovel: loadImage("items/dev_shovel"),
        wood: loadImage("items/wood"),
        branch: loadImage("items/branch"),
        acorn: loadImage("items/acorn"),
        grass_seeds: loadImage("items/grass_seeds"),
        plant_fiber: loadImage("items/plant_fiber"),
        cloth_seeds: loadImage("items/cloth_seeds"),
        wooden_pickaxe: loadImage("items/wooden_pickaxe"),
        wooden_axe: loadImage("items/wooden_axe"),
        wooden_shovel: loadImage("items/wooden_shovel"),
        wooden_hammer: loadImage("items/wooden_hammer"),
    },

    entities: {
        player: loadImage("entities/spritesheet_player"),
    },

    ui: {
        item_type: {
            icon_pickaxe: loadImage("ui/icons/item_pickaxe"),
            icon_axe: loadImage("ui/icons/item_axe"),
            icon_shovel: loadImage("ui/icons/item_shovel"),
            icon_hammer: loadImage("ui/icons/item_hammer"),
            icon_tile: loadImage("ui/icons/item_tile"),
        }   
    },

}

export async function loadAssets() {

    sprites.tilesets.dirt = await loadImage("tiles/tileset_dirt");
    sprites.tilesets.dirt_wall = await loadImage("tiles/tileset_dirt_wall");
    sprites.tilesets.stone = await loadImage("tiles/tileset_stone");
    sprites.tilesets.stone_wall = await loadImage("tiles/tileset_stone_wall");
    sprites.tilesets.grass = await loadImage("tiles/tileset_grass");

    sprites.placeables.sapling = await loadImage("tiles/sapling");
    sprites.placeables.cloth_plant = await loadImage("tiles/cloth_plant");

    
    sprites.items.dev_pickaxe = await loadImage("items/dev_pickaxe");
    sprites.items.dev_axe = await loadImage("items/dev_axe");
    sprites.items.dev_hammer = await loadImage("items/dev_hammer");
    sprites.items.dev_shovel = await loadImage("items/dev_shovel");
    sprites.items.wood = await loadImage("items/wood");
    sprites.items.branch = await loadImage("items/branch");
    sprites.items.acorn = await loadImage("items/acorn");
    sprites.items.grass_seeds = await loadImage("items/grass_seeds");
    sprites.items.plant_fiber = await loadImage("items/plant_fiber");
    sprites.items.cloth_seeds = await loadImage("items/cloth_seeds");
    sprites.items.wooden_pickaxe = await loadImage("items/wooden_pickaxe");
    sprites.items.wooden_axe = await loadImage("items/wooden_axe");
    sprites.items.wooden_shovel = await loadImage("items/wooden_shovel");
    sprites.items.wooden_hammer = await loadImage("items/wooden_hammer");

    sprites.ui.item_type.icon_pickaxe = await loadImage("ui/icons/item_pickaxe");
    sprites.ui.item_type.icon_axe = await loadImage("ui/icons/item_axe");
    sprites.ui.item_type.icon_shovel = await loadImage("ui/icons/item_shovel");
    sprites.ui.item_type.icon_hammer = await loadImage("ui/icons/item_hammer");
    sprites.ui.item_type.icon_tile = await loadImage("ui/icons/item_tile");
}

export const SOUND_EFFECTS = {

}

export const SOUNDTRACK = {

}