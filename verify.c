#define LIMBSZ 6
#define INPUTSZ 1
#define G1_LEN (LIMBSZ*2+1)
#define G2_LEN (LIMBSZ*4+1)
#define GT_LEN (LIMBSZ*12)

#include "zkwasmsdk.h"
#include "bn254.h"

/*
static inline uint64_t* vk_alpha_beta_pair(uint64_t *vk) {
  return vk;
}
*/

static inline uint64_t* vk_neg_gamma_g2(uint64_t *vk) {
  return &vk[GT_LEN];
}

static inline uint64_t* vk_neg_delta_g2(uint64_t *vk) {
  return &vk[GT_LEN + G2_LEN];
}

static inline uint64_t* proof_a(uint64_t *p) {
  return p;
}

static inline uint64_t* proof_b(uint64_t *p) {
  return &p[LIMBSZ*2+1];
}

static inline uint64_t* proof_c(uint64_t *p) {
  return &p[LIMBSZ*2+1 + LIMBSZ*4+1];
}

// vk = prepared pair + neg gamma + neg delta
#define VK_LEN (GT_LEN+(G2_LEN*2))

// Proof includes a b c
#define PROOF_LEN (G1_LEN*2+G2_LEN)

void verify(uint64_t *vk, uint64_t* imsm, uint64_t* proof) {
  int i;
  uint64_t *a = proof_a(proof);
  uint64_t *b = proof_b(proof);
  uint64_t *c = proof_c(proof);
  uint64_t *neg_delta = vk_neg_delta_g2(vk);
  uint64_t *neg_gamma = vk_neg_gamma_g2(vk);
  uint64_t *result = vk;

  // first pair
  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      bn254pair_g1(a[i]);
  }

  for(i=0;i<(LIMBSZ * 4 + 1);i++) {
      bn254pair_g2(b[i]);
  }

  // seconde imsm * neg_gamma
  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      bn254pair_g1(imsm[i]);
  }

  for(i=0;i<(LIMBSZ * 4 + 1);i++) {
      bn254pair_g2(neg_gamma[i]);
  }

  // third c*neg_delta

  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      bn254pair_g1(c[i]);
  }

  for(i=0;i<(LIMBSZ * 4 + 1);i++) {
      bn254pair_g2(neg_delta[i]);
  }

  // fetch results
  for(i=0;i<(LIMBSZ * 12);i++) {
      result[i] = bn254pair_pop();
  }
}

uint64_t gamma_abc_g1s[(LIMBSZ*2+1+4) * (INPUTSZ+1)];
uint64_t inputs_msm[LIMBSZ*2+1];
uint64_t proof[PROOF_LEN];
uint64_t vk[VK_LEN];


static inline void read_groth16_input(int input_index) {
  // The first slot is always 1 and we start at the snd slot
  int idx = input_index+1;
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+1] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+2] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+3] = wasm_input(1);
}

static inline void prepare_inputs(uint32_t nb_input) {
  for(int i=0; i<nb_input; i++) {
    read_groth16_input(i);
  }
  bn254msm(nb_input+1, gamma_abc_g1s, inputs_msm);
}

__attribute__((visibility("default")))
int zkmain() {
// Initialize gamma_abc_g1s and vk
#include "vk.h"
  int i;
  prepare_inputs(1);
  for(i=0;i<PROOF_LEN;i++) {
    proof[i] = wasm_input(0);
  }
  verify(vk, inputs_msm, proof);
  return 1;
}
