
#include <iostream>
#include <string>

/*  Define implicit type conversion functions:
 *     To convert an object of your class into other types.
 */

/*  explicit :
 *     If you only want to define a constructor, and no implicit type
 *     conversion, always put "explicit" before constructors that can 
 *     accept a single parameter, to avoid inadvertent type conversion. 
 *     like:  Person p1 = name_str;
 */

/*  General Guideline :
 *     1. Avoid defining seemingly unexpected conversion.
 *     2. Avoid defining two-way implicit conversion.
 */



class Person
{
public:
  explicit Person( std::string _name, unsigned int _age = 0, float _height = 0.0 ) :
    m_name(_name), m_age(_age), m_height(_height) {}

  operator std::string () const { return m_name; }
  operator unsigned int () const { return m_age; }
  operator float () const { return m_height; }

private:
  std::string m_name;
  unsigned int m_age;
  float m_height;
};



int main()
{
  Person p1( "Rob", 26, 1.7f );

  std::string n = p1;
  unsigned int a = p1;
  float h = p1;

  std::cout <<"Name: "<< n <<"   Age: "<< a <<"   Height: "<< h <<"\n";
}
