# groth16-zkwasm
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

