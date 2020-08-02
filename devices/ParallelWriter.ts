import {Circuit} from "../Circuit.ts";

export class ParallelWriter {
    circuit: Circuit;
    outputNodes: number[];
    readyNode: number;
    clockNode: number;
    clockPrev: boolean;

    constructor(circuit: Circuit, desc: ParallelWriterDesc) {
        this.circuit = circuit;
        this.outputNodes = desc.outputNodes;
        this.readyNode = desc.readyNode;
        this.clockNode = desc.clockNode;
        this.clockPrev = true;
    }
}

export interface ParallelWriterDesc {
    type: "PARALLEL_WRITER";
    outputNodes: number[];
    readyNode: number;
    clockNode: number;
}