$     = require 'zepto'
{u2u} = require '../helpers'

exports.parse_song = parse_song = (txt) ->
    # remove comments (marked by `//`) and excess whitespace
    txt = txt.replace(/\/\/.*\n/gm, '').trim().replace(/[\t ][\t ]*$/gm, '').replace /\r?\n(\r?\n)+/gm, '\n\n'
    # read metadata section
    meta_match = txt.split('\n\n', 1)[0].match /^\w+\s*:\s*.*$/gm
    meta = {}
    if meta_match
        for m in meta_match
            [k, v] = m.split ':'
            meta[u2u k] = v.trim()
        text = txt.substr(txt.split('\n\n', 1)[0].length).trim()
    else
        text = txt

    return { meta, data: {text} }

exports.text_to_html = text_to_html = (text) ->
    # TODO html here is evil... this should be called something other than to_html and produce something different presumably
    ('<div class="stanza">'+stanza+'</div>' for stanza in text.split '\n\n').join('').replace /<<[\w#+\/]+>>/g, (m) -> "<span class='chord'>#{m.substr 2, m.length-4}</span>"


class Song
    constructor: (from) ->
        @meta = {}; @data = {}
        if from.txt then {@meta, @data} = parse_song from.txt
        $.extend @meta, from.meta
        $.extend @data, from.data

    to_html: => text_to_html @data.text


exports.Song = Song
