
The 'make' Manual:
  http://www.gnu.org/software/make/manual/make.html


When 'make' recompiles: 
 - Each changed C++ source file must be recompiled.
 - If a header file has changed, each C++ source file 
   that includes the header file must be recompiled. 

 - If any source file has been recompiled, all the object files, 
   whether newly made or saved from previous compilations, 
   must be linked together to produce the new executable file.


A simple makefile consists “rules”, with the following shape:
 -----------------------------------------------------
|target … : prerequisites …
|	recipe
|        …
|        …  
 -----------------------------------------------------

A TAB character must come at the beginning of every line in the 
recipe to distinguish recipes from other lines in the makefile.

The prerequisites are NOT always updating from left to right.

'make' echoes the commands, after macro substitution to show you 
what is happening as it happens. @ will to turn that off:
 -----------------------------------------------------
|install:
|	@echo You must be root to install.
 -----------------------------------------------------

 
Variables:
 -----------------------------------------------------
|OBJS = main.o hello.o factorial.o
|OBJS += another.o
 -----------------------------------------------------
This sets OBJS to: "main.o hello.o factorial.o another.o".
Using `+=' is similar to:
 -----------------------------------------------------
|OBJS = main.o hello.o factorial.o
|OBJS := $(OBJS) another.o
 -----------------------------------------------------

This table shows what occurs when variables are expanded:
+-------------------------------------------------------+
| Definition: | Expansion of a: | Expansion of b:       |
+-------------------------------------------------------+
|a = b        | Immediate       | Deferred              |
+-------------------------------------------------------+
|a ?= b       | Immediate       | Deferred              |
+-------------------------------------------------------+
|a := b       | Immediate       | Immediate             |
+-------------------------------------------------------+
|a += b       | Immediate       | Deferred or immediate |
+-------------------------------------------------------+
|define a     | Immediate       | Deferred              |
| b ...       |                 |                       |
| b ...       |                 |                       |
|endef        |                 |                       |
+-------------------------------------------------------+


Automatic Variables:

$@ = Represents the name of the target:
	 -----------------------------------------------------
	|client: client.cpp
	|	$(CC) client.cpp -o $@
	|#(this produce a output files named client)
	 -----------------------------------------------------
$? = List of prerequisites newer the the target: 
     (i.e. those that have changed since the last make)
	 -----------------------------------------------------
	|client: client.cpp
	|	$(CC) $? -o client
	 -----------------------------------------------------
$^ = List of all the prerequisites:
     (duplicate names, however, will be removed)
	 -----------------------------------------------------
	|viewsource: client.cpp server.cpp
	|	more -ds $^
	|#(print the source to the screen)
	 -----------------------------------------------------
$+ = List like $^, but it keeps duplicates.
$< = Represents only the current prerequisit.

In addition, each of the above variables has two variants:
 - Returns only the directory portion of the value:
     $(@D)    $(?D)    $(^D)    $(+D)    $(<D)

 - Returns only the file portion of the value.
     $(@F)    $(?F)    $(^F)    $(+F)    $(<F)


Target- and Pattern-Specific Variables:

Make provides target-specific variables. These are variable 
definitions attached to a target that are valid only during 
the processing of that target and any of its prerequisites.

The general syntax for target-specific variables is:
 -----------------------------------------------------
|target...: variable = value
|target...: variable := value
|target...: variable += value
|target...: variable ?= value
 -----------------------------------------------------
The variable valid during the processing of all prerequisites as well.

To redefine a variable just for a single rule or pattern:
 -----------------------------------------------------
|# This is the original rule:
|gui.o: gui.h
|	$(COMPILE.c) $(OUTPUT_OPTION) $<
|
|# This is what we need:
|gui.o: gui.h
|	$(COMPILE.c) -DUSE_NEW_MALLOC=1 $(OUTPUT_OPTION) $<
|
|# We add our new option to any existing value already present:
|gui.o: CPPFLAGS += -DUSE_NEW_MALLOC=1
|gui.o: gui.h
|	$(COMPILE.c) $(OUTPUT_OPTION) $<
|
|# This is how we end up doing it, the right way:
|gui.o: CPPFLAGS += -DUSE_NEW_MALLOC=1
|gui.o: gui.h
 -----------------------------------------------------
CPPFLAGS is built in to the default C compilation rule


Macros: (or "canned sequence")

Note that the GNU make manual seems to use the words 
variable and macro interchangeably.

Here is how to define a macro:
 -----------------------------------------------------
|define create-jar
| @echo Creating $@...
| $(RM) $(TMP_JAR_DIR)
| $(MKDIR) $(TMP_JAR_DIR)
| $(CP) -r $^ $(TMP_JAR_DIR)
| cd $(TMP_JAR_DIR) && $(JAR) $(JARFLAGS) $@ .
| $(JAR) -ufm $@ $(MANIFEST)
| $(RM) $(TMP_JAR_DIR)
|endef
 -----------------------------------------------------
Here is how to use a macro:
 -----------------------------------------------------
|$(UI_JAR): $(UI_CLASSES)
|	$(create-jar)
 -----------------------------------------------------

Macros are treated as a string literal, so 
NO COMMENTS can be in-between define and endef! 

If a macro is expanded in the context of a target's recipe,
each line of the macro is inserted with a leading tab character.


Pattern Rules:

 -----------------------------------------------------
|%.o: %.cpp
|obj/%.o: src/%.cpp
|	g++ $^ -c -o $@
|
|obj:
|	@mkdir -p obj
|
|obj/%.o : src/%.cpp | obj
 -----------------------------------------------------


Static Pattern Rules:

Applies only to a specific list of targets:
 -----------------------------------------------------
|$(OBJECTS): %.o: %.c
|	$(CC) -c $(CFLAGS) $< -o $@
 -----------------------------------------------------
it's limited to the files listed the $(OBJECTS) variable.


Suffix Rules:

Suffix rules are a little confusing:
 -----------------------------------------------------
|.c.o:
|	$(COMPILE.c) $(OUTPUT_OPTION) $<
|# Alternatively:
|%.o: %.c
|	$(COMPILE.c) $(OUTPUT_OPTION) $<
 -----------------------------------------------------


Implicit Rules:

GNU make has about 90 built-in implicit rules.
(To see thet list use the commandline option: make -p )
An implicit rule is either a pattern rule or a suffix rule.

This rule says how to make x out of x.cpp:
(run cc on x.cpp and call the output x)
 -----------------------------------------------------
|.cpp:
|	$(CC) $(CFLAGS) $@.cpp $(LDFLAGS) -o $@
 -----------------------------------------------------
The rule is implicit because no particular target is 
mentioned. It can be used in all cases.

Another common implicit rule is for the construction of:
.o (object) files out of .cpp (source files).
 -----------------------------------------------------
|.cpp.o:
|	$(CC) $(CFLAGS) -c $<
|# Alternatively:
|.cpp.o:
|	$(CC) $(CFLAGS) -c $*.cpp
 -----------------------------------------------------


Functions:

$(filter pattern...,text)
  Selects every word that match the pattern.
  $(filter src/%.h,$(FILES))

$(filter-out pattern...,text)
  Selects every word that does NOT match the pattern.

$(findstring string,text)
  This function looks for string in text. If the string is found, 
  the function returns the string. otherwise, it returns nothing.
  The search string cannot contain wildcard characters or % 
  
$(subst search-string,replace-string,text)
  Non-wildcard: %, search and replace.

$(patsubst search-pattern,replace-pattern,text)
  $(patsubst src/%.cpp,obj/%.obj,$(SRCS))


$(words text)
  This returns the number of words in text.

$(word n,text)
  This returns the n-th word in text. (like: text[n] in cpp)
  The first word is numbered 1.

$(firstword text)
  This returns the first word in text. 
  This is equivalent to $(word 1,text).

$(lastword text)
  returning the last word of the given list.
  It is functionally equivalent to:
  $(word $(words list),list)

$(wordlist start,end,text)
  This returns the words in text from start to end, inclusive.
  The first word is numbered 1.


$(call macro-name[, param1...])
  - This function that expands its first argument and replaces 
    occurrences of $1, $2, etc., with the remaining arguments 
    it is given.
  - Notice that the first argument to call is an unexpanded 
    variable name.(no dollar sign and parentheses)

$(sort list)
  The sort function sorts its list argument and removes duplicates,
  in lexicographic order. So: $(sort d b s d t ) = b d s t

$(shell command)
  Accepts a single argument that is expanded, and executed.
  $(shell echo src/*.cpp)
  The standard output of the command is then read and returned as 
  the value of the function:

  
$(abspath names...)

$(realpath names...)

$(wildcard pattern...)
  sources := $(wildcard *.cpp *.h)
  sources := $(wildcard src/*.cpp)

$(dir list...)
  - Returns the directory portion of each word in list.
  - This returns every subdirectory that contains cpp files:
      source-dirs := $(sort $(dir $(shell find . -name '*.cpp')))

$(notdir name...)
  returns the file without the directory portion

$(suffix name...)
  returns the suffix of each word in its argument.

$(basename name...)
  returns the filename without its suffix.

$(addsuffix suffix,name...)
  Appends the given suffix text to each word in name.

$(addprefix prefix,name...)
  $(addprefix bin/,$(PROGRAMS))

$(join prefix-list,suffix-list)


$(strip text)
  Removes all leading and trailing whitespace from text
  and replaces all internal whitespace with a single space.

$(origin variable)
  The possible return values of origin are:
    undefined, default, environment, environment override,
    file, command line, override or automatic.

$(flavor var_name)
  it tells you something about a variable. return values:
    undefined, recursive or simple.

$(value var_name)
  The value function provides a way for you to use the 
  value of a variable without having it expanded.


 -----------------------------------------------------
|words := he the hen other the%
|
|get-the:
|	@echo he matches: $(filter he,$(words))
|	@echo %he matches: $(filter %he,$(words))
|	@echo he% matches: $(filter he%,$(words))
|	@echo %he% matches: $(filter %he%,$(words))
 -----------------------------------------------------
|all_source := count_words.c counter.c lexer.l counter.h lexer.h
|
|to_compile := $(filter-out %.h,$(all_source))
 -----------------------------------------------------
|sources := count_words.c counter.c lexer.c
|
|objects := $(subst .c,.o,$(sources))
 -----------------------------------------------------
|strip-trailing-slash = $(patsubst %/,%,$(directory-path))
 -----------------------------------------------------
|CURRENT_PATH := $(subst /, ,$(HOME))
|
|words:
|	@echo My HOME path has $(words $(CURRENT_PATH)) directories.
 -----------------------------------------------------
|version_list := $(subst ., ,$(MAKE_VERSION))
|minor_version := $(word 2,$(version_list))
 -----------------------------------------------------
|stdout := $(shell echo normal message, NOT a stderr!)
|
|shell-value:
|	# $(stdout)
 -----------------------------------------------------
|START_TIME := $(shell date)
|CURRENT_TIME = $(shell date)
|# - The START_TIME simple-variable causes the date command to
|#    execute anly once when the simple-variable is defined.
|# - But the CURRENT_TIME recursive-variable will reexecute date 
|#    each time the recursive-variable is used in the makefile.
 -----------------------------------------------------


$(if condition,then-part,else-part)

$(and condition1[,...conditionN))
  If all arguments expand to a non-empty string then the result 
  of the expansion is the expansion of the LAST argument.
  If an argument expands to an empty string the processing stops 
  and the result of the expansion is the empty string.

$(or condition1[,...conditionN])
  The result of the expansion will be the expansion of the first 
  non-empty string. If all the expansions are empty, the result is
  a empty string.

$(foreach variable,list,body)



Includes:

include Makefile.in
-include deps.mk


Recursiv Make:
 -----------------------------------------------------
|all:
|	make -C src
|	make -C doc
|	make -C tests -f test.mk  #(tests/test.mk)
 -----------------------------------------------------


Special Targets:
.PHONY
.INTERMEDIATE
.SECONDARY
.PRECIOUS
.DELETE_ON_ERROR


