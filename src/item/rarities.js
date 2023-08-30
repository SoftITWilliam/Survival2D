
export const ITEM_RARITIES = {
    "COMMON": 0,
    "UNCOMMON": 1,
    "RARE": 2,
    "EPIC": 3,
    "LEGENDARY": 4,
    "UNOBTAINABLE": 99,
}

export const RARITY_COLORS = {};

const addRarityColor = (rarityName, rgb) => {
    let r = ITEM_RARITIES[rarityName];
    if(r) RARITY_COLORS[r] = rgb;
}

addRarityColor("COMMON", {r:240, g:240, b:240});
addRarityColor("UNCOMMON", {r:100, g:200, b:120});
addRarityColor("RARE", {r:80, g:150, b:220});
addRarityColor("EPIC", {r:170, g:110, b:255});
addRarityColor("LEGENDARY", {r:255, g:180, b:0});
addRarityColor("UNOBTAINABLE", {r:220, g:0, b:30});