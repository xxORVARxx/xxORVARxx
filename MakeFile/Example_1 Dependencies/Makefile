
# Make uses dependencies to determine not only what is built, 
# but also what order it gets built in. 
# We can demonstrate that with a simple example:


.PHONY: all
all: dep-A dep-B dep-C


# Here is a generic rule which says to run "touch dep-XXX" 
# for any target named dep-XXX.
dep-%:
	touch $@


# dep-A depends on dep-1, so we must first...
# dep-1 has no dependencies, so it can be built.
# And after that we built dep-A.
dep-A: dep-1

dep-B: dep-2

dep-C: dep-3


.PHONY: clean
clean:
	-rm -f dep-*


# If we only wanted to build dep-B, we do:
#   make dep-B
# Which actually means "build dep-B and anything which it depends on"
