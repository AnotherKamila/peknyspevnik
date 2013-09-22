{render} = require '../helpers'

exports.init = ->
    render document.body, (require './chrome.hbs')
    (require './search.coffee').init()
