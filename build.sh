#!/usr/bin/env bash
ls -alh madmeerkat.zip 
rm -r node_modules/\@madmeerkat/ 
# wget https://transfer.sh/awbvqJ/madmeerkat.zip -O madmeerkat.zip
unzip madmeerkat.zip -d node_modules 
rm -r madmeerkat.zip
