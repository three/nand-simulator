import {Circuit} from "../Circuit.ts";

/**
 * Read byte from device.inputNodes on positive clock edges when readyNode is high, and output to stdout
 */
export class ParallelReader {
    circuit: Circuit;
    inputNodes: number[];
    readyNode: number;
    value: Uint8Array;
    ready: boolean;
    clockNode: number;
    clockPrev: boolean;

    constructor(circuit: Circuit, device: ParallelReaderDesc) {
        this.circuit = circuit;
        this.inputNodes = device.inputNodes;
        this.readyNode = device.readyNode;
        this.ready = false;
        this.value = new Uint8Array(1);
        this.clockNode = device.clockNode;
        this.clockPrev = true;
    }

    pre() {
        let clk = this.circuit.getBitFromFrontBuffer(this.clockNode);
        this.ready = (
            this.circuit.getBitFromFrontBuffer(this.readyNode) &&
                clk && !this.clockPrev
        );
        this.clockPrev = clk;

        if (this.ready) {
            let byte = 0;
            for (let i=0;i<8;i++) {
                let v = this.circuit.getBitFromFrontBuffer(this.inputNodes[i]);
                if (v) {
                    byte  += 1 << i;
                }
            }
            this.value[0] = byte;
        }
    }

    late() {
        if (this.ready) {
            Deno.stdout.writeSync(this.value);
        }
    }
}

export interface ParallelReaderDesc {
    type: "PARALLEL_READER";
    inputNodes: number[];
    readyNode: number;
    clockNode: number;
}