db       = require '../db.coffee'
u2u      = require '../../helpers/u2u.coffee'
{render} = require '../../helpers/snippets.coffee'
router   = require '../../router/router.coffee'

exports.handler = (url) ->
    if db.size() == 0 then render '#content', (require './show-list.hbs'), {db_empty: true}; return
    url = decodeURIComponent url
    c_url = u2u url.replace(/\/+/g, '/').replace /^\/+/, ''  # canonicalize url (+ make it look like our db key :D)
    if c_url != url
        router.redirect c_url
    else
        query = url.replace /\/+$/, ''  # trim '/'
        songs_list = db.get_or_find query
        if songs_list.length == 1
            c_url = songs_list[0].key
            if c_url? and url != c_url
                router.redirect c_url
                return
            song = songs_list[0]
            song.data.formatted_text = song.data.text.replace /<<\w+>>/g, (m) -> "<span class='chord'>#{m.substr 2, m.length-4}</span>"
            template = require './show-single.hbs'
            context = { query, song }
        else
            template = require './show-list.hbs'
            context = { query, songs_list }
        render '#content', template, context

