+ New feature
* Changes to existing features, bugfixes, etc.
- Removed features & reverted changes

    : Additional info
    // Notes & comments

<2023-01-25>
    + Added clickable and scrollable UI components
    * Reworked the craftable item list

<2023-01-19>
    * Working on UI Component system

<2023-01-18>
    * Working on UI Component system

<2023-01-17>
    + Crafting menu displays how many of each crafting ingredient is avalible
    * Crafting button is not avalible when player cannot afford to craft the item.

<2023-01-16>
    + Crafting menu displays item cost

<2023-01-13>
    * More work on Crafting system

<2023-01-12>
    + Crafting menu now displays avalible recipes for the selected station
    * Reworked how the player camera works
    * Camera Y is restricted to world boundaries

<2023-01-10>
    + Pressing "C" while in the inventory now opens a blank, non-functional Crafting menu

<2023-01-08>
    * Converted Lighting into a class, instead of a messy collection of functions
    * Fixed a bug where lighting updates wouldn't consider off-screen light sources

<2023-01-07>
    * More work on player states.

<2023-01-06>
    + Added a (placeholder) player sprite
    + Added player idle and running animations

<2023-01-02>
    + Added functional player states
        : 'STANDING', 'WALKING', and 'JUMPING'
    + Added 'Cheetah frames' when player falls off an edge, where the player is able to jump.

<2023-01-01>
    * All current game functions and mechanics have been made functional again.
    
<2022-12-29>
    * Continued restructuring and rewriting code. Most features are functional again.

<2022-12-28>
    + Added the ability to place tiles
    * Begun the painful process of restructuring pretty much the entire code. Fuck me.

<2022-12-20>
    + Holding a placeable item and hovering on an empty tile shows a placement preview

<2022-12-19>
    + Hovering on an item displays several additional properties
    * Added rarity names to lang system, instead of being hard coded
    * All the game's items are now validated upon launch
        : If any have invalid values (ex. no id or registry name) an error is thrown

<2022-12-14>
    * No longer displays item info on hover if the player has selected a stack

<2022-12-06>
    * Player camera no longer misaligns after colliding with the left world edge
    * Changed the way sprites are stored and accessed in the code

<2022-12-05>
    * Colors are now stored as an object, instead of a string.
    * Pickup labels now show the correct rarity color

<2022-12-02>
    + Picking up an item draws the item type and amount above the player

<2022-11-29>
    + Made inventory management slightly more simple, and improved its code
        : 'Selected stack' is no longer stored, instead you simply pick up the stack
        // Most bugs should be fixed now!
    + Hovering on an item in the inventory displays its name and rarity color
    * Fixed duplication glitch when inserting items into full stack

<2022-11-25>
    + Added inventory interaction
        : Hovering an inventory slot highlights it, and clicking it "selects" the stack
        : While a stack is selected, it is displayed at the cursor,
        : Clicking an inventory slot while a stack is selected moves the item to that stack
        // Quite buggy at the moment but working on it!
    + Added ability to split stacks
    * Did some optimization, improving average FPS significantly

<2022-11-24>
    + Putting the mouse on an item entity now displays its name and amount
        : (TODO: only show 1 when multiple items are stacked ontop of eachother)
    + Tools now have a higher reach than mining without.

<2022-11-23>
    + Tools now only highlight tiles they can harvest
    + Hammers can now mine walls
    + Axes can now chop trees
    + Harvesting the bottom of a tree harvests the rest
        : Does not get rid of the leaves as of now
    + Items now have 'display names'
        : Later on, this can support different languages (currently only has english)
    + Selecting an item will briefly show its display name
    + Added a font which looks slightly better than Arial.
    + Added new "Wood" item, which drops from trees.
    + Added 2 new items: 'Acorn' and 'Branch', which have a chance of being dropped from tree leaves.

<2022-11-18>
    * Images now preload instead of a new image object being created for every new tile.

<2022-11-17>
    - Reverted changes to tile system

<2022-11-16>
    * Slightly improved look of inventory
    * Tried to rework tile system and ended up completely breaking it

<2022-11-15>
    + Added a somewhat basic lighting effect
    + Made lighting effect update all blocks on screen when a block is changed
    + Added a "transparent" attribute to tiles and walls, 
        : A transparent tile doesn't block light and doesn't connect to other tilesets
    * The dev toolset you get when pressing X contains all tools
    * If an item is picked up and it is inserted into the selected hotbar slot, the selection is refreshed.
        // i.e. you don't have to deselect and select a tool to use its harvesting attributes
    * Fixed bug where nearby blocks werent properly updated when on right side of map

<2022-11-09>
    + Pressing X now gives you the Dev Toolset
    + Stone tiles now drop a stone item
    + Tile drops can now require the player to use the correct tool to drop the item
    + Player can no longer cross world borders, and camera stops when approaching edge
    * Switching hotbar slot resets mining progress
    * Game no longer crashes when mining a tile at the edge of the world

<2022-11-08>
    + Items carried by the player are now shown in the inventory, along with the amount.
    + Picking up an item adds it to your inventory. Respects stack limits.

<2022-11-07>
    + Items now get 'picked up' on contact
        : As of now, they don't get added to the inventory
    + Added a set of Dev tools
        : Not currently functional
    * ItemEntity is now used for all item entities, rather than every item inheriting it.
    * Improved the system to handle items
    * Started work on inventory system

<2022-11-06>
    + Tiles now spawn an Item entity when mined
        : item can not currently be picked up. only dirt drops an item as of now
    * Fixed crash bug when reaching edge of the map
    * Fixed crash when a tree tried to place leaves outside the map
    * Tree leaves no longer replace existing blocks
    * Restructured some code

<2022-11-04>
    + Blocks being mined now have a progress display
    + Added a max range for mining
    + Blocks are now highlighted when hovered

<2022-11-03>
    + Added the ability to break blocks
    * Added bottom side collision
    * Removed bug which allowed player to land on 'surfaces' while walking into a wall

<2022-11-02>
    + Added support for tile spritesheets
    + Added (placeholder) tilesets for Dirt, grass, and stone
    * Significantly optimized collision and rendering
        : can now run worlds at any size with no lag

<2022-11-01>
    + Added trees to terrain generation
    + Added dirt and stone walls

<2022-10-31>
    + Added a randomized 'surface' line to terrain generation.
    + Added dirt and grass to terrain generation
    * Touched up some UI design
    * Reworked camera code after it broke

<2022-10-28>
    + Experimented with very basic terrain generation
    - Removed test structure

<2022-10-24>
    + Added a non-functional inventory and hotbar display
    + Added health, hunger, and thirst bars.

<2022-10-12>
    + Improved leaf generation

<2022-10-11>
    + Added "structures" class, which will be used to generate dungeons, trees, etc.
    + Added a test structure
    + Added wood block
    + Added a tree structure, with random height and a leaf generating algorithm that is subject to change

<2022-10-10>
    * Started project
    + Added some basic blocks
    + Added water, with working physics
    + Added a character, with basic movement