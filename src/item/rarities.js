
export const ItemRarities = {
    "COMMON": 0,
    "UNCOMMON": 1,
    "RARE": 2,
    "EPIC": 3,
    "LEGENDARY": 4,
    "UNOBTAINABLE": 99,
}

export const RarityColors = {
    [ItemRarities.COMMON]: {r:240, g:240, b:240},
    [ItemRarities.UNCOMMON]: {r:100, g:200, b:120},
    [ItemRarities.RARE]: {r:80, g:150, b:220},
    [ItemRarities.EPIC]: {r:170, g:110, b:255},
    [ItemRarities.LEGENDARY]: {r:255, g:180, b:0},
    [ItemRarities.UNOBTAINABLE]: {r:220, g:0, b:30},
};