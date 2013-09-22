{localstorage} = require '../helpers'
songs    = require '../../common/songs'
{u2u} = require '../../common/helpers'

# this, like all other code so far, is of course a stub, but the basic
# idea might actually stay around for a while since IndexedDB sucks
db =
    SCORE_BEGINSWITH: 5
    SCORE_CONTAINS:   1

    get: (query) -> localstorage.get 'song.' + u2u query

    find: (query) ->
        query = u2u query
        words = query.split '_'
        regexes_beginswith = (new RegExp '(^|/|_)'+w for w in words)
        regexes_contains = (new RegExp w for w in words)
        matches = []
        for k in localstorage.keys 'song'
            key = k.substr 'song.'.length
            score = 0
            score += db.SCORE_BEGINSWITH for r in regexes_beginswith when r.test key
            score += db.SCORE_CONTAINS for r in regexes_contains when r.test key unless score
            if score then matches.push { key, score }

        $.extend m, db.get m.key for m in matches.sort (a, b) -> b.score - a.score  # sorts by score in descending order

    get_or_find: (query) ->
        return (if db.get query then [db.get query] else db.find query)

    save: (song) ->
        console.debug 'saving song:', song
        key = u2u "#{song.meta.author}/#{song.meta.title}"
        localstorage.set 'song.'+key, song
        return key

    size: -> localstorage.keys('song.').length

exports.find = (query) ->
    new songs.Song i for i in db.get_or_find query

exports.size = db.size
exports.save = db.save
