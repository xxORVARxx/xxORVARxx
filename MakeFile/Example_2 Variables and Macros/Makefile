
## The order of elements in the file has been scrambled intentionally
## to illustrate make's evaluation algorithm.


OUTPUT_DIR := /tmp

$(OUTPUT_DIR)/very_big_file:
	$(free-space)


define free-space
 $(PRINTF) "Free disk space "
 $(DF) . | $(AWK) 'NR = = 2 { print $$4 }'
endef
# /usr/bin/printf "Free disk space "
# /usr/bin/df . | /usr/bin/awk 'NR = = 2 { print $$4 }'


BIN := /usr/bin
PRINTF := $(BIN)/printf
DF := $(BIN)/df
AWK := $(BIN)/awk


## Notice that although the order of lines in the makefile seems backward, 
## it would executes just fine. This is one of the surprising effects of 
## recursive variables.

## The reason this makefile works is that expansion of the command script 
## and the body of the macro are deferred until they are actually used. 
## Therefore, the relative order in which they occur is immaterial to
## the execution of the makefile.
