$ = require '../lib/zepto.js'

exports.render = (parent, template, context) ->
    $(parent).html template context
