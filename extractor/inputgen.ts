import { bn254 } from '@noble/curves/bn';
import * as proof_json from "./circuit/proof.json";
import { fp2ToLimbs, g2ToLimbs, g1ToLimbs, gtToLimbs} from './utils';

function setPublicInput(nbpubkey: number) {
    console.log(`NB_PUBKEY=${nbpubkey}`); 
}

const a1 = [
  8311189960087460318171413748480901605131085307201436528622111297262462757153n,
  17648388536192995337933740674962239196965914704361872613834552657513452273742n
];
const b2 = [
  [12402856896391671798662377212933632033467372642804727984741881060402032845050n,
   1175272311556224611092516350141293297101407090242596030983164976390615873778n],
  [21182245435151505199064550281669712522862778814214399891943166253811574596832n,
   2213461695789132327003810372823334387063490153178560929473192493246448748063n]
];

const c1 = [
  8311189960087460318171413748480901605131085307201436528622111297262462757153n,
  17648388536192995337933740674962239196965914704361872613834552657513452273742n
  /*
  11559732032986387107991004021392285783925812861821192530917403151452391805634n,
  10857046999023057135944570762232829481370756359578518086990519993285655852781n
  */
];

const inputs = [
   1n,
];

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
  var inputlimbs: Array<string> = [];
  for (var i of inputs) {
    bn254ToLimbs(i, inputlimbs);
  }
  for (var l of inputlimbs) {
    console.log(`INSTANCES="$INSTANCES ${l}:i64"`)
  }

  var proof = {
    a: [
      BigInt(proof_json.pi_a[0]),
      BigInt(proof_json.pi_a[1]),
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

   /*
   console.log("g1-x ", acc.toAffine()[0]);
   console.log("g1-y ", acc.toAffine()[1]);
   console.log("g2-x ", g2.toAffine()[0]);
   console.log("g2-y ", g2.toAffine()[1]);
   console.log(gt.c0);
   console.log(gt.c1);
   */
}

main().then(()=>{process.exit();});
