$ = require '../lib/zepto.js'

module.exports = (parent, template, context) ->
    $(parent).html template context
