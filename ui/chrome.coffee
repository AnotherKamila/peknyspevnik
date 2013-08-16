# handles the search bar
$ 	   = require '../lib/zepto.js'
router = require '../router/router.coffee'
render = require './render.coffee'

window.$ = $

exports.init = ->

	# main nav

	# - search bar
	s = $('#search')
	window._s = s
	s_compute_width = ->
		n = $('#mainnav-inside')
		r = n.width() - parseInt(n.css 'padding-left') - parseInt(n.css 'padding-right') - $('#menu-button-wrapper').width()
		s.width r - 2
	$(window).on resize: s_compute_width
	s_compute_width()
	s.on search: -> router.redirect s.val()
