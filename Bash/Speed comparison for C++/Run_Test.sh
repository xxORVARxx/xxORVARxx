#!/bin/bash



## Function To Search An Array:
Contains_element () {
    local E
    for E in "${@:2}"; do
	[[ "$E" == "$1" ]] && return 0
    done
    return 1
}



## Function To Evaluate The Variables In The Init.txt File:
Evaluate_variables () {
    for I in "${TEST[@]}"; do
	if ! [[ "$I" =~ ^[0-9]+$ ]]; then
	    echo "Error In Init.txt: 'TEST' Has To Be a List Of Integers!"
	    exit 1
	fi  
    done

    if ! [[ "$SAMPLES" =~ ^[0-9]+$ ]]; then
	echo "Error In Init.txt: 'SAMPLES' Has To Be an Integers!"
	exit 1
    fi

    if ! [[ "$SIZE" =~ ^[0-9]+$ ]]; then
	echo "Error In Init.txt: 'SIZE' Has To Be an Integers!"
	exit 1
    fi 

    for I in "${OPTIMIZE[@]}"; do
	AVAILABILITIES=('-O0' '-Os' '-O1' '-O2' '-O3' '-Ofast')
	Contains_element "$I" "${AVAILABILITIES[@]}"
	if ! [ $? == 0 ]; then
	    echo "Error In Init.txt: 'OPTIMIZE' Has To Be a List Of only: '-O0', '-Os', '-O1', '-O2', '-O3' or '-Ofast'. And Not '$I'!"
	    exit 1
	fi  
    done   
}



## Function To Check If All Tools Needed Are There:
Evaluate_tools () {
    ## The 'Find_average':
    if [ ! -f "./Tools/Find_average" ]; then
	if [ -f "./Tools/Find_average.cpp" ]; then
	    echo "Compiling Tool: 'Tools/Find_average.cpp'."
	    g++ -std=c++11 -o Tools/Find_average Tools/Find_average.cpp
	else
	    echo "Error Missing Tool! The 'Tools/Find_average' Does Not Exist! And Neither Does The 'Tools/Find_average.cpp' File!"
	    exit 1
	fi
    fi
}



## Load Variables From The Init.txt File:
. ./Init.txt
## Call Functions:
Evaluate_variables
Evaluate_tools
## Remove Directories:
rm -r -f Test_Bin
rm -r -f Test_data
## Make Directories:
mkdir -p Test_Bin
mkdir -p Test_data
## Empty Log File:
> Tools/Log.txt



echo -e -n "Going To Compile $(( ${#OPTIMIZE[@]} * ${#TEST[@]} )) Binary files...\n  "
FILE_NR=1;
for OPT in "${OPTIMIZE[@]}"; do
    for T in "${TEST[@]}"; do
	echo -n "$FILE_NR, "
	FILE_NR=$(( ++FILE_NR ))
	## Compile:
	g++ -std=c++11 "$OPT" -DTEST="$T" -DSIZE="$SIZE" -o Test_Bin/test-"$T""$OPT" Small_Test_Suite.cpp
	## Add Beginning To 'Test_data' File:
	echo -e -n "TEST-"$T" Result When Using Optimizations: '"$OPT"'.\n{ " > Test_data/test-"$T""$OPT".txt
    done
done



echo -e -n "\nOkay, Running The Tests Now...\n  0% "
FIVE_PROSENT=$(( $SAMPLES / 20 ))
PROSENT=$FIVE_PROSENT
for J in `seq 1 $SAMPLES`; do
    ## Prosent Counter For Terminal:
    if (( J > PROSENT )); then
	PROSENT=$(( $PROSENT + $FIVE_PROSENT ))
	echo -n "$(( $(( $J * 100 )) / $SAMPLES ))% "
    fi  
    
    for OPT in "${OPTIMIZE[@]}"; do
	for T in "${TEST[@]}"; do
	    ## Run The Tests:
	    ./Test_Bin/test-"$T""$OPT" >> Test_data/test-"$T""$OPT".txt
	done 
    done 
done 
echo ""



for OPT in "${OPTIMIZE[@]}"; do
    for T in "${TEST[@]}"; do
	## Add Ending To 'Test_data' File:
        echo -e "}\n\n" >> Test_data/test-"$T""$OPT".txt
    done
done



## The Results:
echo "Calculate The Average..."
echo -e -n "  \t" >> Results.txt.temp
for OPT in "${OPTIMIZE[@]}"; do
    echo -e -n " '$OPT' \t" >> Results.txt.temp
done
echo "" >> Results.txt.temp

for T in "${TEST[@]}"; do
    echo -e -n " Test-$T \t" >> Results.txt.temp
    for OPT in "${OPTIMIZE[@]}"; do
	echo "  File: Test_data/test-"$T""$OPT".txt"
	## Calculate The Average:
	RESULT=$(./Tools/Find_average "Test_data/test-"$T""$OPT".txt")
	echo -n -e " "$RESULT" \t" >> Results.txt.temp
    done
    echo "" >> Results.txt.temp
done

## Adding Hedder, Date And Description:
date > Results.txt
echo -e "Testing: $DESCRIPTION\n" >> Results.txt
## Put The Results In Nice Row And Columns:
sed -e 's/\t/_/g' Results.txt.temp | column -t -s '_' >> Results.txt
rm Results.txt.temp



echo -e "Done! Her Are The Results From 'Results.txt':\n"
cat Results.txt



exit 0
