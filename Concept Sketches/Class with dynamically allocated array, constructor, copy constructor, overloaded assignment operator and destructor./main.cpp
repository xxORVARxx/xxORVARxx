 
#include "My_heap_stack.h"


 
int main ( int argc, char* args[] )
{
  //Stack my_X;// 'Default Constructor' Called.
  // The 'Default Constructor' is private so this is not allowed!

  //Stack my_X();// This is a 'Function Declaration'!
  // This declares a function with no parameters, and Stack as a return type!


  Stack my_A( 10 );// 'Constructor' Called.
  my_A.Push( 5 );
  my_A.Push( 2 );
  my_A.Push( 97 );
  my_A.Push( 33 );
  std::cout <<"A:  "<< my_A <<"\n\n\n";


  Stack my_B = my_A;// 'Copy Constructor' Called.
  my_B.Push( -55 );
  std::cout <<"B:  "<<  my_B <<"\n\n\n";


  Stack my_C( my_B );// 'Copy Constructor' Called.
  my_B.Push( 999 );
  std::cout <<"C:  "<<  my_B <<"\n\n\n";


  my_B = my_A;// 'Assignment Operator' Called.
  std::cout <<"B:  " <<  my_B <<"\n\n\n";
  

  Stack my_D = my_A = my_B = my_C;// Two: 'Assignment Operators' Called, and then a: 'Copy Constructor'.
  std::cout <<"D:  " <<  my_B <<"\n\n\n";
  
  return 0;
  // Four 'Destructors' Called.
}
