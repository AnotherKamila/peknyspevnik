u2u = require '../helpers/u2u.coffee'
$   = require '../lib/zepto.js'
localstorage = require '../helpers/localstorage.coffee'

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

        $.extend m, get m.key for m in matches.sort (a, b) -> b.score - a.score  # sorts by score in descending order

    get_or_find: (query) ->
        return (if db.get query then [db.get query] else db.find query)

    save: (song) ->
        console.debug 'saving song:', song
        key = u2u "#{song.meta.author}/#{song.meta.title}"
        localstorage.set 'song.'+key, song
        return key

    size: -> localstorage.keys('song').length


exports.parse_song = parse_song = (content) ->
    # remove comments (marked by `//`) and excess whitespace
    content = content.replace(/\/\/.*\n/gm, '').trim().replace(/[\t ][\t ]*$/gm, '').replace /\r?\n(\r?\n)+/gm, '\n\n'
    # read metadata section
    meta_match = content.split('\n\n', 1)[0].match /^\w+\s*:\s*.*$/gm
    meta = {}
    if meta_match
        for m in meta_match
            [k, v] = m.split ':'
            meta[u2u k] = v.trim()
        text = content.substr(content.split('\n\n', 1)[0].length).trim()
    else
        text = content

    return { meta, data: {text} }

exports.to_html = (text) ->

class Song
	constructor: (from) ->
		@meta = {}; @data = {}
		if from.txt then {@meta, @data} = parse_song from.txt
		$.extend @meta, from.meta
		$.extend @data, from.data
		@key = from.key

	save: -> db.save this

	to_html: =>
		@data.text.replace /<<[\w#+\/]+>>/g, (m) -> "<span class='chord'>#{m.substr 2, m.length-4}</span>"

exports.Song = Song

exports.find = (query) ->
	new Song i for i in db.get_or_find query

exports.size = db.size
