#!/bin/bash

# compiles & bundles coffeescript/javascript and copies everything else
# add -w to watch for changes

if [[ $1 == -w ]]; then
	WATCH=1
	shift
fi

ENTRY=main.coffee
DIR=.
DEST="${1-.}"

mkdir -p $DEST
[[ $DEST != $DIR ]] && cp -r -- $DIR/* "$DEST"  # TODO this would cause trouble if $DIR contained spaces
browserify --transform coffeeify --debug -o "$DEST/bundle.js" "$DIR/$ENTRY"

[[ -z $WATCH ]] && exit

EVENTS=modify,close_write,moved_to,create
echo "Watching $DIR (destination: $DEST)" >&2
inotifywait -mrq -e $EVENTS --format '%e %w%f' "$DIR" | while read e; do
	f="${e#* }"
	[[ "$f" == *.coffee ]] || continue
	echo "$f changed => recompiling"
	browserify --transform coffeeify --debug -o "$DEST/bundle.js" "$DIR/$ENTRY"
done
