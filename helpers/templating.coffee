# TODO make this stub go away fast

exports.render = (template_name, context) ->
    switch template_name
        when 'songs'
            if context.songs_list? and context.songs_list.length > 0
                res =  '<ul>'
                res += "<li>#{JSON.stringify item}</li>" for item in context.songs_list
                res += '</ul>'
            else
                res = "No match for `#{context.query}'."

        else res = "context: #{JSON.stringify context}"

    document.body.innerHTML = res
