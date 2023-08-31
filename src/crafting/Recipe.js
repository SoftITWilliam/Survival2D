export class Recipe {
    constructor(station, inputList, output, amount) {
        this.station = station;
        
        this.output = output;
        this.outputAmount = amount;

        this.inputList = [];
        
        inputList.forEach(input => {
            this.inputList.push({ item: input[0], amount: input[1] });
        });
    }
}

export class CraftingRecipe extends Recipe {
    constructor(station, inputList, output, amount) {
        super(station, inputList, output, amount);
    }
}

// Will remain unused for now
export class ProcessingRecipe extends Recipe {
    constructor(station, inputList, output, amount, processingTime, game) {
        super(station, inputList, output, amount, game);
        this.processingTime = processingTime;
    }
}