exports.get_query = (query) ->
    return ["I will be the result of query `#{query}' one day"]

exports.render_songs = (list) ->
    res =  '<ul>'
    res += "<li>#{item}</li>" for item in list
    res += '</ul>'
    document.body.innerHTML = res
