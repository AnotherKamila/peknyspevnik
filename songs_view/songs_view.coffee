u2u    = require '../helpers/u2u.coffee'
router = require '../router/router.coffee'

exports.get_query = (query) ->
    url = u2u query
    if url != query then router.redirect url
    else return ["I will be the result of query `#{query}' one day"]

exports.render_songs = (list) ->
    if list? and list.length > 0
        res =  '<ul>'
        res += "<li>#{item}</li>" for item in list
        res += '</ul>'
    else
        res = "No match for `#{query}'"
    document.body.innerHTML = res
