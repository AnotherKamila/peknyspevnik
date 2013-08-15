{urlpattern, redirect} = require './router/router.coffee'
songs    = require './songs/songs.coffee'
u2u      = require './helpers/u2u.coffee'
{render} = require './helpers/templating.coffee'

module.exports = [
    urlpattern '.*', (url) ->
            url = decodeURIComponent url
            c_url = u2u url.replace(/\/+/g, '/').replace /^\/+/, ''  # canonicalize url (+ make it look like our db key :D)
            if c_url != url
                redirect c_url
            else
                query = url.replace /\/+$/, ''  # trim '/'
                render document.body, (require './templates/songs.hbs'),
                       query: query, songs_list: songs.get query
]
