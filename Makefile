#!/bin/bash

library_name=pklib
library=pklib.js
library_min=pklib.min.js
dir_src=src/
dir_doc=docs/
dir_jsdoc=tools/jsdoc-toolkit/
dir_yuicompressor=tools/yuicompressor/

if [ -f $library ] 
then
    rm $library
fi
if [ -f $library_min ] 
then
    rm $library_min
fi

# start building library

clear 

echo -n "     "
echo -e '\E[27;44m'"\033[1mpklib JavaScript library\033[0m"
echo
echo -en "\033[1m[+] Generate library: \033[0m"

#echo -e "\tFile:\t\t\tSize:"

for file in header.js ajax.js array.js aspect.js browser.js common.js cookie.js\
 css.js date.js dom.js event.js file.js json.js object.js profiler.js string.js\
 ui.js ui.glass.js ui.loader.js ui.message.js ui.size.js url.js utils.js
do
    #size=$(du -bh $dir_src$file | tr "\t" " " | cut -d " " -f 1)
    #echo -en "Add:\t"
    #echo -en '\E[32m'"\033[1m${file} \t\t\033[0m"   # Green
    #echo -e '\E[31m'"\033[1m${size}\033[0m"   # Red

    cat $dir_src$file >> $library
    echo -e >> $library
done

echo -n "Done."; echo

echo -en "\033[1m[+] Minifing: \033[0m"

java -jar ${dir_yuicompressor}/build/yuicompressor-2.4.7.jar\
    ${library} -o ${library_min}
    
echo -n "Done."; echo

echo -en "\033[1m[+] Generate documentation: \033[0m"

if [ -f $dir_doc ]
then
    find ${dir_doc} | xargs rm -rf
    mkdir ${dir_doc}
fi

java -jar ${dir_jsdoc}jsrun.jar ${dir_jsdoc}app/run.js -d=${dir_doc}\
    -a -t=${dir_jsdoc}templates/jsdoc -p ${dir_src} -q

echo -e "Done."; echo

# summary

chmod 664 ${library}
chmod 664 ${library_min}

ls -lhF ${library_name}*

echo
