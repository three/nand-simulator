import {Circuit} from "../Circuit.ts";
import {StepDesc} from "../types.ts";

/**
 * Set node to a step function. If current time is below time value is initial, otherwise the opposite
 */
export class Step {
    circuit: Circuit;
    initial: boolean;
    time: number;
    node: number;

    constructor(circuit: Circuit, device: StepDesc) {
        this.circuit = circuit;
        this.initial = device.initial;
        this.time = device.time;
        this.node = device.node;
    }

    post() {
        let value = this.circuit.time >= this.time ? !this.initial : this.initial;
        this.circuit.setBitInFrontBuffer(this.node, value);
    }
}