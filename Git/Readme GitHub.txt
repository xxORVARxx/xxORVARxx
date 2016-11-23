
https://www.youtube.com/watch?v=6cli2BdiPPU

-===- List Of Commands -===-

$sudo apt-get install git
$git config --global user.name "Your user-name"
$git config --global user.email "your_email@youremail.com"
$git init
$git remote add origin https://github.com/user-name/my_project
&git remote -v

$touch my_file.cpp
$git status
&git add my_file.cpp
$git commit -m "Message to Explain this Version/Snapshot"
$git push  /  $git push origin master  /  $git push -u origin master
$git pull origin master
$git log


-===- Setup Git and Github for the First Time -===-
        
- Sign up for an account on GitHub.com, with user-name and email.
- Now install Git on your computer: 
    $sudo apt-get install git
- Now we have to run two setup commands:
    $git config --global user.name "Your user-name"
      It's good to use the same user-name you used on GitHub.com.
    $git config --global user.email "your_email@youremail.com"
      Use the same email you used on GitHub.com!


-===- Create a New Git and Github Project -===-

Creating Your Online GitHub Repository:
- Go to GitHub.com and login.
- Press the "+ New Repository" button.
- Now choose a short memorable name for your new project.
- Dont add any extra files, just click the green “Create Repository” button.

Creating Your Local Git Repository:
- make a good directory in you computer like:
    ~/Github_Projects/my_project
      Use the same name you used on GitHub for: my_project.
- Open the terminal in that directory and do:
    $git init
    
Connect Your Local Repository To Your GitHub Repository:
  - $git remote add origin https://github.com/user-name/my_project
  - To see what you repository connected to:
      &git remote -v


-===- Use Git -===- 

- Now make a new file in your project directory, you can use:
    $touch my_file.cpp

- To see what files Git is tracking:
    $git status

- To make Git start to track a file:
    $git add my_file.cpp

- To take a "snapshot" of the project:
    $git commit -m "Message to Explain this Version/Snapshot"
    
- You also have to use "add" on files you make changes too, 
  so the new version of the file will be in the next commit:
    $git add my_file.cpp

- To commit a snapshot of all changed files that have been added with "add" at some point,
  so we dont have to "add" them all agan:
    &git commit -a -m "Message to Explain this Version/Snapshot"

- To push you snapshot to GitHub:
    $git push
  or:
    $git push origin master
  or:  The -u tells Git to remember the parameters, 
       so that next time we can simply run git push.
    $git push -u origin master

- To pull the project from GitHub:
    $git pull origin master

- To see the history of commits:
    $git log

    
-===- Git .gitignore -===-

Git uses .gitignore files to determine which files and directories to ignore, before a commit.
  To create a .gitignore file:
    $touch .gitignore

There are three ways to tell Git which files or directories to ignore:

- Create a local .gitignore:
    You can place a .gitignore file in any directory in your Git project.
    Local .gitignore files should be committed into your repository, 
    in order to share the ignore rules with others that clone the repository.

- Create a global .gitignore:
    You might create the file at ~/.gitignore_global and add some rules to it.
      $git config --global core.excludesfile ~/.gitignore_global

- Repository excludes:
    In your local Git project/repository, open the file called .git/info/exclude,
      (the  .git/  can be a hidden folder).
    Open the 'exclude' file and add the name of the file you want to ignore.
    No .gitignore file is created so it won't be a part of the 'commit'.
    
 
 
-===- Git Undo -===-   

- To undo all changes in your local repository and get you last commit: 
  (all changes that you made since last commit will be permanently lost)
    $git checkout -- My_File_or_Directory
    $git checkout -- *.cpp *.h

    
    
    
    
    
