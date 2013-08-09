#!/bin/bash

DEST="${2-.}"

mkdir -p "`dirname \"$DEST/$1\"`"

coffee --js         -i "$1" -o "$DEST/${1%.coffee}.js"
coffee --source-map -i "$1" -o "$DEST/${1%.coffee}.js.map"
echo -e "\n\n//@ sourceMappingURL=$(basename ${1%.coffee}.js.map)" >> "$DEST/${1%.coffee}.js"
[[ $DEST != . ]] && cp "$1" "$DEST/$1"  # source to go with the map
