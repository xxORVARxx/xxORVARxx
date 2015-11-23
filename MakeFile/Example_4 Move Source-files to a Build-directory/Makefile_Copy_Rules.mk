

COPY-RULES-DIR := $(M-DIR)/copy_rules
COPY-RULES := $(wildcard $(COPY-RULES-DIR)/*mk)



## A special copy-rule is needed for each directory containing source or header files.
## Each copy-rule is 'echo'ed into its own file.
## these files, containing the copy-rule, are then 'included' as a 'makefiles' and become 'rules'.
## These 'rules' determine which source files have to be copied to the build-directory.



-include $(COPY-RULES)



# $(call get-make-file-name, directory, suffix )
get-make-file-name = $(COPY-RULES-DIR)/$(addsuffix $2.mk,$(subst /,_,$1))

# $(call create-make-files, directory, suffix )
define create-make-files
 $(shell echo '$(S-DIR)/%.$2: $1%.$2' > $(call get-make-file-name,$1,$2))
 $(shell echo '\tcp ./$$< ./$(S-DIR)/' >> $(call get-make-file-name,$1,$2))
endef 
# echo 'build/s/%.cpp: src/lib/%.cpp' > src_lib_cpp.mk
# echo '	cp ./src/lib/%.cpp ./build/s/' >> src_lib_cpp.mk



## Create The Files Containing the Copy-Rules.
.PHONY: create_copy_rules
create_copy_rules: dir
	-$(shell mkdir -p $(COPY-RULES-DIR)/)
	@-$(foreach i,$(SRC-CPP-DIRs),$(call create-make-files,$i,cpp))
	@-$(foreach i,$(SRC-H-DIRs),$(call create-make-files,$i,h))
	$(info ----------   Copy Rules Found: $(words $(COPY-RULES))   ----------)



## Create Directories.
.PHONY: dir
dir:
	@-$(shell mkdir -p $(S-DIR) $(O-DIR) $(D-DIR) $(M-DIR))
