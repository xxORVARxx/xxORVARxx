
/* To compile:
 *   g++ -std=c++11 -o test singleton.cpp
 *
 */
#include <iostream>
#include <vector>
#include <algorithm>



// Singleton Class: (No memory leak this way)
class the_Singleton_class
{
private:
  the_Singleton_class() { std::cout << "\t Construction!\n"; }
  the_Singleton_class( const the_Singleton_class& ) = delete;
  the_Singleton_class& operator=( const the_Singleton_class& ) = delete;

public:
  ~the_Singleton_class() { std::cout << "\t Destruction! (No memory leak)\n"; }

  static the_Singleton_class& Instance()
  {
    static the_Singleton_class instance;
    return instance;
  }
  void Print() { std::cout <<"\t Hello from my Singleton Class!\n"; }

private:
  int m_arr[10];
};



int main( int argc, char* argv[] )
{
  std::cout <<"Hello! main() starts.\n";

  the_Singleton_class::Instance().Print();

  std::cout <<"Bye! main() ends.\n";
  return 0;
}
