#!/bin/bash



## Function To Search An Array:
Contains_element () {
    local _E
    for _E in "${@:2}"; do
	[[ "$_E" == "$1" ]] && return 0
    done
    return 1
}



## Function To Evaluate The Variables In The Init.txt File:
Evaluate_variables () {
    for _I in "${_TEST[@]}"; do
	if ! [[ "$_I" =~ ^[0-9]+$ ]]; then
	    echo "Error In Init.txt: '_TEST' Has To Be a List Of Integers!"
	    exit 1
	fi  
    done

    if ! [[ "$_SAMPLES" =~ ^[0-9]+$ ]]; then
	echo "Error In Init.txt: '_SAMPLES' Has To Be an Integers!"
	exit 1
    fi

    if ! [[ "$_SIZE" =~ ^[0-9]+$ ]]; then
	echo "Error In Init.txt: '_SIZE' Has To Be an Integers!"
	exit 1
    fi 

    for _I in "${_OPTIMIZE[@]}"; do
	_AVAILABILITIES=('-O0' '-Os' '-O1' '-O2' '-O3' '-Ofast')
	Contains_element "$_I" "${_AVAILABILITIES[@]}"
	if ! [ $? == 0 ]; then
	    echo "Error In Init.txt: '_OPTIMIZE' Has To Be a List Of only: '-O0', '-Os', '-O1', '-O2', '-O3' or '-Ofast'. And Not '$_I'!"
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
	    g++ -std=c++11 -O3 -o Tools/Find_average Tools/Find_average.cpp
	else
	    echo "Error Missing Tool! The 'Tools/Find_average' Does Not Exist! And Neither Does The 'Tools/Find_average.cpp' File!"
	    exit 1
	fi
    fi

    ## The 'Normalize_average':
    if [ ! -f "./Tools/Normalize_average" ]; then
	if [ -f "./Tools/Find_average.cpp" ]; then
	    echo "Compiling Tool: 'Tools/Normalize_average.cpp'."
	    g++ -std=c++11 -O3 -o Tools/Normalize_average Tools/Normalize_average.cpp
	else
	    echo "Error Missing Tool! The 'Tools/Normalize_average' Does Not Exist! And Neither Does The 'Tools/Normalize_average.cpp' File!"
	    exit 1
	fi
    fi
}



## Function To Put The Data Into Files:
Put_data_into_file () {
    local _RESULTS=( $(<$1) )
    local _RESULT_ITR=0
    
    > $1
    echo -e -n " \t " >> $1
    for _OPT in "${_OPTIMIZE[@]}"; do
	echo -e -n " $_OPT \t " >> $1
    done
    echo "" >> $1
    
    for _T in "${_TEST[@]}"; do
	echo -e -n " Test-"$_T" \t" >> $1
	for _OPT in "${_OPTIMIZE[@]}"; do
	    echo -n -e " ${_RESULTS[$_RESULT_ITR]} \t" >> $1
	    (( ++_RESULT_ITR ))
	done
	echo -e -n "\n" >> $1
    done
}



## Load Variables From The Init.txt File:
. ./Init.txt
## Call Functions, To Make Sure Everything Is Okay:
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



echo -e -n "Going To Compile $(( ${#_OPTIMIZE[@]} * ${#_TEST[@]} )) Binary files...\n  "
FILE_NR=1;
for _OPT in "${_OPTIMIZE[@]}"; do
    for _T in "${_TEST[@]}"; do
	echo -n "$FILE_NR, "
	FILE_NR=$(( ++FILE_NR ))
	## Compile:
	eval "$_FLAGS" "$_OPT" -D_TEST="$_T" -D_SIZE="$_SIZE" -o Test_Bin/test-"$_T""$_OPT" "$_CPPS"
	## Add Beginning To 'Test_data*.txt' File:
	echo -e -n "_TEST-"$_T" Result When Using Optimizations: '"$_OPT"'.\n{ " > Test_data/test-"$_T""$_OPT".txt
    done
done

echo -e -n "\nOkay, Running The Tests Now...\n  0% "
FIVE_PROSENT=$(( $_SAMPLES / 20 ))
PROSENT=$FIVE_PROSENT
for J in `seq 1 $_SAMPLES`; do
    ## Prosent Counter For Terminal:
    if (( J > PROSENT )); then
	PROSENT=$(( $PROSENT + $FIVE_PROSENT ))
	echo -n "$(( $(( $J * 100 )) / $_SAMPLES ))% "
    fi  
    
    for _OPT in "${_OPTIMIZE[@]}"; do
	for _T in "${_TEST[@]}"; do
	    ## Run The Tests:
	    ./Test_Bin/test-"$_T""$_OPT" >> Test_data/test-"$_T""$_OPT".txt
	done 
    done 
done 
echo ""

for _OPT in "${_OPTIMIZE[@]}"; do
    for _T in "${_TEST[@]}"; do
	## Add Ending To 'Test_data*.txt' File:
        echo -e "}\n\n" >> Test_data/test-"$_T""$_OPT".txt
    done
done



echo "Calculate The Average..."
> Tools/Results.txt.temp
for _T in "${_TEST[@]}"; do
    for _OPT in "${_OPTIMIZE[@]}"; do
	## Calculate The Average:
        ./Tools/Find_average "Test_data/test-"$_T""$_OPT".txt" >> Tools/Results.txt.temp
    done
done
## Normalizing The Results Base On The Lowest And The Highest Value:
./Tools/Normalize_average "Tools/Results.txt.temp" "Tools/Results_normalize_low.txt.temp" "Tools/Results_normalize_high.txt.temp"



## Call Functions, To Puting The Results Into Files:
Put_data_into_file "Tools/Results.txt.temp"
Put_data_into_file "Tools/Results_normalize_low.txt.temp"
Put_data_into_file "Tools/Results_normalize_high.txt.temp"



## Adding Hedder, Date And Description:
date > Results.txt
echo "Testing: $_DESCRIPTION" >> Results.txt
## Put The Results In Nice Row And Columns:
echo -e "\nHere Are The Results, Measured In: '"$_UNIT"'." >> Results.txt
sed -e 's/\t/_/g' Tools/Results.txt.temp | column -t -s '_' >> Results.txt
echo -e "\nHere Are The Results Normalize/Scaled So The LOWEST Value becomes 1:" >> Results.txt
sed -e 's/\t/_/g' Tools/Results_normalize_low.txt.temp | column -t -s '_' >> Results.txt
echo -e "\nHere Are The Results Normalize/Scaled So The HIGHEST Value becomes 1:" >> Results.txt
sed -e 's/\t/_/g' Tools/Results_normalize_high.txt.temp | column -t -s '_' >> Results.txt



## Removing Temporary Files:
rm Tools/Results.txt.temp
rm Tools/Results_normalize_low.txt.temp
rm Tools/Results_normalize_high.txt.temp



echo -e "  Done! \nAnd Her Are The Results From 'Results.txt':\n"
cat Results.txt



exit 0
