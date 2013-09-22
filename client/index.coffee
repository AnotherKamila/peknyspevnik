router = require './router'
urls   = require './urls.coffee'
baseui = require './baseui'

baseui.init()
router.route urls
