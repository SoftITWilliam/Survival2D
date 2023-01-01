
export function getDisplayName(regName) {
    let displayName = getLang(regName);
    return displayName ? displayName : "item."+regName;
}

export function getDescription(regName) {
    return getLang(regName + "_description");
}

export function getLang(text) {
    let txt = LANG[SELECTED_LANGUAGE][text];
    return txt ? txt : "";
}

export const SELECTED_LANGUAGE = "eng";

export const LANG = {
    eng: {
        univ_yes: "Yes",
        univ_no: "No",

        tile_dirt: "Dirt",
        dirt: "Dirt",

        tile_stone: "Stone",
        stone: "Stone",

        // Items
        dev_pickaxe: "Developer Pickaxe",
        dev_axe: "Developer Axe",
        dev_hammer: "Developer Hammer",
        dev_shovel: "Developer Shovel",
        wood: "Wood",
        branch: "Branch",
        acorn: "Acorn",

        // Item descriptions
        dev_pickaxe_description: "This item is for testing purposes only",
        dev_axe_description: "This item is for testing purposes only",
        dev_shovel_description: "This item is for testing purposes only",
        dev_hammer_description: "This item is for testing purposes only",
        wood_description: "A very abundant and useful material",
        branch_description: "A branch from a tree",
        acorn_description: "Plant into dirt and watch it grow into a tree.",

        // Rarities
        rarity_0: "Common",
        rarity_1: "Uncommon",
        rarity_2: "Rare",
        rarity_3: "Epic",
        rarity_4: "Legendary",
        rarity_99: "Unobtainable",

        item_info_placeable: "Can be placed",
        item_info_tier: "Tier",
        item_info_tool_speed: "Speed",
        item_info_tool_reach: "Reach",
        item_info_tiles: "tiles",
    },

    swe: {
        tile_dirt: "Jord",
        dirt: "Jord",
        
        tile_stone: "Sten",
        stone: "Sten",

        // Items
        dev_pickaxe: "Utvecklarhacka",
        dev_axe: "Utvecklaryxa",
        dev_hammer: "Utvecklarhammare",
        dev_shovel: "Utvecklarspade",
        wood: "Trä",
        branch: "Gren",
        acorn: "Ekollon",

        // Item descriptions
        dev_pickaxe_description: "Det här föremålet är enbart för teständamål",
        dev_axe_description: "Det här föremålet är enbart för teständamål",
        dev_shovel_description: "Det här föremålet är enbart för teständamål",
        dev_hammer_description: "Det här föremålet är enbart för teständamål",
        wood_description: "Ett väldigt rikligt och användbart material",
        branch_description: "En gren från ett träd",
        acorn_description: "Plantera i jord och se den växa till ett träd",

        // Rarities
        rarity_0: "Vanlig",
        rarity_1: "Ovanlig",
        rarity_2: "Sällsynt",
        rarity_3: "Episk",
        rarity_4: "Legendarisk",
        rarity_99: "Otillgänglig",

        item_info_placeable: "Kan placeras",
        item_info_tier: "Nivå",
        item_info_tool_speed: "Hastighet",
        item_info_tool_reach: "Räckvidd",
        item_info_tiles: "rutor",
    }
}