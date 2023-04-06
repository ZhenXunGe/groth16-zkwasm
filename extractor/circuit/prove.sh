node a_js/generate_witness.js a_js/a.wasm input.json witness.wtns
snarkjs groth16 prove a.zkey witness.wtns proof.json public.json
