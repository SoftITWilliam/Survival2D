import { image } from "./misc.js"

export const sprites = {
    
    tiles: {
        tile_dirt: image("tiles/tileset_dirt"),
        tile_stone: image("tiles/tileset_stone"),
        tile_grass: image("tiles/tileset_grass"),
    },

    items: {
        dev_pickaxe: image("items/dev_pickaxe"),
        dev_axe: image("items/dev_axe"),
        dev_hammer: image("items/dev_hammer"),
        dev_shovel: image("items/dev_shovel"),
        wood: image("items/wood"),
        branch: image("items/branch"),
        acorn: image("items/acorn"),
    },

    ui: {
        item_type: {
            icon_pickaxe: image("ui/icons/item_pickaxe"),
            icon_tile: image("ui/icons/item_tile"),
        }   
    },

    misc: {
        missing_texture: image("missing_texture"),
    }
}

export const SOUND_EFFECTS = {

}

export const SOUNDTRACK = {

}