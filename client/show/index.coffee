songs    = require '../../common/songs'
db       = require '../db'
{u2u}    = require '../../common/helpers'
{render} = require '../helpers'
router   = require '../router'

# TODO parsing songs should probably be somewhere else -- refactor!

exports.handler = (url) ->
    if db.size() == 0 then render '#content', (require './show-list.hbs'), {no_songs: true}; return
    url = decodeURIComponent url
    c_url = u2u url.replace(/\/+/g, '/').replace /^\/+/, ''  # canonicalize url (+ make it look like our db key :D)
    if c_url != url
        router.redirect c_url
    else
        query = url.replace /\/+$/, ''  # trim '/'
        songs_list = db.find query
        console.debug 'query results:', songs_list
        if songs_list.length == 1
            c_url = songs_list[0].key
            if c_url? and url != c_url
                router.redirect c_url
                return
            song = songs_list[0]
            template = require './show-single.hbs'
            context = { query, song }
        else
            template = require './show-list.hbs'
            context = { query, songs_list }
        render '#content', template, context
