
#include <iostream>
#include <string>
#include <chrono>
#include <sstream>



int main( int argc, char* argv[] ) {
  unsigned int size = SIZE;
  typedef std::chrono::high_resolution_clock clock;
  typedef std::chrono::duration< double, std::milli > ms;
  std::string str;
  std::string s1 = "This Is Test String Number: 1 \n";

  // Timer Start!
  auto t0 = clock::now();
#if TEST==1
  for( unsigned int i = 0 ; i < size ; ++i ) {
    str = s1 + "This Is Test String Number: 2 \n" + " and This Is The Test String Number: 3 \n";
  }
#elif TEST==2
  for( unsigned int i = 0 ; i < size ; ++i ) {
    str = s1; 
    str += "This Is Test String Number: 2 \n";
    str += " and This Is The Test String Number: 3 \n";
  }
#elif TEST==3
  for( unsigned int i = 0 ; i < size ; ++i ) {
    str = s1; 
    str.append("This Is Test String Number: 2 \n");
    str.append(" and This Is The Test String Number: 3 \n");
  }
#elif TEST==4
  for( unsigned int i = 0 ; i < size ; ++i ) {
    std::ostringstream oss;
    oss << s1;
    oss << "This Is Test String Number: 2 \n";
    oss << " and This Is The Test String Number: 3 \n";
    str = oss.str();
  }
#endif
  auto t1 = clock::now();
  // Timer End!
  
  std::cout << ms( t1 - t0 ).count() <<' ';
  return 0;
}
