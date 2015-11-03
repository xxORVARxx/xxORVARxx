
/* To Compile:
 *   g++ -g -o Tester *.cpp -lSDL2 -lSDL2_image
 *
 */
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <iostream>
#include <vector>



class Tester
{
public:
  Tester() { 
    m_display_ptr = NULL;  
    m_renderer_ptr = NULL; 
    m_surface_ptr = NULL;
    m_texture_ptr = NULL;
  }
  ~Tester() {
    SDL_FreeSurface( m_surface_ptr );
    SDL_DestroyTexture( m_texture_ptr );
    SDL_DestroyRenderer( m_renderer_ptr );
    SDL_DestroyWindow( m_display_ptr );
    SDL_Quit();
  }

  void Init()
  {
    std::cout << "Testing: 'SDL_Init()'\n";
    if( SDL_Init( SDL_INIT_EVERYTHING ) == -1 )
      std::cout << " !!  ERROR !! Failed to initialize SDL : " << SDL_GetError() << " !!\n";  
  }
  void Window( const char s_title[], int s_w, int s_h )
  {
    std::cout << "Testing: 'SDL_CreateWindow()'\n";
    m_display_ptr = SDL_CreateWindow( s_title, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
				      s_w, s_h, 0 );
    if ( m_display_ptr == NULL )
      std::cout << " !!  ERROR !! Failed to create window : " << SDL_GetError() << " !!\n";  
  }
  void Renderer()
  {
    std::cout << "Testing: 'SDL_CreateRenderer()'\n";
    m_renderer_ptr = SDL_CreateRenderer( m_display_ptr, -1, SDL_RENDERER_ACCELERATED );
    if ( m_renderer_ptr == NULL )
      std::cout << " !!  ERROR !! Failed to create renderer : " << SDL_GetError() << " !!\n";  
  }
  void Load_surface( const char s_name[] ) 
  {
    std::cout << "Testing: 'IMG_Load()'\n";
    m_surface_ptr = IMG_Load( s_name );
    if ( m_surface_ptr == NULL )
      std::cout << " !!  ERROR !! Failed to load image : " << SDL_GetError() << " !!\n";  
  }
  void Load_texture() 
  {
    std::cout << "Testing: 'SDL_CreateTextureFromSurface()'\n";
    m_texture_ptr = SDL_CreateTextureFromSurface( m_renderer_ptr, m_surface_ptr );
    if ( m_texture_ptr == NULL ) {
      SDL_FreeSurface( m_surface_ptr );
      std::cout << " !!  ERROR !! Failed to create textur : " << SDL_GetError() << " !!\n";  
    }
  }
  void Update()
  {
    std::cout << "Testing: 'SDL_Event' and 'SDL_PollEvent()'\n";
    SDL_Event event;
    if( SDL_PollEvent( &event )) {
      std::cout << "Some Event...\n";
    }
  }
private:
  SDL_Window* m_display_ptr;
  SDL_Renderer* m_renderer_ptr;
  SDL_Surface* m_surface_ptr;
  SDL_Texture* m_texture_ptr;
};



int main( int argc, char* argv[] )
{
  if( argc == 1 ) {
    std::cout <<" !!  ERROR !! Expecting a command-argument from '0' to '6'.\n";
    return -1;
  }

  std::cerr <<"Hello!\n";
  Tester test;

  if( *argv[1] > '0' )
    test.Init();

  if( *argv[1] > '1' )
    test.Window( "Test memory leak with Valgrind.", 300, 200 );

  if( *argv[1] > '2' )
    test.Renderer();

  if( *argv[1] > '3' )
    test.Load_surface( "Image.png" );

  if( *argv[1] > '4' )
    test.Load_texture();

  if( *argv[1] > '5' ) {
    std::cout <<"Wait for input...\n";
    SDL_Delay( 1000 );
    test.Update();
  }

  std::cerr <<"Bye!\n";
  return 0;
}
