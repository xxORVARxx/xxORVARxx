
To Setup Emacs:
Rename the "My .emacs" file to ".emacs" and move it into your home directory.
  (be aware, files that begin with a dot "." are hidden)
Open the ".emacs" file (or "My .emacs" file) and follow the instructions.


- To re-open *scratch* buffer in Emacs:
    M-x switch-to-buffer [ENTER] My_Buffer_Name [ENTER]


Emacs CONTROL keys:
C-<chr>  means hold the CONTROL key while typing the character <chr>
M-<chr>  means hold the META or EDIT or ALT key down while typing <chr>.

C-x      Character eXtend.  Followed by one character.
M-x      Named command eXtend.  Followed by a long name.


C-h t                  To open beginners tutorials.
C-h r                  To open the emacs manual.
C-h c <COMMAND>        Get a very brief description about COMMAND.
C-h k <COMMAND>        Get info about COMMAND.
C-h f <FUNCTION>       Get info about FUNCTION.
C-h v <VARIABLE>       Get info about VARIABLE.
C-h m                  Get info about current mode. (like Fundamental or text) 
C-h a STRING           List all commands containing the STRING. 

C-x C-c  To exit Emacs.
C-g      Stop a command.
C-x k    Kill active buffer.

C-x u    Undo.
C-/      Undo.
C-_      Undo.


C-v      Move forward one screenful.
M-v      Move backward one screenful.
C-l      Moving the text around the cursor. (Has three states)

C-f	 Move forward a character.
C-b	 Move backward a character.
M-f	 Move forward a word.
M-b	 Move backward a word.

C-n	 Move to next line.
C-p	 Move to previous line.

C-a	 Move to beginning of line.
C-e	 Move to end of line.
M-a	 Move back to beginning of sentence.
M-e	 Move forward to end of sentence.

C-d   	     Delete the next character after the cursor.
M-d	     Kill/cut the next word after the cursor.
M-<DEL>      Kill/cut the word immediately before the cursor.

C-k	     Kill/cut from the cursor position to end of line.
M-k	     Kill/cut to the end of the current sentence.

C-<SPC>      Toggles start/end text highlight.
C-w          Kill/cut the highlighted text.
C-y          Yank/paste the most recent killed text.
C-y M-y      Yank/paste roll through earlier killed text.


C-x 0        Delete active window.
C-x 1        Delete all but active window.
C-x 2        Split window vertically.
C-x 3        Split window horizontally.

C-x o        Move to other window
C-M-v        Scroll other window.


C-s                    Forward search, type C-s again for next match.
C-r                    Reverse search.

C-u <NUM> <COMMAND>    Makes the COMMAND repeat it self NUM times.

C-x f <NUM>            Set line max-lenght variable to NUM.
M-q                    Re-organization paragraph based-on line max-lenght.
M-x auto-fill-mode     Toggles auto break lines based-on line max-lenght. 

C-x C-f                Find a file.
C-x C-s                Save the file.
C-x s                  Save all/some buffers.

C-x C-b                List buffers.
C-x b "NAME"           Switch to the buffer called NAME.



Emacs Manual:
q            Quit and exit the manual. (or other things)
d            Takes you the the directory node, menu of all manuals.
t            Takes you to the top node.

<SPE>        Travel/scroll the entire tree, page by page and node by node.
]            Travel the entire tree, node to node, without scrolling.
[            Travel the entire tree, backwards, node to node, without scrolling.
n            Move to next node, on the same level/branch.
p            Move to previous node, on the same level/branch.
u            Move up one level/branch.

m            Write a menu name, to select that menu item.
<TAP>        Press tap to move between menu items.
S-<TAP>      Hold shift and press tap to move backwards between menu items.

f            Write a cross-reference/link node name, to enter it.
l            Move back to last node, back to the node which you came from.
L            Constructs a virtual list of the nodes you have visited. (history)
f ?          Get list of all cross-reference/link nodes.

i                      Looks up a string in all indices, and takes you to that node.
,                      Takes you to the next matching node.
I                      same as i but constructs a virtual list of the results.
M-x info-apropos       looks up a string in all Info documents on your system.






