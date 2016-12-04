
/*  To Compile:
 *    g++ -std=c++11 -O3 -o Tools/Find_average Tools/Find_average.cpp
 */
#include <iostream>
#include <fstream>
#include <limits>
#include <string>
#include <vector>
#include <utility>
#include <numeric>



const unsigned int g_scale = 10;
const unsigned int g_group = 100;



void Find_data_in_file( std::ifstream& _file ) {
  _file >> std::ws;
  if( _file.peek() == '{' ) {
    _file.get();
    return;
  }
  _file.ignore( std::numeric_limits< std::streamsize >::max(), '{' );
  _file.get();
  _file >> std::ws;
}

void Fill_vector( std::ifstream& _file, std::vector<double>& _vec, unsigned int _i = ~0 ) {
  for( ; (( _i > 0 )&&( _file.peek() != '}' )&& _file.good()) ; --_i ) {
    double d = 0.0d;
    _file >> d >> std::ws;
    _vec.push_back( d );
  }
}



int main( int argc, char* argv[] ) {
  // Create The Logger;
  std::ofstream logger( "Tools/Log.txt", std::fstream::out | std::fstream::app );
  if( ! ( logger.good() && logger.is_open())) {
    std::cerr <<"Error When Finding Average, Log File Not Good!\n";
    return -1;
  }
  // Get File Name:
  std::string file_name;
  if( argc == 2 )
    file_name = std::string( argv[1] );
  else {
    std::cerr <<"Error When Finding Average, No Data-File Given, Input One File-Name In Quotes!\n";
    logger <<"Error When Finding Average, No Data-File Given, Input One File-Name In Quotes!\n";
    return -1;
  }
  // Open The File:
  std::ifstream file( file_name, std::ifstream::in );
  if( ! ( file.good() && file.is_open())) {
    std::cerr <<"Error When Finding Average, File Not Good: '"<< file_name <<"'!\n";
    logger <<"Error When Finding Average, File Not Good: '"<< file_name <<"'!";
    return -1;
  }
  // Finding Where The Data begins In The File:
  Find_data_in_file( file );
  if( ! file.good()) {
    std::cerr <<"Error When Finding Average, Data In File Not Good: '"<< file_name <<"'! Need: '{ 1.1 2.2 3.3 }' !\n";
    logger <<"Error When Finding Average, Data In File Not Good: '"<< file_name <<"'! Need: '{ 1.1 2.2 3.3 }' !\n";
    return -1;
  }
  logger <<"Data-File Name: '"<< file_name <<"'.\n";
  logger <<"g_scale = "<< g_scale <<" \t (This Is How Many Of The First Numbers Are Used For Down Scaleing).\n";
  logger <<"g_group = "<< g_group <<" \t (This Is How Many Numbers Can Max Be In One Group).\n";

  
  
  // * When Finding The Average Of Very Many Numbers, There Can Be Problems.
  // * One Is When You Are Add Together All The Numbers The Sum Can Get Very High
  // * And The Variable Holding The Sum Can Overflow Or Lose Precision.
  // *
  // * To Fix This, Take The Average Of The First Few Numbers And Then Subtract
  // * That From All The Numbers. Now All The Numbers Will Be Around Zero,
  // * And Then Just Add That Number To The End Result.

  // Making The Down Scale Number:
  std::vector<double> number_vec;
  number_vec.reserve( g_group );
  
  Fill_vector( file, number_vec, g_scale );
  double down_scale = std::accumulate( number_vec.begin(), number_vec.end(), 0.0d );
  down_scale /= (double)number_vec.size();
  if( number_vec.size() < g_scale ) {
    logger <<"The Data-File Has Less Then "<< g_scale <<" Numbers, So Finishing Early.\n";
    std::cout << down_scale;
    return 0;
  }
  logger <<"The Down Scale Number Is: \n  "<< down_scale <<"\n";

  

  // * Breaking The Data Into Smaller Groups Can Also Help.
  // * You Can find average in two ways:
  // * ( x1 + x2 + x3 ... xn ) / n = a
  // * ( ga1 * ( gs1 / n )) + ( ga2 * ( gs2 / n )) + ... + ( gan * ( gsn / n )) = a
  // * ga = Group Average, gs = Group Size, n = Total Size, a = Total Average.

  // Break The Data Into Groups, And Finding The Group's Averages:
  // A Group Is a std:pair If The Group's Size And It's Average.
  std::vector< std::pair< double, double >> group_average_vec;
  logger <<"Making Groups...\n";
  
  while(( file.peek() != '}' )&& file.good()) {
    Fill_vector( file, number_vec, g_group - number_vec.size());

    double group_average = 0.0d;
    for( const auto& p : number_vec )
      group_average += ( p - down_scale );
    group_average /= (double)number_vec.size();
    
    group_average_vec.emplace_back( number_vec.size(), group_average );
    logger <<"   Size: "<< number_vec.size() <<", \t Average: "<< group_average <<"\n";
    if( number_vec.size() < g_group )
      break;
    number_vec.clear();
  }


  
  // How Many Number In Totla Are We Taking The Average Of:
  double total_num_of_num = 0.0d;
  for( const auto& p : group_average_vec ) {
    total_num_of_num += p.first;
  }
  logger <<"The Total Size Of The Data: \n  "<< total_num_of_num <<"\n";
  // Here Is The Average Of All The Numbers:
  double the_average = 0.0d;
  for( const auto& p : group_average_vec ) {
    the_average += (( p.second + down_scale ) * ( p.first / total_num_of_num ));
  }
  logger <<"And The Total Average Is: \n  "<< the_average <<"\n";
  logger <<"\n\n"; 
  // Close The Data-File And The Logger:
  file.close();
  logger.close();
  // Done!
  std::cout << the_average <<' ';
  return 0;
}



/*
 * EXAMPLE 1:
 *  (1+2+3+4+5+6+7+8+9)/9 = 5
 *
 *  (1+2+3+4)/4 = 2,5
 *  (5+6+7+8+9)/5 = 7
 *
 *  ((2,5⋅(4/9))+(7⋅(5/9))) = 5
 *
 *
 * EXAMPLE 2:
 *  (10+45+71+17+23+55+11+31+07+05+14+29+99+84)/14 = 35,785714
 *
 *  (10+45+71)/3 = 42
 *  (17+23+55+11+31+07)/6 = 24
 *  (05+14+29)/3 = 16
 *  (99+84)/2 = 91,5
 *
 *  (42⋅(3/14))+(24⋅(6/14))+(16⋅(3/14))+(91,5⋅(2/14)) = 35,785714
 */
