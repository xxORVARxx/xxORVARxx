 
#include<iostream>
#include <algorithm>
#include <random>



template< typename T > 
bool Get_number_from_cin( T& num )
{
  std::cin >> num;
  if( std::cin.fail() )// User didn't input a number:
    {
      std::cin.clear(); // Reset failbit.
      // This tels cin to ignore maximum number of characters, starting after the first '\n' (or EOF):
      std::cin.ignore( std::numeric_limits< std::streamsize >::max(), '\n' );
      return false;
    }   
  return true;
}

void Set_the_numbers( float& starting_number, float& action_number )
{
  std::cout <<"\nThe Numbers can NOT be ZERO! nor can they be the SAME number!\n";
  std::cout <<"Input a Starting Number:  ";
  while(( ! Get_number_from_cin< float >( starting_number ) )||( starting_number == 0 ))
    std::cout <<"Input a Starting Number:  ";
 
  std::cout <<"Input a Action Number:  ";
  while(( ! Get_number_from_cin< float >( action_number ) )||( action_number == 0 )||( starting_number == action_number ))
    std::cout <<"Input a Action Number:  ";
}

void Text_1()
{
 std::cout <<"\n\nThis is a number game!\n";
 std::cout <<"There are four action: Add, Subtract, Multiply and Divide.\n";
 std::cout <<"Each action will be executed once on the Starting-Number (with the Action-Number), but in a random order.\n";
 std::cout <<"Can you see the order of which the actions where executed, which led to the end result?\n";
}



// These functions take in a function-pointer array as a parameter:
void Face_1( float (*functions_ptr_arr[])( float x, float y, bool print ), float starting_number, float action_number )
{
  std::cout <<"\nThe Starting Number is: "<< starting_number <<"  and the Action Number is: "<< action_number <<"\n\n";
  float end_number = starting_number;
  for( unsigned int i = 0 ; i < 4 ; ++i )
    end_number = functions_ptr_arr[i]( end_number, action_number, false );
  std::cout <<"After all the Actions, the End-Number is: "<< end_number <<"\n";
  char c;
  std::cout <<"\nNeed a hint? input any key. ";
  std::cin >> c;
}

void Face_2( float (*functions_ptr_arr[])( float x, float y, bool print ), float starting_number, float action_number )
{
  std::cout <<"\n\nThe Starting Number is: "<< starting_number <<"  and the Action Number is: "<< action_number <<"\n\n";
  float end_number = starting_number;
  for( unsigned int i = 0 ; i < 4 ; ++i ) {
    end_number = functions_ptr_arr[i]( end_number, action_number, false );
    std::cout <<"After Action "<< i + 1 <<", the Number is: "<< end_number <<"\n";
  }
  char c;
  std::cout <<"\nTo see the answer, input any key. ";
  std::cin >> c;
}

void Face_3( float (*functions_ptr_arr[])( float x, float y, bool print ), float starting_number, float action_number )
{
  std::cout <<"\n\nThe Starting Number is: "<< starting_number <<"  and the Action Number is: "<< action_number <<"\n\n";
  float end_number = starting_number;
  for( unsigned int i = 0 ; i < 4 ; ++i ) {
    std::cout <<"Action "<< i + 1 <<" is: " << end_number;
    end_number = functions_ptr_arr[i]( end_number, action_number, true );
    std::cout << action_number <<" = "<< end_number <<"\n";
  }
}



// These are the functions that the pointers will point to:
float Add( float x, float y, bool print )
{
  if( print ) std::cout <<" Added to ";
  return( x + y );
}

float Subtract( float x, float y, bool print )
{
  if( print ) std::cout <<" Subtracted from ";
  return( x - y );
}

float Multiply( float x, float y, bool print )
{
  if( print ) std::cout <<" Multiplied with ";
  return( x * y );
}

float Divide( float x, float y, bool print )
{
  if( print ) std::cout <<" Divided with ";
  return( x / y );
}



int main( int argc, char* args[] )
{
  float starting_number, action_number;
  Set_the_numbers( starting_number, action_number );
  Text_1();

  {
    // This is a declaration of a function-pointer:
    float (*functions_ptr)( float x, float y, bool print );
    // Make the function-pointer point to the Add function:
    functions_ptr = Add;
    // Use the function-pointer to call the Add function, this will add 5 to 5 and test_num will be 10:
    float test_num = functions_ptr( 5, 5, false );
  }

  // This is a array of function-poiters:
  float (*functions_ptr_arr[])( float x, float y, bool print ) = { Add, Subtract, Multiply, Divide };

  // This randomly shuffles the elements in the array:
  std::shuffle( functions_ptr_arr, functions_ptr_arr + 4, std::mt19937{ std::random_device{}() });

  // Passing the array to the functions:
  Face_1( functions_ptr_arr, starting_number, action_number );// The array's size is 4, and is hard-coded.
  Face_2( functions_ptr_arr, starting_number, action_number );
  Face_3( functions_ptr_arr, starting_number, action_number );
  return 0;
}
