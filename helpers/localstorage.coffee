exports.get = (key) -> JSON.parse localStorage.getItem key
exports.set = (key, value) -> localStorage.setItem key, JSON.stringify value
exports.unset = (key) -> localStorage.removeItem key
