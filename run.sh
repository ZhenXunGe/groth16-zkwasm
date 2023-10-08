#!/bin/bash

set -e

# rm -rf output

CLI=~/zkWasm/target/release/delphinus-cli

NB_PUBKEY=2

INSTANCES=
PROOFS=

source ./inputs.sh

set -x

# Single test
RUST_LOG=info $CLI -k 19 --function zkmain --param params --output ./output --wasm verify.wasm setup

RUST_LOG=info RUST_BACKTRACE=1 $CLI -k 19 --function zkmain --param params --output ./output --wasm verify.wasm single-prove --public $NB_PUBKEY:i64 $INSTANCES --private $PROOFS
RUST_LOG=info $CLI -k 19 --function zkmain --param params --output ./output --wasm verify.wasm single-verify --proof output/zkwasm.0.transcript.data --public $NB_PUBKEY:i64 $INSTANCES
