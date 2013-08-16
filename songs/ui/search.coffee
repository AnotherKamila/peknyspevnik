# handles the search bar
$ 	   = require '../../lib/zepto.js'
router = require '../../router/router.coffee'

window.$ = $

exports.init = ->

	# main nav

	# - search bar
	s = $('#search')
	s_compute_width = ->
		n = $('#mainnav-inside')
		s.width n.width() - parseInt(n.css 'padding-left') - parseInt(n.css 'padding-right') - $('#menu-button-wrapper').width() - 20
	$(window).on resize: s_compute_width
	# window.addEventListener 'hashchange', -> setTimeout s_compute_width, 1
	$(s_compute_width)
	s.on search: -> router.redirect s.val()

	# - add button
	$('#menu-button').on 'click', -> router.redirect '_add'
