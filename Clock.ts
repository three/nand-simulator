import {Circuit} from "./Circuit.ts";
import {ClockDesc} from "./types.ts";

export class Clock {
    circuit: Circuit;
    period: number;
    duty: number;
    offset: number;
    node: number;
    nextValue: boolean | null;

    constructor(circuit: Circuit, device: ClockDesc) {
        this.circuit = circuit
        this.period = device.period
        this.duty = device.duty
        this.offset = device.offset
        this.node = device.node

        this.nextValue = null
    }

    pre() {
        let subTime = (this.circuit.time + this.offset) % this.period
        this.nextValue = subTime >= this.period - this.duty
    }

    post() {
        this.circuit.setBitInFrontBuffer(this.node, this.nextValue!)
    }
}
