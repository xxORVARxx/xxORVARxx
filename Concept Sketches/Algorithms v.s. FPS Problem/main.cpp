
#include <iostream>
#include <iomanip> 

// --- GLOBAL VARIABLE ---
double FPS;
double word_speed;
int w = 10;


/*  Use this program to test if your algorithm end up with
 *  the same result when the FPS changes but the time period
 *  stays the same, or 1 second.
 */


// --- THE BASE CLASS ---
struct Test_base
{
  virtual void Update() {/*  Update the logic-algorithm.  */}
  virtual void Print() {/*  Print the end result.  */}
};



// --- TEST 1 ---
struct Test_1 : public Test_base
{
  Test_1() 
  {
    position = 0.0d;
  }
  virtual void Update() 
  {
    obj_speed = ( 6.0d * word_speed );
    position += obj_speed;
  }
  virtual void Print() 
  {
    std::cout <<"OBJ-Speed: " << std::setw( w ) << obj_speed
	      <<"Pos: "       << std::setw( w ) << position;
  }
  double obj_speed;
  double position;
};


// --- TEST 2 ---
struct Test_2 : public Test_base
{
  Test_2() 
  {
    obj_speed = ( 6.0d * word_speed * word_speed );
    velocity = 0.0d; 
    position = 0.0d;
  }
  virtual void Update()
  {
    velocity += obj_speed;
    position += velocity;
  }
  virtual void Print() 
  {
    std::cout <<"OBJ-Speed: " << std::setw( w ) << obj_speed
	      <<"Vel: "       << std::setw( w ) << velocity
	      <<"Pos: "       << std::setw( w ) << position;
  }
  double obj_speed;
  double velocity; 
  double position;
};


// --- TEST 3 ---
struct Test_3 : public Test_base
{
  Test_3() 
  {
    velocity = 0.0d; 
    position = 0.0d;
    obj_speed = 6.0d;
    vel_delta = ( obj_speed * word_speed );
  }
  virtual void Update() 
  {
    position += (( velocity + ( vel_delta / 2 )) * word_speed );
    velocity += vel_delta;
  }
  virtual void Print() 
  {
    std::cout <<"OBJ-Speed: " << std::setw( w ) << obj_speed
	      <<"Vel-delta: " << std::setw( w ) << vel_delta
	      <<"Vel: "       << std::setw( w ) << velocity
	      <<"Pos: "       << std::setw( w ) << position;
  }
  double velocity; 
  double position;
  double obj_speed;
  double vel_delta;
};



int main()
{
  Test_base* the_test;
  FPS = 15.0d;
  // Looping and testing with different FPS:
  for( unsigned i = 0 ; i < 5 ; ++i, FPS *= 2.0d )
    {
      // Used for canceling out the difference when the FPS is changing:
      word_speed = ( 60.0d / FPS );// This is similar to 'DeltaTime'.

      // Which 'Test' to run:
      the_test = new Test_3;// <--------------BUT-YOUR-TEST-HERE------

      // This is simulating a game-loop.
      // It stimulates what happens in a 1 second time period.
      for( unsigned j = 0 ; j < FPS ; ++j )
	{
	  // Updating and running the logic-algorithm:
	  the_test->Update();
	}
      std::cout.setf( std::ios::left, std::ios::adjustfield );
      std::cout <<"FPS: "        << std::setw( w ) << FPS
		<<"Word speed: " << std::setw( w ) << word_speed;
      the_test->Print();
      // If all is good, the changing in the FPS should not have 
      // changed the end results of the logic-algorithm.
      std::cout << std::endl;
    }
  delete the_test;
}
