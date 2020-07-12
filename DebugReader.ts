import { Circuit } from "./Circuit.ts";
import {DebugReaderDesc, Device} from "./types.ts";

/**
 * Print the final of a set of nodes after each tick
 */
export class DebugReader {
    circuit: Circuit;
    nodes: number[];

    constructor(circuit: Circuit, device: DebugReaderDesc) {
        this.circuit = circuit
        this.nodes = device.nodes
    }

    late() {
        let timeStr = this.circuit.time.toString(10)
        while (timeStr.length < 5) {
            timeStr = "0" + timeStr
        }

        let nodeStr = ""
        for (let node of this.nodes) {
            let b = this.circuit.getBitFromFrontBuffer(node) ? "1" : "0"
            nodeStr = nodeStr + b
        }

        console.log(`DEBUG_READER [${timeStr}]: ${nodeStr}`)
    }
}
