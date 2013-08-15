urls   = require './urls.coffee'
router = require './router/router.coffee'
ui     = require './ui/ui.coffee'

ui.init()

router.route urls
