
#include <iostream> //  For: std::cin, std::cout, std::numeric_limits.
#include <iomanip> //   For: std::fixed, std::setprecision.
#include <cmath> //     For: std::pow.
#include <vector> //    For: std::vector.
#include <string> //    For: std::string.
#include <sstream> //   For: std::stringstream.
#include <algorithm> // For: std::search_n, std::generate, std::transform, std::for_each, 
//                           std::mt19937, std::random_device, std::bind2nd, std::modulus, std::equal_to.


namespace xx
{
  // Use this function to convert a char-array into a number:
  template< typename T > 
  T Char_to_number( const char* c ) 
  {
    std::stringstream sstr;
    sstr << c;
    T num;
    sstr >> num;
    sstr.clear();
    return num;
  }

  // Use this function to make sure that you ONLY get a number input from the player:
  template< typename T > 
  bool Get_number_from_cin( T& num ) 
  {
    std::cin >> num;
    if( std::cin.fail() )// User didn't input a number:
      {
	std::cin.clear(); // Reset failbit.
	// This tells cin to ignore maximum number of characters, starting after the first '\n' (or EOF):
	std::cin.ignore( std::numeric_limits< std::streamsize >::max(), '\n' );
	return false;
      }   
    return true;
  }

  // Use this function to make the program stop and wait for the player to input any key:
  void Wait_for_players_input( std::string message )
  {
    std::cout << message;
    char c;
    std::cin >> c;  
    std::cout <<"\n";
  }

  // Functor, used to make the player input numbers till the vector is full:
  struct Functor_get_input_from_player 
  {
    Functor_get_input_from_player( unsigned int s_range, unsigned int s_difficulty ) : 
      m_range(s_range), m_difficulty(s_difficulty), m_counter(0) {}
    void operator()( unsigned int& i ) 
    {
      std::cout << "("<< ++m_counter <<"/"<< m_difficulty <<") Input a number form 0 to "<< m_range <<" : ";
      while(( ! xx::Get_number_from_cin< unsigned int >( i ) )||( i > m_range ))
	std::cout << "("<< m_counter <<"/"<< m_difficulty <<") Try again, Input a number form 0 to "<< m_range <<"! : ";
    }
  private:
    unsigned int m_range, m_difficulty, m_counter;
  };

  // Functor, used to compare the elements of one vector to the elements of another vector, despite the elements order:
  struct Functor_check_for_right
  { 
    Functor_check_for_right( std::vector< unsigned int > s_random_num_vec, unsigned int& s_rights ) 
      : m_random_num_vec(s_random_num_vec), m_rights(s_rights) { j = m_random_num_vec.end(); }
    void operator()( const unsigned int& i ) 
    {
      j = std::search_n( m_random_num_vec.begin(), m_random_num_vec.end(), 1, i );
      if( j != m_random_num_vec.end() )
	{
	  m_random_num_vec.erase( j );
	  std::cout <<"Right\t";
	  ++m_rights;
	}
      else
	std::cout <<"X\t";
    }
  private:
    unsigned int& m_rights;
    std::vector< unsigned int > m_random_num_vec;
    std::vector< unsigned int >::iterator j;
  };

  // Functor, used to count and print out the matches:
  struct Print_match_list
  {
    Print_match_list( unsigned int& s_matces ) : m_matces(s_matces) {}
    void operator()( bool i )
    {
      if ( i )
	{
	  std::cout <<"Match\t";
	  ++m_matces;
	}
      else
	std::cout <<"X\t";
    }
  private:
    unsigned int& m_matces;
  };
};//end namespace xx.



