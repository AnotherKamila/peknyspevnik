exports.err = (where, message, error_obj) ->
	if error_obj then console.error "#{where}:\t#{message}", error_obj
	else console.error "#{where}:\t#{message}"
