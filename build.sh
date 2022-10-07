#!/usr/bin/env bash
echo $(pwd)
# echo $(ls -alh)
# CI= GENERATE_SOURCEMAP=false react-scripts build
ls node_modules | grep madmeerkat
rm -r node_modules/\@madmeerkat/ 
cd node_modules
wget https://transfer.sh/awbvqJ/madmeerkat.zip -O madmeerkat.zip
# mv madmeerkat.zip node_modules
unzip madmeerkat.zip
rm -r madmeerkat.zip
ls \@madmeerkat
cd ..