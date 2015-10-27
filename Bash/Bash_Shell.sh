#!/bin/bash

## All bash script need to start with this line: '#!bin/bash' this line makes this file a bash script,
## not the '.sh' file ending, script files don't need any file extensions.

## To make the file executable:
##   'chmod +x file_name'

## Use: 'nano' to edit files.  Use: 'cat' to print file to the terminal.  Use: 'touch' to create new files.
## Use: 'rm' to remove files.  Use: 'rm -r' to remove directorys.

## Print to terminal:
echo "Hello World!"


## Make a variable: (Don't use any whitespace)
MYVER="This is my variable."

## Use the variable: (note the $ simple)
echo $MYVER


## Do math:
expr 30 + 10
expr 30 - 10
expr 30 \* 10
expr 30 / 10

MYNUM1=100
expr $MYNUM1 \* 2
expr 2 / $MYNUM1

let MYNUM2=MYNUM1+1
echo $MYNUM2


## If Statement:
if [ $MYNUM1 -eq 100 ]
then
	echo "MYNUM1 is equal to 100."
else
	echo "MYNUM1 is NOT equal to 100."
fi


## Check for directory:
if [ -d ~/myfolder ]
then
        echo "The folder exist."
fi


## Check for file:
if [ -f ~/myfile ]
then
        echo "The file exist."
fi


### Standard Input, Output, & Error:
## Standard Input == '0>'
## Output == '1>'
## Error == '2>'

## This will create or over write this file with a list of all files in this directory:
ls > filelist.txt

## This will create or add at the end of this file, a list of all files in this directory:
ls >> filelist.txt

## Everything written to this is permanently lost or deleted:
ls -l > /dev/null

echo "Adding this at the end of the filelist.txt." >> filelist.txt

## Ask the user for his name:
echo ""
echo "Enter you name:"
read MyName
echo "You entered: $MyName"

## Removing the file, if it does not exist the error message is just destroyed:
rm filelist.txt 2> /dev/null


## Creating a While Loop
MYi=0

## MYi less or equal to 10:
while [ $MYi -le 10 ]
do
	echo $MYi
	MYi=$(( $MYi + 1 ))
	sleep 0.25
done


## This will return 25 to the shell:
exit 25

