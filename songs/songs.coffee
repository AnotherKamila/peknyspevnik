db     = require './db.coffee'
u2u    = require '../helpers/u2u.coffee'
render = require '../ui/render.coffee'
router = require '../router/router.coffee'

exports.get = (query) ->
    return (if db.get query then [db.get query] else db.find query)

exports.render_url = (url) ->
    url = decodeURIComponent url
    c_url = u2u url.replace(/\/+/g, '/').replace /^\/+/, ''  # canonicalize url (+ make it look like our db key :D)
    if c_url != url
        router.redirect c_url
    else
        console.debug '=='
        query = url.replace /\/+$/, ''  # trim '/'
        songs_list = exports.get query
        if songs_list.length == 1
            console.debug 'single'
            c_url = songs_list[0].key
            if c_url? and url != c_url
                console.debug c_url, '!=', url
                router.redirect c_url
                return
            template = require '../ui/templates/single_song.hbs'
            context = { query, song: songs_list[0] }
        else
            template = require '../ui/templates/songs_list.hbs'
            context = { query, songs_list }
        render '#content', template, context
