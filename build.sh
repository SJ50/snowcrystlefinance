#!/usr/bin/env bash
echo $(pwd)
echo $(ls -alh)
rm -r node_modules/@madmeerkat && \
    mv @madmeerkat node_modules