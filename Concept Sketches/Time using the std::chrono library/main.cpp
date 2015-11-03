
#include <iostream>
#include <chrono>



// Clocks:

/* std::chrono::system_clock
 *   Current time according to the system, is changeable / not steady.
 *
 * std::chrono::steady_clock
 *   Is steady, Goes at a uniform rate. if it says 2 hours has past, its true.
 *
 * std::chrono::high_resolution_clock
 *   Provides smallest possible tick period, available with your system.
 */
void Clocks()
{
  // std ratio:
  std::ratio< 2, 10 > my_r;//  2/10 == 1/5.
  std::cout <<"My Ratio: "<< my_r.num <<"/"<< my_r.den << "\n";

  // Clocks period are represented by a ratios.
  // Printing out the period of the system clock:
  std::cout <<"My system clock's period: "<< std::chrono::system_clock::period::num <<"/"<< std::chrono::system_clock::period::den <<"\n";
}



// Duration:

/* std::chrono::duration< , > 
 *   To represent time duration, we need two things: a number and a unit, like:
 *   2 hours == ( a number and a unit ),  30 seconds == ( a number and a unit ).
 *   
 * std::chrono::duration< int, ratio< 1, 1 > >  ==  number of seconds stored in a int.
 * std::chrono::duration< double, ratio< 60, 1 > >  ==  number of minutes stored in a double.
 *
 * Predefined duration are:
 *   std::chrono::nanoseconds    duration< signed integer type of at least 64 bits, std::nano >
 *   std::chrono::microseconds   duration< signed integer type of at least 55 bits, std::micro >
 *   std::chrono::milliseconds   duration< signed integer type of at least 45 bits, std::milli >
 *   std::chrono::seconds        duration< signed integer type of at least 35 bits, 1 >
 *   std::chrono::minutes        duration< signed integer type of at least 29 bits, std::ratio< 60 > >
 *   std::chrono::hours          duration< signed integer type of at least 23 bits, std::ratio< 3600 > >
 */
void Duration()
{
  std::chrono::microseconds micro( 2700 );// 27000 microseconds.

  // You can transform from a lower resolution to a higher resolution:
  std::chrono::nanoseconds nano = micro;// 2700000 nanoseconds.

  // you can not transform from a higher resolution to a lower resolution, some data will be lost:
  //std::chrono::millisecond mill = micro;
  // So we need to use the 'duration cast':
  std::chrono::milliseconds mill = std::chrono::duration_cast<std::chrono::milliseconds>( micro );// 2 millisecond
  // Note that it will not round the number.

  micro = mill + micro;// 2000 + 2700 = 4700;

  // To print the numbers use the function 'count()':
  std::cout <<"micro: "<< micro.count() <<"\n";
  std::cout <<"nano: "<< nano.count() <<"\n";
  std::cout <<"mill: "<< mill.count() <<"\n";
}



// Time Points:

/* std::chrono::time_point<>  
 *   Represents a point of time, since:
 *   00:00 January 1, 1970 (Corordinated Universal Time - UTC) == epoch of a clock.
 *
 * To get a time point we need two things: a clock and a time unit, like:
 *   std::chrono::time_point< std::chrono::system_clock, std::chrono::milliseconds >
 *   This will give us the elapsed(passed) time sicce epoch in milliseconds.
 *
 * Each clock has its own time point definition:
 *   std::chrono::system_clock::time_point  ==  std::chrono::time_point< std::chrono::system_clock, std::chrono::system_clock::duration >
 *   std::chrono::steady_clock::time_point  ==  std::chrono::time_point< std::chrono::steady_clock, std::chrono::steady_clock::duration >
 *
 */
void Time_point()
{
  // To get the current time of system clock:
  std::chrono::system_clock::time_point tp = std::chrono::system_clock::now();

  // To get the duration between now and epoch:
  std::cout <<"Time since epoch: "<< tp.time_since_epoch().count() <<"\n";

  // Add 2 seconds to the time point:
  tp = ( tp + std::chrono::seconds( 2 ));
  std::cout <<"Add 2 seconds:    "<< tp.time_since_epoch().count() <<"\n";


  // Measure time:
  std::chrono::steady_clock::time_point start = std::chrono::steady_clock::now();
  std::cout <<"Make some time pass...\n";
  std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();
 
  std::chrono::steady_clock::duration d = ( end - start );
  //if( d == 0 ) // Does not work, d is not a number.
  if( d == std::chrono::steady_clock::duration::zero() )
    std::cout <<"No time elapsed!\n";
  else
    {
      std::cout <<"Time elapsed: "<< d.count() <<"\n";
      std::cout <<"Time elapsed in microseconds: "<< std::chrono::duration_cast< std::chrono::microseconds >( d ).count() <<"\n";
    }
}



int main( int argc, char* args[] )
{
  Clocks();
  std::cout << std::endl;

  Duration();
  std::cout << std::endl;

  Time_point();
  std::cout << std::endl;

  return 0;
};
