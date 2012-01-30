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

for file in header.js ajax.js array.js aspect.js browser.js cookie.js css.js\
 date.js dom.js event.js file.js json.js profiler.js string.js\
 ui.js ui.glass.js ui.loader.js ui.message.js ui.size.js url.js utils.js
do
    size=$(du -bh $dir$file | tr "\t" " " | cut -d " " -f 1)

    echo -en "Add:\t"
    echo -en '\E[32m'"\033[1m${file} \t\t\033[0m"   # Green
    echo -e '\E[31m'"\033[1m${size}\033[0m"   # Red

    cat $dir$file >> $library
    echo -e >> $library
done

chmod 664 $library

echo

ls -lhF $library

echo