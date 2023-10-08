~/circom/target/release/circom sample/a.circom --r1cs --wasm --sym --c
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup a.r1cs pot12_final.ptau a_0000.zkey
snarkjs zkey contribute a_0000.zkey a.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey a.zkey zkey_circom.json
../../keygen/target/debug/keygen zkey_circom.json ../../setup/zkey.json




