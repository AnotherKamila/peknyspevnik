# this, like all other code so far, is of course a stub, but the basic
# idea might actually stay around for a while since IndexedDB sucks

u2u          = require '../helpers/u2u.coffee'
localstorage = require '../helpers/localstorage.coffee'
$            = require '../lib/zepto.js'

SCORE_BEGINSWITH = 5
SCORE_CONTAINS   = 1

exports.get = get = (query) -> localstorage.get 'song.' + u2u query

exports.find = find = (query) ->
    query = u2u query
    # query = '.*' if query in ['', '/']
    console.log query
    words = query.split '_'
    regexes_beginswith = (new RegExp '(^|/|_)'+w for w in words)
    regexes_contains = (new RegExp w for w in words)
    matches = []
    for k in localstorage.keys 'song'
        key = k.substr 'song.'.length
        score = 0
        score += SCORE_BEGINSWITH for r in regexes_beginswith when r.test key
        score += SCORE_CONTAINS for r in regexes_contains when r.test key unless score
        if score then matches.push { key, score }
    console.debug matches

    $.extend m, get m.key for m in matches.sort (a, b) -> b.score - a.score  # sorts by score in descending order

exports.get_or_find = (query) ->
    return (if get query then [get query] else find query)

exports.save = (song) ->
    key = u2u "#{song.meta.author}/#{song.meta.title}"
    localstorage.set 'song.'+key, song
    return key
