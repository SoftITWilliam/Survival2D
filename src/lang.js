
export function getDisplayName(regName) {
    let displayName = LANG[SELECTED_LANGUAGE][regName];
    return displayName ? displayName : "item."+regName;
}

export function getDescription(regName) {
    let desc = LANG[SELECTED_LANGUAGE][regName + "_description"];
    return desc ? desc : "";
}

export const SELECTED_LANGUAGE = "eng";

export const LANG = {
    eng: {
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
        dev_pickaxe_description: "This pickaxe is for testing purposes only",
        dev_axe_description: "This axe is for testing purposes only",
        dev_shovel_description: "This shovel is for testing purposes only",
        dev_hammer_description: "This hammer is for testing purposes only",
        wood_description: "A very abundant and useful material",
        branch_description: "A branch from a tree",
        acorn_description: "Plant into dirt and watch it grow into a tree.",
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
        dev_pickaxe_description: "Den här hackan är enbart för teständamål",
        dev_axe_description: "Den här yxan är enbart för teständamål",
        dev_shovel_description: "Den här spaden är enbart för teständamål",
        dev_hammer_description: "Den här hammaren är enbart för teständamål",
        wood_description: "Ett väldigt rikligt och användbart material",
        branch_description: "En gren från ett träd",
        acorn_description: "Plantera i jord och se den växa till ett träd",
    }
}