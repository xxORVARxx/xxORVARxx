
#include <iostream> 
#include <chrono>


// This Animal class only contains 'Pure-Virtual' functions and has no member variables.
// That is called an 'Interface-class', and it's purely a definition, and it has no actual implementations:
class Animal
{
public:
  // It's up to the DERIVED classes to implement this function:
  virtual std::string Get_name() = 0;
  virtual std::string Get_type() = 0;
  virtual std::string Get_sound() = 0;
  virtual void Do_its_thing() = 0;
};
// Any class with one or more 'Pure-Virtual' functions becomes an 'Abstract-Base' class, 
// 'Abstract-Base' classes can not be instantiated! (only ther derived classes).
// The derived classes must define the body for this functions, because if not:
// that derived class will be considered an 'Abstract-Base' class and can't be instantiated as well.



// These classes need to implement all 'Pure-Virtual' functions inherited from the 'Interface-class':
// Notice the different implement of the: 'Do_its_thing()' function between the derived classes:
class Cat: public Animal
{
public:
  Cat( std::string s_name ) : m_name(s_name) {}
  std::string Get_name() { return m_name; }
  std::string Get_type() { return "Cat"; }
  std::string Get_sound() { return "Meow"; }
  void Do_its_thing() 
  { 
    this->Hunt(); 
  }
private:
  void Hunt() { std::cout <<"Hunt birds"; }
  std::string m_name;
};

class Dog: public Animal
{
public:
  Dog( std::string s_name ) : m_name(s_name) {}
  std::string Get_name() { return m_name; }
  std::string Get_type() { return "Dog"; }
  std::string Get_sound() { return "Woof"; }
  void Do_its_thing() 
  {
    std::string games[] = { "Flirt Pole", "Water Hose", "Tug of War", "Ball Game", "Dog Sports" };
    // Get Random number from 0 to 4 using a chrono clock:
    int num = std::chrono::system_clock::now().time_since_epoch().count() % 5;
    std::cout <<"play "<< games[ num ];
  }
private:
  std::string m_name;
};

class Lamb: public Animal
{
public:
  Lamb( std::string s_name, bool s_is_up ) : m_name(s_name), m_is_up(s_is_up) {}
  std::string Get_name() { return m_name; }
  std::string Get_type() { return "Lamb"; }
  std::string Get_sound() { return "Meh"; }
  void Do_its_thing() 
  {  
    if( m_is_up )  this->Jump_down();
    else  this->Jump_up();
  }
private:
  void Jump_up() { std::cout <<"jump up";  m_is_up = true; }
  void Jump_down() { std::cout <<"jump down";  m_is_up = false; }

  std::string m_name;
  bool m_is_up;
};



// This function does not care if it's a pointer to the 'Base-class' or any other 'Derived-class'.
void Print_animal( Animal &Animal )
{
  std::cout << Animal.Get_name() <<" is a ";
  std::cout << Animal.Get_type() <<" and likes to ";
  Animal.Do_its_thing();
  std::cout <<" and say ";
  std::cout << Animal.Get_sound() <<"!\n";
}

int main( int argc, char* args[] )
{
  // Three different classes 'Cat', 'Dog' and 'Lamb',
  // Which do provide a implementations for all of the 'Pure-Virtual' functions (in order to be instantiated).
  Cat Fred( "Fred" ), Tyson( "Tyson" ), Zeke( "Zeke" );
  Dog Garbo( "Garbo" ), Pooky( "Pooky" ), Truffle( "Truffle" );
  Lamb Rica( "Rica", false ), Rya( "Rya", true ), Mya( "Mya", false );

  // Set up an array of pointers to 'Animal', and set those pointers to our 'Cat', 'Dog' and 'Lamb' objects:
  Animal *animals_ptr[] = { &Fred, &Tyson, &Zeke, &Garbo, &Pooky, &Truffle, &Rica, &Rya, &Mya };
  // This is a 'Animal' array, but it CAN hold both: 'Cat', 'Dog' and 'Lamb' pointers!


  for( unsigned int i = 0 ; i < 9 ; ++i ) {
    // Here we are use the same function for 'Cat', 'Dog' and 'Lamb':
    Print_animal( *animals_ptr[i] );
    // This is VERY useful, this means we don't have to declare a new functions for each Derived-class.
  }

  return 0;
}



// This is what will be printed:

/* Fred is a Cat and likes to Hunt birds and say Meow!
 * Tyson is a Cat and likes to Hunt birds and say Meow!
 * Zeke is a Cat and likes to Hunt birds and say Meow!
 * Garbo is a Dog and likes to play Ball Game and say Woof!
 * Pooky is a Dog and likes to play Ball Game and say Woof!
 * Truffle is a Dog and likes to play Flirt Pole and say Woof!
 * Rica is a Lamb and likes to jump up and say Meh!
 * Rya is a Lamb and likes to jump down and say Meh!
 * Mya is a Lamb and likes to jump up and say Meh!
 */



// This is what the inheritance tree looks like:

/*       Animal
 *     /   |   \
 *   Cat  Dog  Lamb
 */
