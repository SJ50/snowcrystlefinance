#!/usr/bin/env bash
# echo $(pwd)
# echo $(ls -alh)
CI= GENERATE_SOURCEMAP=false react-scripts build
rm -r /app/node_modules/@madmeerkat && \
    mv @madmeerkat /app/node_modules