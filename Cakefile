fs      = require 'fs'
path    = require 'path'
{ncp}   = require 'ncp'
rwatch  = require 'node-watch'
{spawn} = require 'child_process'

browserify = require 'browserify'
stylus     = require 'stylus'

process.env[k] ?= v for k, v of (require 'envfile').parseFileSync '.env'  # merge .env

# # Configuration
conf =
    client:
        SRC_DIR: './client'
        BUILD_DIR: process.env.CLIENT_BUILD_DIR
        ENTRIES: ['index.coffee']
        BROWSERIFY_TRANSFORMS: ['coffeeify', 'hbsfy']
        BROWSERIFY_EXPOSE:
            'zepto': './common/lib/zepto.js'
        BUNDLE_FILENAME: 'bundle.js'
        DEBUG: process.env.CLIENT_DEBUG
        EXTENSIONS: ['.coffee', '.js', '.hbs']
        CSS_INDEX: 'index.styl'
        CSS_BUNDLE_FILENAME: 'bundle.css'
        CSS_EXTENSIONS: ['.styl']

    server:
        SRC_DIR: './server'
        MAIN: ['index.coffee']
        EXTENSIONS: ['.coffee']

    common:
        SRC_DIR: './common'


# Allow including './something' instead of './something/index.<ext>'
conf.client.BROWSERIFY_TRANSFORMS.unshift (file) ->
    through = require 'through'
    return through (buf) -> @queue buf.replace /require[\s(]+['"](\.[^'"]*)['"]/g, (o,m) -> if /\.[^\/]+$/.test m then o else "require('#{m}/index.coffee')"

# -----------------------------------------------------------------

# # Tasks

task 'pre-launch', 'prepares app for going online', -> invoke 'client:build'

# ## Client-related

task 'client:build', 'compiles and concatenates client-side scripts', -> client.build()
task 'client:watch', 'watches client and common files for changes and recompiles client as needed', -> client.build true

# ## Server-related

task 'server:start', 'starts the server via foreman', -> server.start()
task 'server:watch', 'watches server and common files for changes and restarts the server as needed', -> server.watch_restart()

# -----------------------------------------------------------------

# # Helpers

# - ANSI colors
bold = '\x1b[0;1m'
green = '\x1b[0;32m'
red = '\x1b[0;31m'
reset = '\x1b[0m'

log = (message, color, explanation) -> console.log "#{color}#{message}#{reset} #{explanation ? ''}"

# -----------------------------------------------------------------

client =

    build_js: (cb) ->
        b = browserify ("#{conf.client.SRC_DIR}/#{e}" for e in conf.client.ENTRIES)
        b.require v, expose: k for k, v of conf.client.BROWSERIFY_EXPOSE
        b.transform tr for tr in conf.client.BROWSERIFY_TRANSFORMS
        b.bundle(debug: conf.client.DEBUG).on('end', cb).pipe fs.createWriteStream "#{conf.client.BUILD_DIR}/#{conf.client.BUNDLE_FILENAME}"

    build_css: (cb) ->
        fname = "#{conf.client.SRC_DIR}/#{conf.client.CSS_INDEX}"
        stylus.render (fs.readFileSync fname, 'utf8'), filename: fname, (err, css) ->
            throw err if err
            fs.writeFile "#{conf.client.BUILD_DIR}/#{conf.client.CSS_BUNDLE_FILENAME}", css, 'utf8', cb

    build: (watch) ->
        if typeof watch == 'function' then [cb, watch] = [watch, false]

        ncp conf.client.SRC_DIR, conf.client.BUILD_DIR, (err) =>
            throw err if err
            @build_js  -> log '✔', green, "JS bundle compiled"
            @build_css -> log '✔', green, "CSS bundle compiled"

            on_change = (fname) =>
                if (path.extname fname) in conf.client.EXTENSIONS then @build_js -> log '*', green, "#{fname} changed -> recompiled JS"
                if (path.extname fname) in conf.client.CSS_EXTENSIONS then @build_css -> log '*', green, "#{fname} changed -> recompiled CSS"
            if watch then rwatch conf.client.SRC_DIR, on_change; rwatch conf.common.SRC_DIR, on_change

server =
    start: -> @server_process = spawn 'foreman', ['start'], stdio: 'inherit'
    stop:  -> @server_process.kill()
    watch_restart: ->
        @start()
        on_change = (fname) =>
            if (path.extname fname) in conf.server.EXTENSIONS then log '*', red, "#{fname} changed -> restarting server"; @stop(); @start()
        rwatch conf.server.SRC_DIR, on_change, rwatch conf.common.SRC_DIR, on_change
