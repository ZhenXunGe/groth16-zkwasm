LIBS  = -lkernel32 -luser32 -lgdi32 -lopengl32
SDKDIR = ./zkWasm-C/
CFLAGS = -Wall -I$(SDKDIR)/sdk/c/sdk/include/ -I$(SDKDIR)/sdk/c/hash/include/ -I$(SDKDIR)/sdk/c/ecc/include/

# Should be equivalent to your list of C files, if you don't build selectively
CFILES = $(wildcard *.c)
ifeq ($(CLANG),)
CLANG=clang-15
endif
FLAGS = -flto -O3 -nostdlib -fno-builtin -ffreestanding -mexec-model=reactor --target=wasm32 -Wl,--strip-all -Wl,--initial-memory=196608 -Wl,--max-memory=196608 -Wl,--no-entry -Wl,--allow-undefined -Wl,--export-dynamic

all: verify.wasm inputs.sh vk.h

vk.h:
	node extractor/build/vkgen.js extractor/circuit/a.zkey > vk.h

inputs.sh:
	node extractor/build/inputgen.js > inputs.sh

sdk.wasm:
	sh $(SDKDIR)/sdk/scripts/build.sh sdk.wasm

verify.wasm: $(CFILES) sdk.wasm vk.h
	$(CLANG) -o $@ $(CFILES) sdk.wasm $(FLAGS) $(CFLAGS)


clean:
	sh $(SDKDIR)/sdk/scripts/clean.sh
	rm -f *.wasm *.wat
