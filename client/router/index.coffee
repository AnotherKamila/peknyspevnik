$ = require 'zepto'

patterns = []  # array of regexes that is traversed when searching for a matching route

# handler can be recursive: if object then dispatch, else save the function
exports.urlpattern = (pattern, handler) ->
    { pattern, handler }

options =
    add_change_listener: (fn) -> window.addEventListener 'hashchange', -> fn()
    get_address:         -> window.location.hash.substr 1
    redirect:            (address) -> window.location.hash = address

# urls: array of urlpatterns
exports.route = (_urls, _options={}) ->
    $.extend options, _options

    console.groupCollapsed 'routing ready'
    console.log '- urls:', _urls
    console.log '- options:', options
    console.groupEnd()

    navigate = (address=options.get_address(), urls=_urls) ->
        console.groupCollapsed "navigate to: #{address}"

        handler = null
        for p in urls
            re = new RegExp p.pattern
            if re.test address
                console.log 'matched pattern:', re
                handler = p.handler
                break
        if handler?
            if typeof handler == 'function' then handler address
            else navigate (address.substring (re.exec address)[0].length), handler
        else
            document.body.innerText = 'Not Found'

        console.groupEnd()

    options.add_change_listener navigate
    navigate()  # explicitly check address on initialization

exports.redirect = (address) ->
    console.log "--> redirecting to: #{address}"
    options.redirect address
