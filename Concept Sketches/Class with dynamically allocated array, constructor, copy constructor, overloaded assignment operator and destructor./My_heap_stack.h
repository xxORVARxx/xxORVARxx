
#ifndef MY_HEAP_STACK_H
#define MY_HEAP_STACK_H

#include <iostream>



class Stack
{
 private:
  // Default Constructor:
  Stack() {}
  // We don't want people to create a Stack with no size,
  // so our Default Constructor is private.


 public:
  // Constructor:
  Stack( int s_size );

  // Copy Constructor:
  Stack( const Stack& s_source );

  // Assignment Operator:
  Stack& operator= ( const Stack& s_source );

  // Destructor:
  ~Stack();


  int Get();
  void Push( int s_x );
  void Pop();
  bool is_Full() const;
  bool is_Empty() const;


  friend std::ostream& operator<< ( std::ostream& out, const Stack& s_source );


 private:
  int m_top;
  int m_size;
  int* m_array;// To be on the 'heap'.
};



#endif