void Command_line_arguments( int argc, char* argv[], bool& auto_input_any_key, bool& player_use_random_num, unsigned int& difficulty, unsigned int& range )
{
  // Use the first Command-line argument to automatically input the any-key for player:
  // '0' to wait for the player to input any key, any other NUMBER to do it automatically.
  if( argc > 1 ) 
    {
      unsigned int temp = xx::Char_to_number< unsigned int >( argv[1] );
      if( temp > 0 )  auto_input_any_key = true;
    }
  // To get random numbers for the player, use the second Command-line argument:
  // '0' for false, any other NUMBER for true.
  if( argc > 2 ) 
    {
      unsigned int temp = xx::Char_to_number< unsigned int >( argv[2] );
      if( temp > 0 )  player_use_random_num = true;
    }
  // The third Command-line argument lets you choose how many numbers the game uses:
  // It can be from '1' to '15' numbers:
  if( argc > 3 ) 
    { 
      unsigned int temp = xx::Char_to_number< unsigned int >( argv[3] );
      if( temp > 15 )  difficulty = 15;
      else if( temp > 0 )  difficulty = temp;
    }
  // Use the fourth Command-line argument to set the range or maximum value of the numbers:
  // The range can not be '0':
  if( argc > 4 ) 
    { 
      unsigned int temp = xx::Char_to_number< unsigned int >( argv[4] );
      if( temp > 0 )  range = temp;
    }
}



void Make_the_players_numbers( std::vector< unsigned int >& player_num_vec, unsigned int range, unsigned int difficulty, bool player_use_random_num )
{
  if( player_use_random_num )// Random numbers:
    {
      // Make random numbers for the player:
      std::generate( player_num_vec.begin(), player_num_vec.end(), std::mt19937{ std::random_device{}() } );
      // Set the numbers to be in the right range:
      std::transform( player_num_vec.begin(), player_num_vec.end(), player_num_vec.begin(), std::bind2nd( std::modulus< unsigned int >(), ( range + 1 )));
    }
  else// Input numbers:
    {
      std::cout <<"\nYou have to choose your "<< difficulty <<" lottery numbers. ";
      // Make the player choose his numbers:
      std::for_each( player_num_vec.begin(), player_num_vec.end(), xx::Functor_get_input_from_player( range, difficulty ));
    }
  std::cout <<"\nYour lottery numbers are:\n";
  // Print the player's numbers:
  std::for_each( player_num_vec.begin(), player_num_vec.end(), []( unsigned int i ){ std::cout << i <<"\t"; } );
  std::cout <<"\n";
}

void Make_the_winning_numbers( std::vector< unsigned int >& winning_num_vec, unsigned int range )
{
  // Make the random winning numbers:
  std::generate( winning_num_vec.begin(), winning_num_vec.end(), std::mt19937{ std::random_device{}() } );
  // Set the winning numbers to be in the right range:
  std::transform( winning_num_vec.begin(), winning_num_vec.end(), winning_num_vec.begin(), std::bind2nd( std::modulus< unsigned int >(), ( range + 1 )));
  std::cout <<"The Winning numbers are:\n";
  // Print the winnin numbers:
  std::for_each( winning_num_vec.begin(), winning_num_vec.end(), []( unsigned int i ){ std::cout << i <<"\t"; } );
  std::cout <<"\n\n";
}



unsigned int Check_for_right_numbers( std::vector< unsigned int >& player_num_vec, std::vector< unsigned int >& winning_num_vec, unsigned int difficulty )
{
  unsigned int rights = 0;
  // Use a xx::Functor to compare the elements of 'player_num_vec' to the elements of 'winning_num_vec', despite the elements order:
  std::for_each( player_num_vec.begin(), player_num_vec.end(), xx::Functor_check_for_right( winning_num_vec, rights ) );
  if( rights )  std::cout <<"\nYou have "<< rights <<"/"<< difficulty <<" right numbers!\n\n";
  else  std::cout <<"\nSorry, you do not have any right numbers! you lost...\n\n";
  return rights;
}

