
#include "My_heap_stack.h"



// Constructor:
Stack::Stack( int s_size ) : m_top(0), m_size(s_size), m_array(new int[s_size]) 
{ 
  std::cout <<"Constructor Called.\n";
}

// The 'Copy Constructor' is a special constructor that initializes a NEW OBJECT from an existing object.
Stack::Stack( const Stack& s_source ) : m_top(s_source.m_top), m_size(s_source.m_size), m_array(new int[s_source.m_size])
{
  std::cout <<"Copy Constructor Called.\n";
  for( int i = 0 ; i < s_source.m_size ; ++i )
    m_array[i] = s_source.m_array[i];
}

// The 'Assignment Operator' is used to copy the values from one object to another ALREADY EXISTING object.
Stack& Stack::operator= ( const Stack& s_source )
{
  std::cout <<"Assignment Operator Called.\n";
  if( this == &s_source )// Check for self-assignment.
    return *this;

  delete[] m_array;// Deallocate any value that is already being hold.
  m_array = new int[s_source.m_size];

  for( int i = 0 ; i < s_source.m_size ; ++i )
    m_array[i] = s_source.m_array[i];

  m_top = s_source.m_top;
  m_size = s_source.m_size;

  return *this;// Return *this so we can chain the Assignment Operator.
}

// Destructor:
Stack::~Stack()
{
  std::cout <<"Destructor Called.\n";
  delete[] m_array;
}



int Stack::Get()
{
  if( m_top > 0 )
    return m_array[ m_top - 1 ];
  return 0;
}

void Stack::Push( int s_x )
{
  if( ! this->is_Full() ) {
    m_array[m_top] = s_x;
    ++m_top;
  }
}

void Stack::Pop()
{
  if( ! this->is_Empty() )
    --m_top;
}

bool Stack::is_Full() const
{
  return( m_top >= m_size );
}

bool Stack::is_Empty() const
{
  return( m_top == 0 );
}



// This makes it possible to print an object of this class with the 'std::cout'.
std::ostream& operator<< ( std::ostream& out, const Stack& s_source ) 
{
  for( int i = 0 ; i < s_source.m_top ; ++i )
    out << s_source.m_array[i] << "  ";
  return out;
}
