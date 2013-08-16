{render} = require '../../helpers/snippets.coffee'
$        = require '../../lib/zepto.js'
u2u      = require '../../helpers/u2u.coffee'
router   = require '../../router/router.coffee'
db       = require '../db.coffee'

exports.parse_song = parse_song = (content) ->
    # remove comments and excess whitespace
    content = content.replace(/#.*\n/gm, '').trim().replace(/[\t ][\t ]*$/gm, '').replace /\r?\n(\r?\n)+/gm, '\n\n'
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

exports.handler = ->
    render '#content', (require './add_song.hbs')

    $('#song-file').on change: (e) ->
        reader = new FileReader()
        reader.onload = (e) ->
            res = parse_song e.target.result
            $('#author').val res.meta.author
            $('#title').val res.meta.title
            $('#text').text res.data.text
            $('legend.divide span').text 'edit'
        reader.readAsText (e.target.files ? e.dataTransfer.files)[0]

    $('#add-song-form').submit (e) ->
            song = meta: { author: $('#author').val(), title: $('#title').val() }, data: { text: $('#text').val() }
            router.redirect db.save song
            e.preventDefault()
