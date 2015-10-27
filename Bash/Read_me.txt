
- Tutorials:
    http://www.tldp.org/LDP/abs/html/

- To make the terminal stop doing what it's doing use:
    ctrl + c

- To see a list of all available commands and aliases:
  - You can use the bash(1) built-in compgen
      compgen -c will list all the commands you could run.
      compgen -a will list all the aliases you could run.
      compgen -b will list all the built-ins you could run.
      compgen -k will list all the keywords you could run.
      compgen -A function will list all the functions you could run.
      compgen -A function -abck will list all the above in one go.
  - Check the man page for other completions you can generate.
  - compgen -ac | grep My_Search_String
  
