#!/bin/bash

clear 

echo -n "     "
echo -e '\E[27;44m'"\033[1mpklib JavaScript library\033[0m"
echo; echo
echo -e "\033[1mGenerate files: \033[0m"
echo

library=pklib.js
dir=src/

if [ -f $library ] 
then
    rm $library
fi

echo -e "\tFile:\t\t\tSize:"

for file in headers.js browser.js utils.js ajax.js cookie.js file.js glass.js json.js loader.js message.js node.js profiler.js validate.js
do
    size=$(du -bh $dir$file | tr "\t" " " | cut -d " " -f 1)

    echo -en "Add:\t"
    echo -en '\E[32m'"\033[1m${file} \t\t\033[0m"   # Green
    echo -e '\E[31m'"\033[1m${size}\033[0m"   # Red

    cat $dir$file >> $library
    echo -e "\t" >> $library
done

chmod 664 $library

echo

ls -lhF $library

echo