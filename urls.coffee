{urlpattern} = require './router/router.coffee'

module.exports = [
    urlpattern '.*',   (require './songs/ui/show.coffee').handler
]
