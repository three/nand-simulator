import {
    CircuitLayout,
    Device
} from "./types.ts";
import {DebugReader} from "./devices/DebugReader.ts";
import {Clock} from "./devices/Clock.ts";
import {Const} from "./devices/Const.ts";
import {Step} from "./devices/Step.ts";

/**
 * Create a simulation of NAND gates, with some special devices
 */
export class Circuit {
    bufferLength: number;
    devices: Device[];
    sourcesA: number[];
    sourcesB: number[];
    sourceBufferA: Int32Array;
    sourceBufferB: Int32Array;
    frontBuffer: Int32Array;
    time: number;

    constructor(layout: CircuitLayout) {
        this.sourcesA = new Array(layout.size);
        for (let i=0;i<layout.size;i++) {
            if (layout.nands[2*i] != null) {
                this.sourcesA[i] = layout.nands[2*i];
            } else {
                this.sourcesA[i] = 0;
            }
        }

        this.sourcesB = new Array(layout.size)
        for (let i=0;i<layout.size;i++) {
            if (layout.nands[2*i+1] != null) {
                this.sourcesB[i] = layout.nands[2*i+1]
            } else {
                this.sourcesB[i] = 0
            }
        }

        this.devices = []
        for (let device of layout.devices) {
            if (device.type === "CLOCK") {
                this.devices.push(new Clock(this, device));
            } else if (device.type === "DEBUG_READER") {
                this.devices.push(new DebugReader(this, device));
            } else if (device.type === "CONST") {
                this.devices.push(new Const(this, device));
            } else if (device.type === "STEP") {
                this.devices.push(new Step(this, device))
            }
        }

        this.bufferLength = Math.ceil(layout.size / 32)
        this.sourceBufferA = new Int32Array(this.bufferLength)
        this.sourceBufferB = new Int32Array(this.bufferLength)
        this.frontBuffer = new Int32Array(this.bufferLength)

        this.time = -1
    }

    getBitFromFrontBuffer(n: number): boolean {
        let index = n >> 5
        let mask = 1 << (n & 0b11111)
        let word = this.frontBuffer[index]
        return !!(word & mask)
    }

    setBitInFrontBuffer(n: number, v: boolean) {
        let index = n >> 5
        let mask = 1 << (n & 0b11111)
        if (v) {
            this.frontBuffer[index] |= mask
        } else {
            this.frontBuffer[index] &= ~mask
        }
    }

    populateSourceBuffer(buffer: Int32Array, sourceNodes: number[]) {
        for (let i=0;i<this.bufferLength;i++) {
            let n = 0
            for (let j=0;j<32;j++) {
                let sourceNode = sourceNodes[32*i+j]
                if (sourceNode != null && this.getBitFromFrontBuffer(sourceNode)) {
                    n |= 1 << j
                }
            }
            buffer[i] = n
        }
    }

    combineSourceBuffersIntoFrontBuffer() {
        for (let i=0;i<this.bufferLength;i++) {
            let a = this.sourceBufferA[i]
            let b = this.sourceBufferB[i]
            this.frontBuffer[i] = ~(a & b)
        }
    }

    tick() {
        this.time++

        for (let device of this.devices) {
            if (device.pre) {
                device.pre()
            }
        }

        this.populateSourceBuffer(this.sourceBufferA, this.sourcesA)
        this.populateSourceBuffer(this.sourceBufferB, this.sourcesB)
        this.combineSourceBuffersIntoFrontBuffer()

        for (let device of this.devices) {
            if (device.post) {
                device.post()
            }
        }

        for (let device of this.devices) {
            if (device.late) {
                device.late()
            }
        }
    }

    run() {
        for (let i=0;i<100;i++) {
            this.tick()
        }
    }
}
