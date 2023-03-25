import { bn254 } from '@noble/curves/bn';
export function hexToBytes(hex0x: string): Uint8Array {
  if (typeof hex0x !== 'string') {
      throw new TypeError('hexToBytes: expected string, got ' + typeof hex0x);
  }
  let hex = hex0x.slice(2, hex0x.length);
  if (hex0x.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');

  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
      const j = i * 2;
      const hexByte = hex.slice(j, j + 2);
      if (hexByte.length !== 2) throw new Error('Invalid byte sequence');
      const byte = Number.parseInt(hexByte, 16);
      if (Number.isNaN(byte) || byte < 0) throw new Error('Invalid byte sequence');
      array[i] = byte;
   }
   return array;
}

export function hexToG1(pubkey0x: string) {
    const compressed = hexToBytes(pubkey0x);
    return bn254.ProjectivePoint.fromHex(compressed).toAffine();
}

export function fpToLimbs(x: bigint, r: Array<string>) {
  var acc = x;
  for (var i=0;i<6;i++) {
    const b = 0x200000000000n;
    const l = acc / b;
    const rem = acc % b;
    r.push(rem.toString());
    acc = l;
  }
}

export function fp2ToLimbs(fp2: any, r: Array<string>) {
  fpToLimbs(fp2[0], r);
  fpToLimbs(fp2[1], r);
}

export function g2ToLimbs(g2: any, r: Array<string>) {
  const x = g2[0];
  const y = g2[1];
  fp2ToLimbs(x, r);
  fp2ToLimbs(y, r);
}

export function g1ToLimbs(g1: any, r: Array<string>) {
    const x:bigint = g1[0];
    const y:bigint = g1[1];
    fpToLimbs(x, r);
    fpToLimbs(y, r);
}

export function gtToLimbs(gt: any, r: Array<string>) {
    fp2ToLimbs(gt.c0.c0, r);
    fp2ToLimbs(gt.c0.c1, r);
    fp2ToLimbs(gt.c0.c2, r);
    fp2ToLimbs(gt.c1.c0, r);
    fp2ToLimbs(gt.c1.c1, r);
    fp2ToLimbs(gt.c1.c2, r);
}


