exports.get = (key) -> JSON.parse localStorage.getItem key
exports.set = (key, value) -> localStorage.setItem key, JSON.stringify value
exports.unset = (key) -> localStorage.removeItem key

exports.keys = (key_prefix='') ->
    key_prefix += '.' unless key_prefix == ''
    localStorage.key i for _, i in localStorage when localStorage.key(i).substr(0, key_prefix.length) == key_prefix

window._localstorage = module.exports
