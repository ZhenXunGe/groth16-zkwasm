import { bn254 } from '@noble/curves/bn';
import * as proof_json from "./circuit/proof.json";
import * as input_json from "./circuit/input.json";
import { fp2ToLimbs, g2ToLimbs, g1ToLimbs, gtToLimbs} from './utils';

function setPublicInput(nbpubkey: number) {
    console.log(`NB_PUBKEY=${nbpubkey}`); 
}

function bn254ToLimbs(x: bigint, r: Array<string>) {
  var acc = x;
  //console.log(acc.toString());
  for (var i=0;i<4;i++) {
    const b = 0x10000000000000000n;
    const l = acc / b;
    const rem = acc % b;
    r.push(rem.toString());
    acc = l;
  }
}

async function main() {
  const inputs = [
      BigInt(input_json.a),
  ];

  var inputlimbs: Array<string> = [];
  for (var i of inputs) {
    bn254ToLimbs(i, inputlimbs);
  }
  for (var l of inputlimbs) {
    console.log(`INSTANCES="$INSTANCES ${l}:i64"`)
  }

  var q = BigInt(21888242871839275222246405745257275088696311157297823662689037894645226208583n);

  console.log("# ", q - BigInt(proof_json.pi_a[1]));
  console.log("# ", BigInt(proof_json.pi_a[1]));
  var proof = {
    a: [
      BigInt(proof_json.pi_a[0]),
      q - (BigInt(proof_json.pi_a[1])),
    ],
    b: [
      [
        BigInt(proof_json.pi_b[0][0]),
        BigInt(proof_json.pi_b[0][1]),
      ],
      [
        BigInt(proof_json.pi_b[1][0]),
        BigInt(proof_json.pi_b[1][1]),
      ],
    ],
    c: [
      BigInt(proof_json.pi_c[0]),
      BigInt(proof_json.pi_c[1]),
    ],
  };

  var proofs: Array<string> = [];
  g1ToLimbs(proof.a, proofs);
  proofs.push("0");
  g2ToLimbs(proof.b, proofs);
  proofs.push("0");
  g1ToLimbs(proof.c, proofs);
  proofs.push("0");
  for (var p of proofs) {
    console.log(`PROOFS="$PROOFS ${p}:i64"`)
  }
}

main().then(()=>{process.exit();});
