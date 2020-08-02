import {Circuit} from "../Circuit.ts";
import {ConstDesc} from "../types.ts";

/**
 * Override the value of node to high or low
 */
export class Const {
    circuit: Circuit;
    node: number;
    value: boolean;

    constructor(circuit: Circuit, device: ConstDesc) {
        this.circuit = circuit;
        this.node = device.node;
        this.value = device.value;
    }

    post() {
        this.circuit.setBitInFrontBuffer(this.node, this.value);
    }
}