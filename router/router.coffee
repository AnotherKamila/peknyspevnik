patterns = []  # array of regexes that is traversed when searching for a matching route

# handler can be recursive: if object then dispatch, else save the function
exports.urlpattern = (pattern, handler) ->
    { pattern, handler }

# urls: array of urlpatterns
exports.route = (_urls, options={}) ->
    console.groupCollapsed 'routing ready'
    console.log '- urls:', _urls
    console.log '- options:', options
    console.groupEnd()

    options.add_change_listener ?= (fn) -> window.addEventListener 'hashchange', -> fn()
    options.get_address ?= -> window.location.hash.substr 1

    navigate = (address=options.get_address(),urls=_urls) ->
        unless options.notrailingslash
            address += '/' unless address[address.length-1] == '/'
        handler = null
        for p in urls
            re = new RegExp p.pattern
            if re.test address then handler = p.handler; break
        document.body.innerText = 'Not Found'; return unless handler?

        if typeof handler == 'function' then handler address
        else navigate (address.substring (re.exec address)[0].length), handler

    options.add_change_listener navigate
    navigate()  # explicitly check address now
