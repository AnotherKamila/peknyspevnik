# handles the search bar
$      = require 'zepto'
router = require '../router'

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

    # hide navbar when displaying lyrics and there is no mouse activity (+ workaround: scrolling doesn't count as mouse activity)
    hide_timer = null; last_mouse_pos = [-1,-1]
    navbar_hiding_on = ->
        hide_navbar = -> $('#mainnav').css opacity: 0
        show_navbar = -> $('#mainnav').css opacity: 1; hide_timer = setTimeout hide_navbar, NAVBAR_HIDE_TIMEOUT
        reset_navbar_hiding = -> clearTimeout hide_timer; show_navbar()
        $(reset_navbar_hiding)
        $('#wrapper').on 'mousemove click', (e) ->
            if last_mouse_pos[0] != e.screenX or last_mouse_pos[1] != e.screenY then reset_navbar_hiding()
            last_mouse_pos = [e.screenX, e.screenY]
    navbar_hiding_off = ->
        $('#wrapper').off 'mousemove click'
        $('#mainnav').css opacity: 1
        clearTimeout hide_timer
    $(document).on 'DOMNodeInserted', '#the-song-text', navbar_hiding_on
    $(document).on 'DOMNodeRemoved', '.#the-song-text', navbar_hiding_off
