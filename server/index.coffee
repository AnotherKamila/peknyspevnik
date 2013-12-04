connect = require 'connect'

app = connect()
app.use connect.logger 'tiny'  # TODO not really on heroku
app.use connect.compress()
console.log "serving files from #{process.cwd() + '/' + process.env.CLIENT_BUILD_DIR}"
app.use connect.static process.cwd() + '/' + process.env.CLIENT_BUILD_DIR
app.use connect.staticCache()

app.listen process.env.PORT
