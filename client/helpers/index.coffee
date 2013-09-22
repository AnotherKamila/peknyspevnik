# helpers and snippets used on client side

$ = require 'zepto'

exports.render = (parent, template, context) ->
    $(parent).html template context
    $(document).triggerHandler 'spevnik:render', [parent, template, context]

exports.err = (where, message, error_obj) ->
    if error_obj then console.error "#{where}:\t#{message}", error_obj
    else console.error "#{where}:\t#{message}"

exports.localstorage =
    get: (key) -> JSON.parse localStorage.getItem key
    set: (key, value) -> localStorage.setItem key, JSON.stringify value
    unset: (key) -> localStorage.removeItem key
    keys: (key_prefix='') ->
        localStorage.key i for _,i in localStorage when localStorage.key(i).substr(0, key_prefix.length) == key_prefix
