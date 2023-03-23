#define LIMBSZ 6
#define MAXINPUT 8

#include "zkwasmsdk.h"

uint64_t gamma_abc_g1s[(LIMBSZ*2+1+4) * MAXINPUT];
uint64_t inputs_msm[LIMBSZ*2+1];

extern void bn254msm(uint32_t size, uint64_t* g1, uint64_t *gr);

static inline void read_groth16_input(int idx) {
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+1] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+2] = wasm_input(1);
  gamma_abc_g1s[(LIMBSZ*2+1+4)*idx+3] = wasm_input(1);
}

static inline void prepare_inputs(uint32_t size) {
  for(int i=0; i<size; i++) {
    read_groth16_input(i);
  }
  bn254_msm(size, gamma_abc_g1s, inputs_msm);
}

static inline uint64_t* vk_alpha_beta_pair(uint64_t *vk) {
  return vk;
}
static inline uint64_t* vk_neg_gamma_g2(uint64_t *vk) {
  return &vk[36];
}

static inline uint64_t* vk_neg_delta_g2(uint64_t *vk) {
  return &vk[36 + LIMBSZ*4 + 1];
}

static inline uint64_t* proof_a(uint64_t *p) {
  return p;
}

static inline uint64_t* proof_b(uint64_t *p) {
  return &p[LIMBSZ*2+1];
}

static inline uint64_t* proof_b(uint64_t *p) {
  return &p[LIMBSZ*2+1 + LIMBSZ*4+1];
}

#define VK_ALPHA_BETA_PAIR
#define VK_NEG_GAMMA_G2
#define VK_NEG_DELTA_G2
int verify(uint64_t *vk, uint64_t* imsm, uint64_t* result) {
  int i;
  uint64_t *a = proof_a(vk);
  uint64_t *b = proof_b(vk);
  uint64_t *c = proof_c(vk);
  uint64_t *neg_delta = vk_neg_delta_g2(vk);
  uint64_t *neg_gamma = vk_neg_gamma_g2(vk);
  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      blspair_g1(a[i]);
  }
  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      blspair_g1(imsm[i]);
  }
  for(i=0;i<(LIMBSZ * 2 + 1);i++) {
      blspair_g1(c[i]);
  }
  for(i=0;i<(LIMBSZ * 4 + 1);i++) {
      blspair_g2(neg_gamma[i]);
  }
  for(i=0;i<(LIMBSZ * 4 + 1);i++) {
      blspair_g2(neg_delta[i]);
  }
  for(i=0;i<(LIMBSZ * 12);i++) {
      result[i] = blspair_pop();
  }
}
