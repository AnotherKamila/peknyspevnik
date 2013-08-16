$ = require '../lib/zepto.js'

exports.render = (parent, template, context) ->
    $(parent).html template context

exports.err = (where, message, error_obj) ->
	if error_obj then console.error "#{where}:\t#{message}", error_obj
	else console.error "#{where}:\t#{message}"
