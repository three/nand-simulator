import {Const} from "./devices/Const.ts";
import {ClockDesc} from "./devices/Clock.ts";
import {ParallelReaderDesc} from "./devices/ParallelReader.ts";
import {ParallelWriterDesc} from "./devices/ParallelWriter.ts";

export interface CircuitLayout {
    size: number;
    nands: number[];
    devices: DeviceDescription[];
}

export type DeviceDescription =
    DebugReaderDesc |
    ClockDesc |
    ConstDesc |
    StepDesc |
    ParallelReaderDesc |
    ParallelWriterDesc;

export interface DebugReaderDesc {
    type: "DEBUG_READER";
    nodes: number[];
}

export interface ConstDesc {
    type: "CONST";
    value: boolean;
    node: number;
}

export interface StepDesc {
    type: "STEP";
    initial: boolean;
    time: number;
    node: number;
}

export interface Device {
    pre?(): void;
    post?(): void;
    late?(): void;
}
