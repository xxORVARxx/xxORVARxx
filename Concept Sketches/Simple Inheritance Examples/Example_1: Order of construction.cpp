
#include <iostream> 



class my_A
{
public:
  my_A( int s_x ) : m_x(s_x) { std::cout <<"my_A's Constructor Called.\n"; }
  ~my_A() { std::cout <<"my_A's ~Destructor Called.\n"; }
protected:
  int m_x;
};
 


class my_B: public my_A
{
public:
  my_B( int s_x, double s_y ) : my_A( s_x ), m_y(s_y) { std::cout <<"my_B's Constructor Called.\n"; }
  ~my_B() { std::cout <<"my_B's ~Destructor Called.\n"; }
protected:
  double m_y;
};
 


class my_C: public my_B
{
public:
  my_C( int s_x, double s_y, char s_z ) : my_B( s_x, s_y ), m_z(s_z) { std::cout <<"my_C's Constructor Called.\n"; }
  ~my_C() { std::cout <<"my_C's ~Destructor Called.\n"; }
  void Print() { std::cout <<"\n x:"<< m_x <<"  y:"<< m_y <<"  z:"<< m_z <<"\n\n"; }
protected:
  char m_z;
};



int main( int argc, char* args[] )
{
  my_C the_c( 5, 4.3, 'R' );
  the_c.Print();
  return 0;
}



// This is what will be printed:

/* my_A's Constructor Called.
 * my_B's Constructor Called.
 * my_C's Constructor Called.
 *
 *  x:5  y:4.3  z:R
 *
 * my_C's ~Destructor Called.
 * my_B's ~Destructor Called.
 * my_A's ~Destructor Called.
 */
