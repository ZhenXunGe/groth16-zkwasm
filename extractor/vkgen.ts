import { bn254 } from '@noble/curves/bn';
import * as vk from "./circuit/zkey.json";
const snarkjs = require("snarkjs");

import { fp2ToLimbs, g2ToLimbs, g1ToLimbs, gtToLimbs} from './utils';
// If you're using single file, use global variable instead: `window.nobleBls12381`

async function main() {

  const prepair = {
    c0: {
      c0: [
        BigInt(vk.vk_alphabeta_12[0][0][0]),
        BigInt(vk.vk_alphabeta_12[0][0][1]),
      ],
      c1: [
        BigInt(vk.vk_alphabeta_12[0][1][0]),
        BigInt(vk.vk_alphabeta_12[0][1][1]),
      ],
      c2: [
        BigInt(vk.vk_alphabeta_12[0][2][0]),
        BigInt(vk.vk_alphabeta_12[0][2][1]),
      ],
    },
    c1: {
      c0: [
        BigInt(vk.vk_alphabeta_12[1][0][0]),
        BigInt(vk.vk_alphabeta_12[1][0][1]),
      ],
      c1: [
        BigInt(vk.vk_alphabeta_12[1][1][0]),
        BigInt(vk.vk_alphabeta_12[1][1][1]),
      ],
      c2: [
        BigInt(vk.vk_alphabeta_12[1][2][0]),
        BigInt(vk.vk_alphabeta_12[1][2][1]),
      ],
    },
  };

  const gamma2 = [
      [
        BigInt(vk.vk_gamma_2[0][0]),
        BigInt(vk.vk_gamma_2[0][1]),
      ],
      [
        BigInt(vk.vk_gamma_2[1][0]),
        BigInt(vk.vk_gamma_2[1][1]),
      ],
    ];

    const delta2 = [
      [
        BigInt(vk.vk_delta_2[0][0]),
        BigInt(vk.vk_delta_2[0][1]),
      ],
      [
        BigInt(vk.vk_delta_2[1][0]),
        BigInt(vk.vk_delta_2[1][1]),
      ],
    ];

    const ics = [
      [
        BigInt(vk.IC[0][0]),
        BigInt(vk.IC[0][1]),
      ],
      [
        BigInt(vk.IC[1][0]),
        BigInt(vk.IC[1][1]),
      ]
    ];

  // establish the g1s for calculation of msm of inputs
  var icssetup: Array<string> = [];
  for (var ic of ics) {
    //push default scalar
    icssetup.push("1");
    icssetup.push("0");
    icssetup.push("0");
    icssetup.push("0");
    //push points
    g1ToLimbs(ic, icssetup);
    icssetup.push("0");
  }
  for (var idx in icssetup) {
    console.log(`gamma_abc_g1s[${idx}] = ${icssetup[idx]};`)
  }

  // establish the vkey for this specific circuit
  var vksetup:Array<string> = [];
  gtToLimbs(prepair, vksetup);
  g2ToLimbs(gamma2, vksetup);
  vksetup.push("0");
  g2ToLimbs(delta2, vksetup);
  vksetup.push("0");

  for (var idx in vksetup) {
    console.log(`vk[${idx}] = ${vksetup[idx]};`);
  }
}

main().then(()=>{process.exit();});
