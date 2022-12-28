import * as item from './itemParent.js';

// Link item ID and Registry Name
const ID_NAME_LINK = [
    {id:1,registryName:"dirt"},
    {id:2,registryName:"stone"},
    {id:3,registryName:"dev_pickaxe"},
    {id:4,registryName:"dev_shovel"},
    {id:5,registryName:"dev_axe"},
    {id:6,registryName:"dev_hammer"},
    {id:7,registryName:"wood"},
    {id:8,registryName:"branch"},
    {id:9,registryName:"acorn"},
]

// List of all items in the game
export const ITEM_REGISTRY = {
    dirt: new item.Dirt(),
    stone: new item.Stone(),
    dev_pickaxe: new item.DevPickaxe(),
    dev_axe: new item.DevAxe(),
    dev_shovel: new item.DevShovel(),
    dev_hammer: new item.DevHammer(),
    wood: new item.Wood(),
    branch: new item.Branch(),
    acorn: new item.Acorn(),
}

// Make sure all items have their essential properties. Throw an error if not.
export function validateItems() {
    for (var i in ITEM_REGISTRY) {
        console.log(ITEM_REGISTRY[i]);
        if(!ITEM_REGISTRY[i].id || !ITEM_REGISTRY[i].registryName || ITEM_REGISTRY[i].rarity === undefined) {
            throw new Error("One or more items have invalid properties!");
        }
    }
}

export function getItemRegistryName(id) {
    for(let i=0;i<ID_NAME_LINK.length;i++) {
        if(ID_NAME_LINK[i].id == id) {
            return ID_NAME_LINK[i].registryName;
        }
    }
    return false;
}

export function getItemID(registryName) {
    for(let i=0;i<ID_NAME_LINK.length;i++) {
        if(ID_NAME_LINK[i].registryName == registryName) {
            return ID_NAME_LINK[i].id;
        }
    }
    return false;
}