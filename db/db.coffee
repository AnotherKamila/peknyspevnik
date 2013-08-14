# this, like all other code so far, is of course a stub, but the basic
# idea might actually stay around for a while since IndexedDB sucks

localstorage = require '../helpers/localstorage.coffee'

exports.get = (query) -> localstorage.get 'song.'+query

exports.find = (query) ->
	return ["I will be the result of query `#{query}' one day"]
