/*  Youtube:
 *    CppCon 2014: Scott Meyers "Type Deduction and Why You Care"
 *    https://www.youtube.com/watch?v=wQxj20X-tIU
 *  To Compile:
 *    g++ -std=c++11 -o test Type_Deduction.cpp 
 */

#include <iostream>
#include <string>



template< typename T >
void Foo1( T& _param ) {
  int i = 22;          //  'int'.
  const int ci = i;    //  Copy Of 'int'.
  const int& cir = i;  //  Ref To 'const' View Of 'int'.

  Foo1( i );           //  T = int        +  _param's type = int&  ->  void Foo1( int& _param );
  Foo1( ci );          //  T = const int  +  _param's type = int&  ->  void Foo1( const int& _param );
  Foo1( cir );         //  T = const int  +  _param's type = int&  ->  void Foo1( const int& _param );
  // Note: T Not A Reference.
}



template< typename T >
void Foo2( const T& _param ) {
  int i = 22;          //  As Before In Foo1.
  const int ci = i;    //  As Before In Foo1.
  const int& cir = i;  //  As Before In Foo1.

  Foo2( i );           //  T = int  +  _param's type = const int&  ->  void Foo2( const int& _param );
  Foo2( ci );          //  T = int  +  _param's type = const int&  ->  void Foo2( const int& _param );
  Foo2( cir );         //  T = int  +  _param's type = const int&  ->  void Foo2( const int& _param );
  // Note: T Not A Reference.
}



template< typename T >
void Foo3( T* _param ) {
  int i = 22;           //  'int'.
  const int* pci = &i;  //  Ptr To 'const' View Of 'int'.

  Foo3( &i );           //  T = int        +  _param's type = int*        ->  void Foo3( int* _param );
  Foo3( pci );          //  T = const int  +  _param's type = const int*  ->  void Foo3( const int* _param );
  // Note: T Not A Pointer.
}



void Foo4() {
  int i = 22;            //  As Before In Foo1.
  const int ci = i;      //  As Before In Foo1.
  const int& cir = i;    //  As Before In Foo1.

  auto& a1 = i;          //  auto = int        +  a1's type = int&        ->  int& a1 = i;
  auto& a2 = ci;         //  auto = const int  +  a2's type = const int&  ->  const int& a2 = ci;
  auto& a3 = cir;        //  auto = const int  +  a3's type = const int&  ->  const int& a3 = cir;

  const auto& a4 = i;    //  auto = int  +  a4's type = const int&  ->  const int& a4 = i;
  const auto& a5 = ci;   //  auto = int  +  a5's type = const int&  ->  const int& a5 = ci;
  const auto& a6 = cir;  //  auto = int  +  a6's type = const int&  ->  const int& a6 = cir; 
}



template< typename T >
void Foo5( T&& _param ) {
  int i = 22;            //  As Before In Foo1.
  const int ci = i;      //  As Before In Foo1.
  const int& cir = i;    //  As Before In Foo1.

  Foo5( i );             //  i   is lvalue:  T = int&        +  _param's type = int&        ->  void Foo5( int& _param );
  Foo5( ci );            //  ci  is lvalue:  T = const int&  +  _param's type = const int&  ->  void Foo5( const int& _param );
  Foo5( cir );           //  cir is lvalue:  T = const int&  +  _param's type = const int&  ->  void Foo5( const int& _param );
  Foo5( 22 );            //  22  is rvalue:  T = int         +  _param's type = int&&       ->  void Foo5( int&& _param );
}



template< typename T >
void Foo6( T _param ) {
  int i = 22;          //  As Before In Foo1.
  const int ci = i;    //  As Before In Foo1.
  const int& cir = i;  //  As Before In Foo1.

  Foo6( i );           //  T = int  +  _param's type = int  ->  void Foo6( int _param );
  Foo6( ci );          //  T = int  +  _param's type = int  ->  void Foo6( int _param );
  Foo6( cir );         //  T = int  +  _param's type = int  ->  void Foo6( int _param );
  // Note: Expression's Reference-/Const-qualifiers Always Dropped In Deducing T.
}



void Foo7() {
  int i = 22;          //  As Before In Foo1.
  const int ci = i;    //  As Before In Foo1.
  const int& cir = i;  //  As Before In Foo1.

  auto a1 = i;         //  auto = int  +  a1's type = int  ->  int a1 = i;
  auto a2 = ci;        //  auto = int  +  a2's type = int  ->  int a2 = ci;
  auto a3 = cir;       //  auto = int  +  a3's type = int  ->  int a3 = cir;

  auto a4 = cir;       //                  auto = int        +  a4's type = int         ->  int a4 = i;
  auto& a5 = cir;      //                  auto = const int  +  a5's type = const int&  ->  const int& a5 = ci;
  auto&& a6 = cir;     //  cir is lvalue:  auto = const int  +  a6's type = const int&  ->  const int& a6 = cir;
  // Note: The 'auto' By Itself, Never Becomes A Reference. Note 'a4'.
}



void Foo8( const int*const _param1,     //  Ptr To 'const' View Of 'const' 'int'.  ( const ptr to const int )
	   const int*      _param2,     //  Ptr To 'const' 'int'.                        ( ptr to const int )
	         int*const _param3,     //  Ptr To 'const' View Of 'int'.          ( const ptr to int )
	         int*      _param4 ) {  //  Ptr To 'int'.                                ( ptr to int )
  auto a1 = _param1;  //  auto = int*  +  a1's type = const int*  ->  const int* a1 = param1;
  auto a2 = _param2;  //  auto = int*  +  a2's type = const int*  ->  const int* a2 = param2;
  auto a3 = _param3;  //  auto = int*  +  a3's type = int*        ->  int* a3 = param3;
  auto a4 = _param4;  //  auto = int*  +  a4's type = int*        ->  int* a4 = param4;
  // Note: The 'auto' By Itself, Never Becomes A 'const' View.
}



// You Can Use The Class 'Type_displayer' With The Function 'See_Type' To Generate A Compiler Error
// That Tells You What T Is, And The Parameter's Type. 
template< typename T >
class Type_displayer;

// Call This Function To Test And See What The Compiler Will Generate From Your Templates:
// Just Play Around With The Function's Declaration, Like e.g:  ( T _param )  Or:  ( T& _param )
template< typename T >
void See_Type( const T& _param ) {
  Type_displayer< T > the_T_type;
  Type_displayer< decltype( _param ) > the_param_type;
}



int main( int argc, char** args ) {
  
  // Calling 'See_Type' Shows Me That, 'T' Is a 'int' And '_param' Is a 'const int&'.
  const int& cir = 22;
  See_Type( cir );
  
  return 0;
}
