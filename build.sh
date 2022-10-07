#!/usr/bin/env bash
# echo $(pwd)
# echo $(ls -alh)
CI= GENERATE_SOURCEMAP=false react-scripts build
rm -r node_modules/@madmeerkat && \
    mv @madmeerkat node_modules