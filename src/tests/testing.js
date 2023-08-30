import { rng } from "../helper/helper.js";

const testAmount = 1;

export class Testing {
    constructor(game) {
        this.game = game;
        this.count = 1;
        this.results = []
    }

    run() {
        this.startTime = new Date().getTime();
        this.time = this.startTime;

        console.log("Running tests...");

        this.results.push(this.RNGinRange([1,5],true));

        console.log(`Tests finished, total time: ${new Date().getTime() - this.startTime} ms`)
        console.table(this.results);
    }

    getTestResult(test, input, expected, result) {
        return {
            test: test,
            input: input,
            expected: expected,
            result: result,
            status: (expected == result) ? "OK" : "ERROR",
        }
    }

    log(testNumber, status) {
        let testTime = new Date().getTime()
        console.log(`Test ${testNumber} of ${this.count}: ${status} (${testTime - this.time} ms)`);
        this.time = testTime;
    }

    // This is a 'test' test :)
    // input an array of 2 numbers, a minimum and a maximum. (Ex. [1,5])
    // 1000 numbers are generated. If any are outside of the range, return false
    RNGinRange(input, expected) {
        let result = true;
        for(let i = 0; i < 1000; i++) {
            let rand = rng(input[0],input[1]);
            if(rand < input[0] || rand > input[1]) {
                result = false;
            }
        }

        let status = (expected == result) ? "OK" : "ERROR";
        this.log(1, status);
        return this.getTestResult("RNGinRange", input, expected, result);
    }
}