https://www.youtube.com/watch?v=fvTsFjDuag8



To install:
  sudo apt-get install valgrind

  

To use:
1. Compile you program with the debugging option: '-g'
     g++ -g -o test *.cpp

   The '-g' tells the compiler to store symbol table information in the executable, 
   among other things. This includes:
     - symbol names.
     - type info for symbols.
     - files and line numbers where the symbols came from.
   (This has only a minor effect on performance).
   Debuggers can use this information to output meaningful names for symbols and 
   to associate instructions with particular lines in the source.

2. Now run your program with the 'valgrind' prefix:
     valgrind ./test

     

Valgrind categorizes leaks using these terms:

  - Definitely lost: 
      This is heap allocated memory to which the program no longer has a pointer. 
      Valgrind knows that you once had the pointer but have since lost track of it. 
      This memory is definitely leaked.

  - Indirectly lost: 
      This is heap allocated memory to which the only pointers to it also are lost. 
      For example, if you lost your pointer to the first node of a linked list, then the first 
      node itself would be definitely lost, while any subsequent nodes would be indirectly lost.

  - Possibly lost: 
      This is heap allocated memory to which Valgrind cannot be sure whether 
      there is a pointer or not. 
  
  - Still reachable: 
      Is heap allocated memory to which the program still has a pointer at exit, 
      which typically means that a global variable points to it. To check for these leaks, 
      you'll also have to include the option: --show-reachable=yes



To see more warnings and errors in g++, you can use:
  -Wall -Werror
  
  
  
valgrind --leak-check=full --track-origins=yes
  
  