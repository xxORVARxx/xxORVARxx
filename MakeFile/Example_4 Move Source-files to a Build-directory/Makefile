

TEST := test
CPPFLAGS := -std=c++11 -O3
LDFLAGS := -lSDL2 -lSDL2_image



## This Makefile will find all the source and header files in the SRC directory, 
## or any sub-directory of SRC, and copy them into a singla build-directory. 
## From there it will compile, link and run the Program.
## So the source and header files can be put into any number of sub-directories
## and it will always compile without having changing the #include"" in the files.



SRC := src
BUILD := build

# Source variables:
SRC-CPPs := $(subst ./,,$(shell find $(SRC)/ -name '*.cpp'))
SRC-Hs := $(subst ./,,$(shell find $(SRC)/ -name '*.h'))
SRC-CPP-DIRs := $(sort $(dir $(SRC-CPPs)))
SRC-H-DIRs := $(sort $(dir $(SRC-Hs)))

# Build variables:
S-DIR := $(BUILD)/s
O-DIR := $(BUILD)/o
D-DIR := $(BUILD)/d
M-DIR := $(BUILD)/m

BUILD-CPPs := $(addprefix $(S-DIR)/,$(notdir $(SRC-CPPs)))
BUILD-Hs := $(addprefix $(S-DIR)/,$(notdir $(SRC-Hs)))
BUILD-Ds := $(addprefix $(D-DIR)/,$(addsuffix .d,$(notdir $(basename $(BUILD-CPPs)))))
BUILD-Os := $(addprefix $(O-DIR)/,$(addsuffix .o,$(notdir $(basename $(BUILD-CPPs)))))



## Make sure 'all' is the 'Default-Goal', and not some Target from the Included Files.
all:



-include Makefile_Copy_Rules.mk
-include Makefile_Compile_Rules.mk



## The Goal: 'create_copy_rules', 'copy', 'create_compile_rules', 'compile' and 'run'.
.PHONY: all
all: create_copy_rules
	$(MAKE) copy
	$(MAKE) create_compile_rules
	$(MAKE) run



## Copy Source-Files from all source-directories into a singla build-directory.
PHONY: copy
copy: $(BUILD-CPPs) $(BUILD-Hs)



## Link and Run the Program.
.PHONY: run
run: $(BUILD-Os)
	$(info )
	$(info REMEMBER EACH TIME YOU CHANGE WHICH HEADER-FILES)
	$(info ARE #included"" INTO OTHER FILES IN YOUR PROGRAM,)
	$(info YOU HAVE TO COMPILE FROM SCRATCH! use: 'make clean')
	$(info )
	$(info ----------   Linking   ----------)
	$(CXX) $(CPPFLAGS) $(BUILD-Os) -o $(TEST) $(LDFLAGS)
#	  g++ -std=c++11 my.o -o test -lSDL2 -lSDL2_image
	./$(TEST)
#	  ./test



## Delete the build-directory.
.PHONY: clean
clean:
	-rm -r $(BUILD)
