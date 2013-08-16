db     = require '../db/db.coffee'

exports.get = (query) ->
    return (if db.get query then [db.get query] else db.find query)
