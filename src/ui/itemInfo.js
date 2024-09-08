import { InputHandler } from "../game/InputHandler.js";
import { getLang } from "../game/lang.js";
import { sprites } from "../graphics/assets.js";
import { rgb } from "../helper/canvashelper.js";
import { clamp } from "../helper/helper.js";
import Item from "../item/item.js";
import { PLAYER_DEFAULT_REACH } from "../player/player.js";

export const ItemInfoDisplay = {
    $: $('.item-info'),
    $name: $('.item-info-name'),
    $rarity: $('.item-info-rarity'),
    $description: $('.item-info-description'),

    $attributes: $('.item-info-attributes'),
    $icon: $('.item-info-icon'),

    isShowing: false,

    /**
     * Show information about an item
     * @param {Item} item 
     */
    show(item) {
        console.assert(Item.isItem(item));

        this.isShowing = true;
        this.$.toggleClass('d-none', false);

        this.$name.text(item.displayName);
        this.$description.text(item.description);
        this.$rarity.text(item.rarityText);
        this.setRarityClass(item.rarity);

        this.$attributes.empty();

        if(item.placeable) {
            this.addAttribute('placeable');
        }

        if(item.type === Item.types.TOOL) {
            this.addAttribute('tier', item.miningLevel);
            this.addAttribute('toolSpeed', item.miningSpeed);
            this.addAttribute('toolReach', item.reach);
        }

        const icon = this.getItemIcon(item);

        this.$icon.toggleClass('d-none', icon == null);
        if(icon) {
            this.$icon.attr('src', icon.src);
        }
    },

    /**
     * Hide item information window
     */
    hide() {
        this.isShowing = false;
        this.$.toggleClass('d-none', true);
    },

    setRarityClass(rarity) {
        this.$.toggleClass('rarity-common', rarity === 0);
        this.$.toggleClass('rarity-uncommon', rarity === 1);
        this.$.toggleClass('rarity-rare', rarity === 2);
        this.$.toggleClass('rarity-epic', rarity === 3);
        this.$.toggleClass('rarity-legendary', rarity === 4);
        this.$.toggleClass('rarity-unobtainable', rarity === 99);
    },

    addAttribute(attribute, value) {

        var add = ({ label, value }) => {
            const $row = $('<div>').addClass('row');
            $row.append($('<p>').text(label));
            $row.append($('<p>').text(value));
            this.$attributes.append($row);
        }
        
        switch(attribute) {
            case 'placeable':
                add({ 
                    label: getLang('item_info_placeable'), 
                    value: "" }); 
                break;
            case "tier":
                add({ 
                    label: getLang('item_info_tier'), 
                    value: value }); 
                break;
            case 'toolSpeed':
                add({ 
                    label: getLang('item_info_tool_speed'), 
                    value: `${value * 100}%` }); 
                break;
            case 'toolReach':
                add({ 
                    label: getLang('item_info_tool_reach'), 
                    value: `+${value - PLAYER_DEFAULT_REACH} ${getLang('item_info_tiles')}`, }); 
                break;
        }
    },

    /**
     * Information window follows mouse
     * @param {InputHandler} input 
     */
    realignWithMouse(input) {

        let x = input.mouse.x + 4; // some margin to not screw with other hover effects
        let y = input.mouse.y + 4;
        let h = this.$.height();

        y = clamp(y, 0, $('#canvas').height() - 16 - h);

        this.$.css('top', y); 
        this.$.css('left', x);
    },

    getItemIcon(item) {
        const icons = sprites.ui.item_type;

        if(item.type === Item.types.TOOL) {
            switch(item.toolType) {
                case Item.toolTypes.PICKAXE: return icons.icon_pickaxe;
                case Item.toolTypes.AXE:     return icons.icon_axe;
                case Item.toolTypes.SHOVEL:  return icons.icon_shovel;
                case Item.toolTypes.HAMMER:  return icons.icon_hammer;
            }
        }
        else if(item.type === Item.types.TILE) {
            return icons.icon_tile;
        }
        return null;
    }
}