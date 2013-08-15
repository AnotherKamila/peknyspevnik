{render} = require '../helpers/templating.coffee'

exports.init = ->
	render document.body, (require './templates/chrome.hbs')

	(require './chrome.coffee').init()
