# handles the search bar
$ 	   = require '../../lib/zepto.js'
router = require '../../router/router.coffee'

NAVBAR_HIDE_TIMEOUT = 4000

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

	# hide navbar when displaying lyrics and there is no mouse activity
	hide_timer = null
	hide_navbar = -> $('#mainnav').css opacity: 0
	show_navbar = -> $('#mainnav').css opacity: 1; hide_timer = setTimeout hide_navbar, NAVBAR_HIDE_TIMEOUT
	reset_navbar_hiding = -> clearTimeout hide_timer; show_navbar()
	$('#wrapper').on 'mousemove click', reset_navbar_hiding
	$(reset_navbar_hiding)
