
/*  To Compile:
 *    g++ -std=c++11 -O3 -o Tools/Normalize_average Tools/Normalize_average.cpp
 */
#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <algorithm>



int main( int argc, char* argv[] ) {
  // Get File Name:
  std::string data_file_name;
  std::string nl_file_name;
  std::string nh_file_name;
  if( argc == 4 ) {
    data_file_name = std::string( argv[1] );
    nl_file_name = std::string( argv[2] );
    nh_file_name = std::string( argv[3] );
  }
  else {
    std::cerr <<"Error When Normalize Average, Need Three Files, Input Three File-Names In Quotes!\n";
    return -1;
  }
  // Open The Data File:
  std::ifstream data_file( data_file_name, std::ifstream::in );
  if( ! ( data_file.good() && data_file.is_open())) {
    std::cerr <<"Error When Normalize Average, File Not Good: '"<< data_file_name <<"'!\n";
    return -1;
  }
  // Read The Data Into a Vector:
  std::vector<double> data_vec;
  while( true ) {
    double d;
    data_file >> d;
    if( data_file.good())
      data_vec.push_back( d );
    else
      break;
  }
  data_file.close();


  
  // Finds The lowest and The Highest Number:
  double lowest_number = *( std::min_element( data_vec.begin(), data_vec.end()) );
  double highest_number = *( std::max_element( data_vec.begin(), data_vec.end()) );
  if( lowest_number == 0.0d )
    lowest_number = 1.0d;
  if( highest_number == 0.0d )
    highest_number = 1.0d;


    
  // Open The Normalize LOW File:
  std::ofstream nl_file( nl_file_name, std::ifstream::out | std::ifstream::trunc );
  if( nl_file.is_open()) {
    for( auto d : data_vec ) {
      if( ! nl_file.good()) {
	std::cerr <<"Error When Normalize Average, File Not Good: '"<< nl_file_name <<"'!\n";
	return -1;
      }
      // Calculate The New Value And Put Into File:
      nl_file << d / lowest_number << ' ';
    }
    nl_file.close();
  }
  else {
    std::cerr <<"Error When Normalize Average, Can't Open File: '"<< nl_file_name <<"'!\n";
    return -1;
  }
  
  // Open The Normalize HIGH File:
  std::ofstream nh_file( nh_file_name, std::ifstream::out | std::ifstream::trunc );
  if( nh_file.is_open()) {
    for( auto d : data_vec ) {
      if( ! nh_file.good()) {
	std::cerr <<"Error When Normalize Average, File Not Good: '"<< nh_file_name <<"'!\n";
	return -1;
      }
      // Calculate The New Value And Put Into File:
      nh_file << d / highest_number << ' ';
    }
    nh_file.close();
  }
  else {
    std::cerr <<"Error When Normalize Average, Can't Open File: '"<< nh_file_name <<"'!\n";
    return -1;
  }


  
  return 0;
}
