node a_js/generate_witness.js a_js/a.wasm ../../proof/input.json witness.wtns
snarkjs groth16 prove a.zkey witness.wtns ../../proof/proof.json ../../proof/public.json
