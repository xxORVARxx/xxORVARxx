
#include <iostream> 



struct my_Top {
  char m_top;
};


// Let's say that this is the Base, not 'my_Top'.
class my_Base : public my_Top
{
public:
  my_Base( int s_xAB ) : m_x(s_xAB) {
    std::cout <<"my_Base's Constructor Called.\n"; 
  }
  ~my_Base() { std::cout <<"my_Base's Destructor Called.\n"; }
protected:
  int m_x;
};
 


class my_Middle_A : public my_Base
{
public:
  my_Middle_A( int s_xA ) : my_Base( s_xA ) { 
    std::cout <<"  my_Middle_A's Constructor Called.\n"; 
  }
  ~my_Middle_A() { std::cout <<"  my_Middle_A's ~Destructor Called.\n"; }
};
 


class my_Middle_B : public my_Base
{
public:
  my_Middle_B( int s_xB ) : my_Base( s_xB ) { 
    std::cout <<"  my_Middle_B's Constructor Called.\n"; 
  }
  ~my_Middle_B() { std::cout <<"  my_Middle_B's ~Destructor Called.\n"; }
};



class my_End : public my_Middle_A, public my_Middle_B
{
public:
  my_End( int s_xA, int s_xB ) : my_Middle_A( s_xA ), my_Middle_B( s_xB ) {
    std::cout <<"    my_End's Constructor Called.\n"; 
  }
  ~my_End() { std::cout <<"    my_End's ~Destructor Called.\n"; }
public:
  int Get_A_x() { return my_Middle_A::m_x; }
  int Get_B_x() { return my_Middle_B::m_x; }
};



int main( int argc, char* args[] )
{
  my_End c_end ( 65, -66 );
  c_end.my_Middle_A::m_top = 'T';

  std::cout <<"\n Get A's x: " << c_end.Get_A_x() <<".\n";
  std::cout <<  " Get B's x: " << c_end.Get_B_x() <<".\n";
  std::cout <<  " The Top is '"<< c_end.my_Middle_A::m_top <<"'.\n\n";

  return 0;
}



// This is what will be printed:

/* my_Base's Constructor Called.
 *   my_Middle_A's Constructor Called.
 * my_Base's Constructor Called.
 *   my_Middle_B's Constructor Called.
 *     my_End's Constructor Called.
 *
 *  Get A's x: 65.
 *  Get B's x: -66.
 *  The Top is 'T'.
 *
 *     my_End's ~Destructor Called.
 *   my_Middle_B's ~Destructor Called.
 * my_Base's Destructor Called.
 *   my_Middle_A's ~Destructor Called.
 * my_Base's Destructor Called.
 */



// This is what the inheritance tree looks like:

/*    my_Top        my_Top
 *       |             |
 *    my_Base       my_Base
 *       |             |
 *  my_Middle_A    my_Middle_B
 *           \      /
 *            my_End 
 */
