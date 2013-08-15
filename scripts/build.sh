#!/bin/bash

# compiles & bundles coffeescript/javascript and copies everything else
# add -w to watch for changes

# TODO spaces in filenames are not handled correctly!

RECOMPILE_EXTENSIONS="coffee js hbs styl"  # TODO separate css and js
BROWSERIFY_TRANSFORMS="coffeeify hbsfy"

if [[ $1 == -w ]]; then
	WATCH=1
	shift
fi

ENTRY=main.coffee
CSS_ENTRY=css/bundle.styl
DIR=.
DEST="${1-.}"

BUILD="browserify $(for t in $BROWSERIFY_TRANSFORMS; do echo -n "-t $t "; done) --debug -o $DEST/bundle.js $DIR/$ENTRY"
BUILD_CSS="stylus --inline -o $DEST $DIR/$CSS_ENTRY"

mkdir -p $DEST
[[ $DEST != $DIR ]] && cp -r -- $DIR/* "$DEST"
$BUILD
$BUILD_CSS

[[ -z $WATCH ]] && exit

EVENTS=modify,close_write,moved_to,create
echo "watching $DIR (destination: $DEST)" >&2
inotifywait -mrq -e $EVENTS --format '%e %w%f' "$DIR" | while read e; do
	f="${e#* }"
	[[ "$f" =~ \.(${RECOMPILE_EXTENSIONS// /|})$ ]] || continue
	echo "$f changed => recompiling"
	$BUILD
	$BUILD_CSS
done
