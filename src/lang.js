
export function getDisplayName(regName) {
    let displayName = LANG[SELECTED_LANGUAGE][regName];
    return displayName ? displayName : "item."+regName;
}

export const SELECTED_LANGUAGE = "eng";

export const LANG = {
    eng: {
        tile_dirt: "Dirt",
        dirt: "Dirt",

        tile_stone: "Stone",
        stone: "Stone",

        //dev_pickaxe: "Developer Pickaxe",
        //dev_axe: "Developer Axe",
        //dev_hammer: "Developer Hammer",
        //dev_shovel: "Developer Shovel",
        wood: "Wood",
        branch: "Branch",
        acorn: "Acorn",
    },

    swe: {
        tile_dirt: "Jord",
        dirt: "Jord",
        
        tile_stone: "Sten",
        stone: "Sten",

        //dev_pickaxe: "Utvecklarhacka",
        //dev_axe: "Utvecklaryxa",
        //dev_hammer: "Utvecklarhammare",
        //dev_shovel: "Utvecklarspade",
        wood: "Trä",
        branch: "Gren",
        acorn: "Ekollon",
    }
}