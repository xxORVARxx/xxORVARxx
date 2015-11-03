
/* To compile:
 *   g++ -std=c++11 -o test state_machine.cpp
 *
 */
#include <iostream>
#include <vector>
#include <algorithm>



// Functions used by the 'States' to interact with the 'State Machine':
void Push_A();
void Push_B();
void Change_A_to_B();
void Change_B_to_A();
void Pop();



struct State // Interface class:
{
  virtual ~State() {}
  virtual void Update() = 0;
  virtual void Render() = 0;
  virtual void Clean() = 0;
  virtual std::string Get_state_id() const = 0;
};

struct State_A : public State
{
  State_A() : m_c('?') {}
  virtual ~State_A() {}
  virtual void Update() { 
    std::cout <<"\t A Update:\n\t 'p'=Pop, 'c'=Change, 'a'=Push-A, 'b'=Push-B\n\t 'esc'=To Continue, Pop all states to Quit.\n";
    while( m_c != 27 )
      {
	std::cin >> m_c;
	if( m_c == 'p' ) {
	  std::cout <<"\t\t Pop State!\n";
	  Pop();
	}
	else if( m_c == 'c' ) {
	  std::cout <<"\t\t Change to B!\n";
	  Change_A_to_B();
	}
	else if( m_c == 'a' ) {
	  std::cout <<"\t\t Push A!\n";
	  Push_A();
	}
	else if( m_c == 'b' ) {
	  std::cout <<"\t\t Push B!\n";
	  Push_B();
	}
      }
    m_c = '?';
  }
  virtual void Render() { std::cout <<"\t A Render.\n"; }
  virtual void Clean() { std::cout <<"\t A Clean.\n"; }
  virtual std::string Get_state_id() const { return "A"; }
  char m_c;
};

struct State_B : public State
{
  State_B() : m_c('?') {}
  virtual ~State_B() {}
  virtual void Update() {
    std::cout <<"\t B Update:\n\t 'p'=Pop, 'c'=Change, 'a'=Push-A, 'b'=Push-B\n\t 'esc'=To Continue, Pop all states to Quit.\n";
    while( m_c != 27 )
      {
	std::cin >> m_c;
	if( m_c == 'p' ) {
	  std::cout <<"\t\t Pop State!\n";
	  Pop();
	}
	else if( m_c == 'c' ) {
	  std::cout <<"\t\t Change to A!\n";
	  Change_B_to_A();
	}
	else if( m_c == 'a' ) {
	  std::cout <<"\t\t Push A!\n";
	  Push_A();
	}
	else if( m_c == 'b' ) {
	  std::cout <<"\t\t Push B!\n";
	  Push_B();
	}
      }
    m_c = '?';
  }
  virtual void Render() { std::cout <<"\t B Render.\n"; }
  virtual void Clean() { std::cout <<"\t B Clean.\n"; }
  virtual std::string Get_state_id() const { return "B"; }
  char m_c;
};



class Game_state_machine
{
public:
  Game_state_machine() : m_refresh(false) {};

  void Push_state( State* _state ) {
    m_refresh = true;
    m_state_change_vec.push_back( _state );// Add.
  }
  void Change_state( State* _state ) {
    m_refresh = true;
    if( _state->Get_state_id() != m_states_vec.back()->Get_state_id() ) {
      m_state_change_vec.push_back( NULL );// Remove.
      m_state_change_vec.push_back( _state );// Add.
    }
  }
  void Pop_state() {
    m_refresh = true;
    m_state_change_vec.push_back( NULL );// Remove.
  }

  void Update() {
    if( ! m_states_vec.empty() )
      m_states_vec.back()->Update();
    if( m_refresh )
      this->Refresh();
  }
  void Render() {
    if( ! m_states_vec.empty() )
      m_states_vec.back()->Render();
  }
  void Clean() {
    std::for_each( m_states_vec.begin(), m_states_vec.end(), []( State* i ){ i->Clean(); delete i; } );
    m_states_vec.clear();
    std::for_each( m_state_change_vec.begin(), m_state_change_vec.end(), []( State* i ){ i->Clean(); delete i; } );
    m_state_change_vec.clear();
  }

private:
  void Delete_state() {
    if( ! m_states_vec.empty() ) 
      {
	m_states_vec.back()->Clean();
	delete m_states_vec.back();
	m_states_vec.pop_back();
      }
  }
  void Refresh() {
    for( auto i = m_state_change_vec.begin() ; i != m_state_change_vec.end() ; ++i ) 
      {
	if( *i == NULL )
	  this->Delete_state();
	else 
	  m_states_vec.push_back( *i );
      }
    m_state_change_vec.clear();
    m_refresh = false;
  }

  bool m_refresh;
  std::vector< State* > m_states_vec;
  std::vector< State* > m_state_change_vec;

} the_State_machine; // <- Here.



// Functions used by the 'States' to interact with the 'State Machine':
void Push_A() {
  the_State_machine.Push_state( new State_A );
}
void Push_B() {
  the_State_machine.Push_state( new State_B );
}
void Change_A_to_B() {
  the_State_machine.Change_state( new State_B );
}
void Change_B_to_A() {
  the_State_machine.Change_state( new State_A );
}
void Pop() {
  the_State_machine.Pop_state();
}



int main( int argc, char* argv[] )
{
  std::cout <<"Hello! main() starts.\n";

  the_State_machine.Update(); // <- Does nothing.
  the_State_machine.Render(); // <- Does nothing.

  // Starting State:
  the_State_machine.Push_state( new State_A );


  for( int i = 0 ; i < 10 ; ++i )
    {
      std::cout <<"("<< i + 1 <<"/10):\n";
      the_State_machine.Update();
      the_State_machine.Render();
    }


  // Clean up:
  the_State_machine.Clean();

  std::cout <<"Bye! main() ends.\n";
  return 0;
}
