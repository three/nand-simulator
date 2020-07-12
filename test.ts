import {range} from "./helpers.ts";
import {Circuit} from "./Circuit.ts";

let c = new Circuit({
    size: 32,
    nands: [
        7, 7,
        2, 2,
        1, 1,
        2, 2,
        3, 3,
        4, 4,
        5, 5,
        6, 6
    ],
    devices: [{
        type: "DEBUG_READER",
        nodes: range(8).reverse()
    }, {
        type: "CLOCK",
        period: 2,
        duty: 1,
        offset: 0,
        node: 0
    }]
})

for (let i=0;i<15;i++) {
    c.tick()
}