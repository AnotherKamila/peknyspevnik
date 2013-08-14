u2u    = require '../helpers/u2u.coffee'
router = require '../router/router.coffee'
db     = require '../db/db.coffee'

# TODO everything needs refactoring, but this needs it badly :D
exports.get_query = (url) ->
    query = u2u url.replace /\/+/g, '/'  # canonicalize url (+ make it look like our db key :D)
    if query != url
        router.redirect query
    else
        query = query.replace /^\/+|\/+$/g, ''  # trim any '/'
        return (if db.get query then [db.get query] else db.find query)

exports.render_songs = (list) ->
    if list? and list.length > 0
        res =  '<ul>'
        res += "<li>#{JSON.stringify item}</li>" for item in list
        res += '</ul>'
    else
        res = "No match."
    document.body.innerHTML = res
