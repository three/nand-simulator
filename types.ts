import {Const} from "./Const.ts";

export interface CircuitLayout {
    size: number;
    nands: number[];
    devices: DeviceDescription[];
}

export type DeviceDescription =
    DebugReaderDesc |
    ClockDesc |
    ConstDesc |
    StepDesc;

export interface DebugReaderDesc {
    type: "DEBUG_READER";
    nodes: number[];
}

export interface ClockDesc {
    type: "CLOCK";
    period: number;
    duty: number;
    offset: number;
    node: number;
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
