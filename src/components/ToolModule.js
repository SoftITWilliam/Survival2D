
export class ToolModule {
    constructor(toolType, miningLevel, miningSpeed, tileReach) {
        this._tooltype;
        this._mininglevel;
        this._miningspeed;
        this._tilereach;

        this.toolType = toolType;
        this.miningLevel = miningLevel;
        this.miningSpeed = miningSpeed;
        this.tileReach = tileReach;
    }

    // ================
    //    PROPERTIES
    // ================

    // TOOL TYPE

    get toolType() { 
        return this._tooltype ?? 0;
    }

    set toolType(type) {
        if(!type) {
            console.warn("Invalid tool type!");
        } else {
            this._tooltype = type;
        }
    }

    // MINING LEVEL

    get miningLevel() { 
        return this._mininglevel ?? 1;
    }

    /**
     * @param {number} level If the tool has a higher mining level than what is required for a tile, it can be mined.
     */
    set miningLevel(level) {
        if(typeof level == "number") 
            this._mininglevel = level;
    }

    // MINING SPEED

    get miningSpeed() {
        return this._miningspeed ?? 1;
    }

    set miningSpeed(speed) {
        if(typeof speed == "number") 
            this._miningspeed = speed;
    }

    // TILE REACH

    get tileReach() {
        return this._tilereach ?? null;
    }

    set tileReach(reach) {
        if(typeof reach == "number") 
            this._tilereach = reach;
    }

    // ================
    //    METHODS
    // ================

    // nothing here yet
}
