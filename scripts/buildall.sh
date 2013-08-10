#!/bin/bash

if [[ $1 == -w ]]; then
	WATCH=1
	shift
fi

DIR=.
DEST="${1-.}"

EVENTS=modify,close_write,moved_to,create

mkdir -p "$DEST"
cp -r $DIR/* "$DEST"
for f in `find -name '*.coffee'`; do
	/bin/bash $(dirname "$0")/build.sh "$f" "$DEST"
done

[[ -z $WATCH ]] && exit

echo "Watching $DIR (destination: $DEST)" >&2
inotifywait -mrq -e $EVENTS --format '%e %w%f' "$DIR" | while read e; do
	f="${e#* }"
	[[ "$f" == *.coffee ]] || continue
	# echo"$e"
	/bin/bash $(dirname "$0")/build.sh "$f" "$DEST"
	echo "  $f compiled"
done

