# handles the search bar
$ 	   = require '../lib/zepto.js'
router = require '../router/router.coffee'
render = require './render.coffee'

exports.init = ->

	# main nav

	# - search bar
	$('#search').on search: -> router.redirect $('#search').val()
