use halo2_proofs::arithmetic::CurveAffine;
use halo2_proofs::pairing::bn256::{G1Affine, G2Affine, Fq2, pairing};
use num_bigint::BigUint;
use halo2_proofs::arithmetic::BaseExt;
use std::fs;
use std::env;
use std::str::FromStr;
use serde_json::Value;

pub fn bn_to_field<F: BaseExt>(bn: &BigUint) -> F {
    let mut bytes = bn.to_bytes_le();
    bytes.resize(48, 0);
    let mut bytes = &bytes[..];
    F::read(&mut bytes).unwrap()
}

pub fn field_to_bn<F: BaseExt>(f: &F) -> BigUint {
    let mut bytes: Vec<u8> = Vec::new();
    f.write(&mut bytes).unwrap();
    BigUint::from_bytes_le(&bytes[..])
}

fn get_g1(a: Vec<&str>) -> G1Affine {
    G1Affine::from_xy(
        bn_to_field(&BigUint::from_str(a[0]).unwrap()),
        bn_to_field(&BigUint::from_str(a[1]).unwrap()),
    ).unwrap()
}
fn get_g2(b: Vec<&str>) -> G2Affine {
    G2Affine::from_xy(
        Fq2 {
            c0: bn_to_field(&BigUint::from_str(b[0]).unwrap()),
            c1: bn_to_field(&BigUint::from_str(b[1]).unwrap()),
        },
        Fq2 {
            c0: bn_to_field(&BigUint::from_str(b[2]).unwrap()),
            c1: bn_to_field(&BigUint::from_str(b[3]).unwrap()),
        }
    ).unwrap()
}
 
fn main() {
    let mut args = env::args().skip(1);
    let filename = args.next().unwrap();
    let outputfile = args.next().unwrap();
    let json_string = fs::read_to_string(&filename).unwrap();

    let mut value: Value = serde_json::from_str(&json_string).unwrap();

    let index = "vk_alpha_1";
    let g1 = vec![
        value[index][0].as_str().unwrap(),
        value[index][1].as_str().unwrap(),
    ];
    
    
    let index = "vk_beta_2"; 
    let g2 = vec![
        value[index][0][0].as_str().unwrap(),
        value[index][0][1].as_str().unwrap(),
        value[index][1][0].as_str().unwrap(),
        value[index][1][1].as_str().unwrap(),
    ];

    let alpha = get_g1(g1);
    let beta= get_g2(g2);
    
    let gt = - pairing(&alpha, &beta);

    let index = "vk_alphabeta_12";
    value[index][0][0][0] = field_to_bn(&gt.0.c0.c0.c0).to_str_radix(10).into();
    value[index][0][0][1] = field_to_bn(&gt.0.c0.c0.c1).to_str_radix(10).into();
    value[index][0][1][0] = field_to_bn(&gt.0.c0.c1.c0).to_str_radix(10).into();
    value[index][0][1][1] = field_to_bn(&gt.0.c0.c1.c1).to_str_radix(10).into();
    value[index][0][2][0] = field_to_bn(&gt.0.c0.c2.c0).to_str_radix(10).into();
    value[index][0][2][1] = field_to_bn(&gt.0.c0.c2.c1).to_str_radix(10).into();

    value[index][1][0][0] = field_to_bn(&gt.0.c1.c0.c0).to_str_radix(10).into();
    value[index][1][0][1] = field_to_bn(&gt.0.c1.c0.c1).to_str_radix(10).into();
    value[index][1][1][0] = field_to_bn(&gt.0.c1.c1.c0).to_str_radix(10).into();
    value[index][1][1][1] = field_to_bn(&gt.0.c1.c1.c1).to_str_radix(10).into();
    value[index][1][2][0] = field_to_bn(&gt.0.c1.c2.c0).to_str_radix(10).into();
    value[index][1][2][1] = field_to_bn(&gt.0.c1.c2.c1).to_str_radix(10).into();

    let file = fs::File::create(outputfile).expect("can not create file");
    serde_json::to_writer_pretty(file, &value).expect("can not write to file");
}
