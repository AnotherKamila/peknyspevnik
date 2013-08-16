exports.init = ->
	document.body.innerHTML = (require './chrome.hbs')()
	(require './songs/ui/search.coffee').init()
