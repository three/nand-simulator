export function range(n: number): number[] {
    let out = [];
    for (let i=0;i<n;i++) {
        out.push(i);
    }
    return out;
}

export function reverse<A>(arr: A[]): A[] {
    const out: A[] = [];
    for (let i=arr.length-1;i>=0;i--) {
        out.push(arr[i]);
    }
    return out;
}