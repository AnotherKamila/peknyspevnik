# helpers and snippets used all around the place

exports.u2u = (str) ->
    # produces a string valid for inclusion in a URL from any string by:
    # - lowercasing it and trimming whitespace
    # - replacing (some) Unicode characters with their ASCII equivalents
    # - replacing whitespace with '_' and other non-URL / ugly characters with '-'

    # TODO things like æ or ß should be encoded with more than 1 letter -- should I support it?
    from = 'àáäâæçčďèéëêěìíïîľĺňñòóöôŕřšßťùúüůûýž'
    to   = 'aaaaeccdeeeeeiiiillnnoooorrsstuuuuuyz'

    str = str.toLowerCase().trim()
    str = str.replace (new RegExp from[i], 'g'), to[i] for _,i in from
    str.replace(/\s+/g, '_')
       .replace /[^a-zA-Z0-9_\/]/g, '-'
