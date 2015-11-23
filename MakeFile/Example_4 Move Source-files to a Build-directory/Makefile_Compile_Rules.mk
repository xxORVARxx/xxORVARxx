

COMPILE-RULES := $(wildcard $(D-DIR)/*d)



## After the source or header file have been copied to the build directory,
## g++ with -MM is used to find all the 'Prerequisites' for each of the cpp-Files.
## These 'Prerequisites' are made into dependency files, along with their 'recipe'.
## The dependency files are then 'included' as a 'makefiles' and become the 'rules'
## needed to compile the source into object files.



-include $(COMPILE-RULES)



# $(call cpp-to-o, cpp-file )
cpp-to-o = $(patsubst $(S-DIR)/%.cpp,$(O-DIR)/%.o,$(1))



## Create The Dependency-Files that Contain the Rules for how to Compile.
PHONY: create_compile_rules
create_compile_rules: $(BUILD-Ds)
	$(info ----------   Compile Rules Found: $(words $(COMPILE-RULES))   ----------)

$(D-DIR)/%.d: $(S-DIR)/%.cpp
	$(info )
	$(CXX) $(CPPFLAGS) -MM $< -MT $(call cpp-to-o,$<) -o $@
#	  g++ -std=c++11 -MM my.cpp -MT my.o -o my.d
	@echo '\t $(CXX) $(CPPFLAGS) -c $< -o $(call cpp-to-o,$<)' >> $@
#	  echo '	g++ -std=c++11 -c my.cpp -o my.o' >> my.d
	@cat $@
