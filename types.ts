export interface CircuitLayout {
    size: number;
    nands: number[];
    devices: DeviceDescription[];
}

export type DeviceDescription =
    DebugReaderDesc |
    ClockDesc;

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

export interface Device {
    pre?(): void;
    post?(): void;
    late?(): void;
}
