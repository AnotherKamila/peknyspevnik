render = require './render.coffee'

exports.init = ->
	render document.body, (require './templates/chrome.hbs')

	(require './chrome.coffee').init()
