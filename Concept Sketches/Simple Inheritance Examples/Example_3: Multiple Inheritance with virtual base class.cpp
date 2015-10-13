
#include <iostream> 



struct my_Top {
  char m_top;
};


// Let's say that this is the Base, not 'my_Top'.
class my_Virtual_base : public my_Top
{
public:
  my_Virtual_base( int s_x ) : m_x(s_x) {
    std::cout <<"my_Virtual_base's Constructor Called.\n"; 
  }
  ~my_Virtual_base() { std::cout <<"my_Virtual_base's Destructor Called.\n"; }

  int m_x;
};
 


// Note the 'virtual' keyword here:
class my_Middle_A : virtual public my_Virtual_base
{
public:
  // Middle_A still has to call the Virtual_base's constructor, but the constructor-call is simply ignored.
  my_Middle_A( int s_x, int s_y ) : my_Virtual_base( s_x + 1000 ), m_y(s_y) { 
    std::cout <<"  my_Middle_A's Constructor Called.\n"; 
  }
  ~my_Middle_A() { std::cout <<"  my_Middle_A's ~Destructor Called.\n"; }

  // my_Middle_B also has a variable called: m_y.
  int m_y;
};
 

// Note the 'virtual' keyword here.
class my_Middle_B : virtual public my_Virtual_base
{
public:
  // Middle_B still has to call the Virtual_base's constructor, but the constructor-call is simply ignored.
  my_Middle_B( int s_x, int s_y ) : my_Virtual_base( s_x - 1000 ), m_y(s_y) { 
    std::cout <<"  my_Middle_B's Constructor Called.\n"; 
  }
  ~my_Middle_B() { std::cout <<"  my_Middle_B's ~Destructor Called.\n"; }

  // my_Middle_A also has a variable called: m_y.
  int m_y;
};



class my_End : public my_Middle_A, public my_Middle_B
{
public:
  // my_End is responsible for creating the Virtual_base, so this constructor-call will be used.
  my_End( int s_x, int s_Ay, int s_By ) : my_Virtual_base( s_x + 5 ), my_Middle_A( s_x, s_Ay ), my_Middle_B( s_x, s_By ) {
    std::cout <<"    my_End's Constructor Called.\n"; 
  }
  ~my_End() { std::cout <<"    my_End's ~Destructor Called.\n"; }
};



int main( int argc, char* args[] )
{
  my_End c_end( 0, 10, 20 );
  c_end.m_top = 't';

  std::cout << std::endl;
  std::cout <<" Virtual_base's x: "<< c_end.m_x <<".\n";
  std::cout <<" Middle_A's y: "    << c_end.my_Middle_A::m_y <<".\n"; 
  std::cout <<" Middle_B's y: "    << c_end.my_Middle_B::m_y <<".\n";
  std::cout <<" The Top is '"      << c_end.m_top <<"'.\n\n";

  return 0;
}



// This is what will be printed:

/* my_Virtual_base's Constructor Called.
 *   my_Middle_A's Constructor Called.
 *   my_Middle_B's Constructor Called.
 *     my_End's Constructor Called.
 *
 *  Virtual_base's x: 5.
 *  Middle_A's y: 10.
 *  Middle_B's y: 20.
 *  The Top is 't'.
 *
 *     my_End's ~Destructor Called.
 *   my_Middle_B's ~Destructor Called.
 *   my_Middle_A's ~Destructor Called.
 * my_Virtual_base's Destructor Called.
 */



// This is what the inheritance tree looks like:

/*           my_Top
 *              |
 *        my_Virtual_Base
 *           /      \
 *  my_Middle_A    my_Middle_B
 *           \      /
 *            my_End 
 */
