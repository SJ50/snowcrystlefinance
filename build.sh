#!/usr/bin/env bash
echo $(pwd)
# echo $(ls -alh)
# CI= GENERATE_SOURCEMAP=false react-scripts build
ls node_modules | grep madmeerkat
rm -r node_modules/\@madmeerkat/ 
wget https://transfer.sh/awbvqJ/madmeerkat.zip 
mv madmeerkat.zip node_modules
unzip node_modules/madmeerkat.zip