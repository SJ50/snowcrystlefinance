#!/usr/bin/env bash
echo $(pwd)
# echo $(ls -alh)
CI= GENERATE_SOURCEMAP=false react-scripts build
rm -r /app/node_modules/\@madmeerkat/ 
wget https://transfer.sh/awbvqJ/madmeerkat.zip 
mv madmeerkat.zip /app/node_modules
unzip /app/node_modules/madmeerkat.zip