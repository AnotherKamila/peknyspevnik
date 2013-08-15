# handles the search bar
$ = require '../lib/zepto.js'
{render} = require '../helpers/templating.coffee'
router   = require '../router/router.coffee'

exports.init = ->

	# main nav

	# - search bar
	$('#search').on search: -> router.redirect $('#search').val()
