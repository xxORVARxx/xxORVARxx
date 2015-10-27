#!/bin/bash


## The '-q' will quet the call, so it won't print anything.
## The '$?' is a variable that holds the exit status of the last executed function/program/command,
##   If successfull, the exit status is: '0', else not.


grep -q closed /proc/acpi/button/lid/LID0/state
if [ $? = 0 ]
then
	echo "Lid is closed."
else
	echo "Lid is open."
fi


grep -q 0 /sys/class/power_supply/ACAD/online
if [ $? = 0 ]
then
	echo "Running on battery."
else
	echo "Runing on AC-power."
fi
