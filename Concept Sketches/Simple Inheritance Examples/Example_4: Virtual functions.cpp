
#include <iostream> 



class Animal
{
protected:
  Animal( std::string s_name ) : m_name(s_name) {}
public:
  std::string Get_name() { return m_name; };
  // Virtual Functions will replaced by Derived-class functions,
  // But the Derived-class function must exactly match the signature of the Base-class virtual function.
  virtual std::string Get_type() { return "???"; }
  std::string Get_sound() { return "???"; }
private:
  std::string m_name;
};



class Cat: public Animal
{
public:
  Cat( std::string s_name ) : Animal( s_name ) {}
  // It’s a good idea to use the Virtual keyword for virtualized functions in Derived-classes even though it’s not necessary.
  virtual std::string Get_type() { return "Cat"; }
  std::string Get_sound() { return "Meow"; }
};

class Dog: public Animal
{
public:
  Dog( std::string s_name ) : Animal( s_name ) {}
  virtual std::string Get_type() { return "Dog"; }
  std::string Get_sound() { return "Woof"; }
};

class Lamb: public Animal
{
public:
  Lamb( std::string s_name ) : Animal( s_name ) {}
  virtual std::string Get_type() { return "Lamb"; }
  std::string Get_sound() { return "meh"; }
};



// This function does not care if it's a pointer to the 'Base-class' or any other 'Derived-class'.
void Print_animal( Animal &Animal )
{
  // The 'Get_name()' function is inherited from the base class:
  std::cout << Animal.Get_name() <<" is a ";
  // The 'Get_type()' is a VIRTUAL function, so the Base-class function is replaced by Derived-class function:
  std::cout << Animal.Get_type() <<" and says ";
  // the 'Get_sound()' function is NOT virtual, so the Base-class function will be used:
  std::cout << Animal.Get_sound() <<".\n";
}

int main( int argc, char* args[] )
{
  // Three different classes 'Cat', 'Dog' and 'Lamb' with the same base class:
  Cat Fred( "Fred" ), Tyson( "Tyson" ), Zeke( "Zeke" );
  Dog Garbo( "Garbo" ), Pooky( "Pooky" ), Truffle( "Truffle" );
  Lamb Rica( "Rica" ), Rya( "Rya" ), Mya( "Mya" );


  // Set up an array of pointers to 'Animal', and set those pointers to our 'Cat', 'Dog' and 'Lamb' objects:
  Animal *animals_ptr[] = { &Fred, &Tyson, &Zeke, &Garbo, &Pooky, &Truffle, &Rica, &Rya, &Mya };
  // This is a 'Animal' array, but it CAN hold both: 'Cat', 'Dog' and 'Lamb' pointers!


  for( unsigned int i = 0 ; i < 9 ; ++i ) {
    // Here we are use the same function for 'Cat', 'Dog' and 'Lamb'.
    Print_animal( *animals_ptr[i] );
    // This is VERY useful, this means we don't have to declare a new functions for each Derived-class.
  }

  return 0;
}



// This is what will be printed:

/* Fred is a Cat and says ???.
 * Tyson is a Cat and says ???.
 * Zeke is a Cat and says ???.
 * Garbo is a Dog and says ???.
 * Pooky is a Dog and says ???.
 * Truffle is a Dog and says ???.
 * Rica is a Lamb and says ???.
 * Rya is a Lamb and says ???.
 * Mya is a Lamb and says ???.
 */



// This is what the inheritance tree looks like:

/*       Animal
 *     /   |   \
 *   Cat  Dog  Lamb
 */
