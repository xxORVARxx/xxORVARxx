
## These are some Built-in Variables in Make:
# CXX = g++
# COMPILE.cc = $(CXX) $(CXXFLAGS) $(CPPFLAGS) $(TARGET_ARCH) -c
# COMPILE.cpp = $(COMPILE.cc)
# LINK.cc = $(CXX) $(CXXFLAGS) $(CPPFLAGS) $(LDFLAGS) $(TARGET_ARCH)
# LINK.cpp = $(LINK.cc)

## This is how a 'Rule' is Defined in Make:
# 'Target': 'Prerequisites'
#	'Recipe'


TEST := test
CPPFLAGS := -std=c++11 -O3
LDFLAGS := -lSDL2 -lSDL2_image

SRC-DIR := src
OBJ-DIR := obj


## Find all Files in the SRC-directory and every sub-directories:
ls = $(wildcard $(1)/*)
ls-all = $(strip $(call ls,$(1)) $(foreach i,$(call ls,$(1)),$(call ls-all,$(i))))
ALL-FILES := $(call ls-all,$(SRC-DIR))

## Separate the Files:
CPP-FILES := $(filter $(SRC-DIR)%.cpp,$(ALL-FILES))
H-FILES := $(filter $(SRC-DIR)%.h,$(ALL-FILES))
O-FILES := $(patsubst $(SRC-DIR)/%.cpp,$(OBJ-DIR)/%.o,$(CPP-FILES))
D-FILES := $(patsubst $(SRC-DIR)/%.cpp,$(OBJ-DIR)/%.d,$(CPP-FILES))

ALL-DIR := $(sort $(dir $(O-FILES)))

cpp-to-o = $(patsubst $(SRC-DIR)/%.cpp,$(OBJ-DIR)/%.o,$(1))



## The 'Goal', do Everything.
.PHONY: all
all: dir dep run


## Create all or new Directories if needed.
.PHONY: dir
dir:
	@-mkdir -p $(ALL-DIR)


## Use g++ with -MM to find all the 'Prerequisites' for each of the cpp-Files,
## Writing it to a Dependency-File and then add to it the 'recipe'.
.PHONY: dep
dep: $(D-FILES)

$(OBJ-DIR)/%.d: $(SRC-DIR)/%.cpp
	$(info )
	$(CXX) $(CPPFLAGS) -MM $< -MT $(call cpp-to-o,$<) -o $@
#	  g++ -std=c++11 -MM my.cpp -MT my.o -o my.d
	@echo '\t $(CXX) $(CPPFLAGS) -c $< -o $(call cpp-to-o,$<)' >> $@
#	  echo '	g++ -std=c++11 -c my.cpp -o my.o' >> my.d
	@cat $@


## Turns the Dependency-Files into the 'Rules' they Contain.
## Which are used to Compile the cpp-Files in to the o-files.
-include $(D-FILES)


## Link and Run the Program.
.PHONY: run
run: $(O-FILES)
	$(info )
	$(info REMEMBER EACH TIME YOU CHANGE WHICH HEADER-FILES)
	$(info ARE #included"" INTO OTHER FILES IN YOUR PROGRAM,)
	$(info YOU HAVE TO COMPILE FROM SCRATCH! use: 'make clean')
	$(info )
	$(info ---Linking---)
	$(CXX) $(CPPFLAGS) $(O-FILES) -o $(TEST) $(LDFLAGS)
#	  g++ -std=c++11 my.o -o test -lSDL2 -lSDL2_image
	./$(TEST)
#	  ./test


## Delete the Object- and Dependency-Files.
.PHONY: clean
clean:
	-rm -r $(O-FILES) $(D-FILES) $(TEST)
	@-mkdir -p $(ALL-DIR)


## Print out Data to ease Debugging.
.PHONY: out
out:
	$(info )
	$(info Total Files Found: $(words $(ALL-FILES)))
	$(info $(ALL-FILES))
	$(info )
	$(info Source Files: $(words $(CPP-FILES))  '.cpp')
	$(info $(CPP-FILES))
	$(info )
	$(info Header Files: $(words $(H-FILES))  '.h')
	$(info $(H-FILES))
	$(info )
	$(info Object Files: $(words $(O-FILES))  '.o')
	$(info $(O-FILES))
	$(info )
	$(info Dependency Files: $(words $(D-FILES))  '.d')
	$(info $(D-FILES))
	$(info )
	$(info All used Directories: $(words $(ALL-DIR)))
	$(info $(ALL-DIR))
	$(info )
