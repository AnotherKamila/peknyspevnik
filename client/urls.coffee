{urlpattern} = require './router'

module.exports = [
    urlpattern '_add', (require './add_song').handler
    urlpattern '.*',   (require './show').handler
]
