import {range, reverse} from "./helpers.ts";
import {Circuit} from "./Circuit.ts";
import {CircuitLayout} from "./types.ts";

const NODE_LOW = 0;
const NODE_HIGH = 1;
const NODE_CLK = 2;

const circuit: CircuitLayout = {
    size: 16,
    nands: [
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ],
    devices: [{
        type: "CONST",
        value: false,
        node: NODE_LOW
    }, {
        type: "CONST",
        value: true,
        node: NODE_HIGH
    }, {
        type: "CLOCK",
        period: 100,
        duty: 50,
        offset: 0,
        node: NODE_CLK
    }]
}

function mkConstant(v: number, l: number): number[] {
    const nodes = [];
    for (let i=0;i<l;i++) {
        nodes.push(v & 1 ? NODE_HIGH : NODE_LOW);
        v >>= 1;
    }
    return nodes;
}

function allocateNode() {
    circuit.nands.push(0,0);
    circuit.size++;
    return circuit.nands.length / 2 - 1;
}

function setNand(node: number, a: number, b: number) {
    circuit.nands[2*node] = a;
    circuit.nands[2*node+1] = b;
}

function mkNand2(a: number, b: number): number {
    const node = allocateNode();
    setNand(node, a, b);
    return node;
}

function mkNot(a: number): number {
    return mkNand2(a, a);
}

function mkSRLatch(ns: number, nr: number): number {
    const rNand = allocateNode();
    const sNand = allocateNode();
    setNand(rNand, sNand, nr);
    setNand(sNand, rNand, ns);
    return sNand;
}

function mkDLatch(d: number, enb: number): number {
    const ns = mkNand2(d, enb);
    const nr = mkNand2(mkNot(d), enb);
    return mkSRLatch(ns, nr);
}

function mkFullAdder(a: number, b: number, cin: number): {sum :number, cout: number} {
    const nand1 = mkNand2(a, b);
    const nand2 = mkNand2(a, nand1);
    const nand3 = mkNand2(nand1, b);
    const nand4 = mkNand2(nand2, nand3);
    const nand5 = mkNand2(nand4, cin);
    const nand6 = mkNand2(nand4, nand5);
    const nand7 = mkNand2(nand5, cin);
    const sum = mkNand2(nand6, nand7);
    const cout = mkNand2(nand5, nand1);
    return { sum, cout };
}

function mkAdder(as: number[], bs: number[], cin: number): {ss: number[], cout: number} {
    const ss = [];
    let cout = cin;
    for (let i=0;i<as.length;i++) {
        const adder = mkFullAdder(as[i], bs[i], cout);
        ss.push(adder.sum);
        cout = adder.cout;
    }
    return { ss, cout };
}

let adder = mkAdder(mkConstant(5, 8), mkConstant(10, 8), 0);
circuit.devices.push({
    type: "DEBUG_READER",
    nodes: reverse(adder.ss)
})

const c = new Circuit(circuit);
for (let i=0;i<20;i++) {
    c.tick();
}