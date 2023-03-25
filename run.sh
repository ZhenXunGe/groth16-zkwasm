#!/bin/bash

set -e

# rm -rf output

CLI=~/zkWasm/target/release/cli

NB_PUBKEY=1

INSTANCES=
PROOFS=

source ./inputs.sh

set -x

# Single test
#RUST_LOG=info $CLI -k 20 --function zkmain --output ./output --wasm verify.wasm setup

RUST_LOG=info RUST_BACKTRACE=1 $CLI -k 20 --function zkmain --output ./output --wasm verify.wasm single-prove --public $INSTANCES --private $PROOFS
RUST_LOG=info $CLI -k 20 --function zkmain --output ./output --wasm verify.wasm single-verify --proof output/zkwasm.0.transcript.data --public $NB_PUBKEY:i64
RUST_LOG=info $CLI -k 20 --function zkmain --output ./output --wasm verify.wasm aggregate-prove
RUST_LOG=info $CLI -k 20 --function zkmain --output ./output --wasm verify.wasm aggregate-verify --proof output/aggregate-circuit.0.transcript.data  --instances output/aggregate-circuit.0.instance.data