unsigned int Check_for_matching_numbers( std::vector< unsigned int >& player_num_vec, std::vector< unsigned int >& winning_num_vec, unsigned int difficulty )
{
  unsigned int matces = 0;
  std::vector< bool > match_vec( difficulty );
  // Compare ever element in 'player_num_vec' to ever element at the same position in 'winning_num_vec':
  // and put the results into 'match_vec' to be printed:
  std::transform( player_num_vec.begin(), player_num_vec.end(), winning_num_vec.begin(), match_vec.begin(), std::equal_to< unsigned int >() );
  std::for_each( match_vec.begin(), match_vec.end(), xx::Print_match_list( matces ) );
  if( matces )  std::cout <<"\nYou have "<< matces <<"/"<< difficulty <<" matching numbers!\n\n";
  else  std::cout <<"\nSorry, you do not have any matching numbers!\n\n";
  return matces;
}

void Check_how_much_was_won( double total_award, unsigned int difficulty, unsigned int rights, unsigned int matces )
{
  unsigned int wrongs = ( difficulty - rights );
  unsigned int mismatches = ( difficulty - matces );
  double award = total_award;
  award = ( total_award / ( 2 * mismatches ));
  if(( matces == 0 )&&( wrongs ))
    award = ( award / ( 2 * wrongs ));
  std::cout <<"You won: "<< (unsigned int)( award + 0.5 ) <<" kr!  Of the total: "<< (unsigned int)( total_award + 0.5 ) <<" kr,  ";
  std::cout <<"which is: "<< std::fixed << std::setprecision(3) << ( award / total_award ) * 100 <<"%.\n";
}



int main ( int argc, char* argv[] )
{ 
  // Be Default, the program will ask the player for inputs to continue:
  bool auto_input_any_key = false;
  // Be Default, the player has to choose his numbers himself:
  bool player_use_random_num = false;
  // Be Default, the lottery game uses 3 numbers:
  unsigned int difficulty = 3;
  // Be Default, the number range is from '0' to '9':
  unsigned int range = 9;
  // To change the default settings you can use the Command-line arguments:
  Command_line_arguments( argc, argv, auto_input_any_key, player_use_random_num, difficulty, range );

  double total_award = std::pow ( difficulty + 1, range + 1 );
  std::cout <<"\nThis is a Lottery Game!\n";
  std::cout <<"Your lottery ticket is with "<< difficulty <<" numbers. The numbers can range from '0' to '"<< range <<"'.\n";
  std::cout <<"That gives you the possibility to win everything up to: "<< (unsigned int)( total_award + 0.5 ) <<" kr! Good lock.\n";

  // Create a vector and the player's lottery numbers:
  std::vector< unsigned int > player_num_vec( difficulty );
  Make_the_players_numbers( player_num_vec, range, difficulty, player_use_random_num );
  // Create a vector and the winning lottery numbers:
  std::vector< unsigned int > winning_num_vec( difficulty );
  Make_the_winning_numbers( winning_num_vec, range );

  if ( ! auto_input_any_key )
    xx::Wait_for_players_input( "Do you wanna see how many right numbers you have? input any key.  " );
  // Check how many right numbers the player has:
  unsigned int rights = Check_for_right_numbers( player_num_vec, winning_num_vec, difficulty );
  if( rights )
    {
      if( player_num_vec == winning_num_vec ) // See if the player won:
	{
	  std::cout <<"\n!!! LOTTO !!!  ALL NUMBERS MATCH!  YOU WON ALL THE: "<< total_award <<" kr,  !!! LOTTO !!!\n\n";
	  return 0;
	}

      if ( ! auto_input_any_key )
	xx::Wait_for_players_input( "Do you wanna see how many matching numbers you have? input any key.  " );
      // Check how many matching numbers the player has:
      unsigned int matces = Check_for_matching_numbers( player_num_vec, winning_num_vec, difficulty );

      if (( ! auto_input_any_key )&&( matces != difficulty ))
	xx::Wait_for_players_input( "Do you wanna see how much you won? input any key.  " );
      // Check how much the player won:
      Check_how_much_was_won( total_award, difficulty, rights, matces );
    }
  return 0;
}
