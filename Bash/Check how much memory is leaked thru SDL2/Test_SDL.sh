 
 #!/bin/bash

 touch Valgrind_Output.log

echo 'Checking how much memory is leaked thru SDL2.'

 for i in $( seq 0 6 );
 do
     echo
     echo "Doing test $i..."
     valgrind --leak-check=full ./Tester "$i" 2> Valgrind_Output.log
     grep 'definitely lost:' Valgrind_Output.log
 done    
