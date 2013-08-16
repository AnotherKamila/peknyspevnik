# handles the search bar
$ 	   = require '../../lib/zepto.js'
router = require '../../router/router.coffee'

exports.init = ->

	# main nav

	# - search bar
	s = $('#search')
	s_compute_width = ->
		n = $('#mainnav-inside')
		s.width n.width() - parseInt(n.css 'padding-left') - parseInt(n.css 'padding-right') - $('#menu-button-wrapper').width() - 2
	$(window).on 'resize hashchange', s_compute_width; $(s_compute_width)
	s.on search: -> router.redirect s.val()

	# - add button
	$('#menu-button').on 'click', -> router.redirect '_add'
