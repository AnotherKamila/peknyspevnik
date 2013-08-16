urls   = require './urls.coffee'
router = require './router/router.coffee'

(require './ui.coffee').init()

router.route urls
