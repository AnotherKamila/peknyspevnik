# this, like all other code so far, is of course a stub, but the basic
# idea might actually stay around for a while since IndexedDB sucks

localstorage = require '../helpers/localstorage.coffee'

exports.get = (query) -> localstorage.get 'song.'+query

exports.find = (query) ->  # TODO with the current approach I certainly can do better querying capabilities :D
    localstorage.get k for k in localstorage.keys 'song' when (new RegExp query).test k
