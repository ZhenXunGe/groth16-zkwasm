# groth16-zkwasm

This project is trying to run the groth16 verifier in zkWasm virtual machine. The idea is simple, write the groth16 verifier in C and use the pairing host circuit to provide zkWASM user the ability to combine groth16 proofs with wasm applications.

There are a few reasons to do the integration. In particular, we can use this to provide the ability to hide some private witnesses when we are using the zkWASM machine in a cloud prover setup.

## Requirements
* Install zkWASM v2 with host circuits support (~/zkWasm)
* Sync zkWasm-C submodule
## Setup the project
* Compile keygen which is used to extract circom zkey
* Compile circuit in extractor
```
circuit: sh setup.sh
```
* Compile extractor
```
extractor: npx tsc
```
## Setup the circuit and generate sample proof
```
circuit: sh setup.sh
circuit: sh prove.sh
```
## Compile the project
```
make
```
## Run the test
```
sh run.sh
```

