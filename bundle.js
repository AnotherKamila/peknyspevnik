;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.get = function(key) {
  return JSON.parse(localStorage.getItem(key));
};

exports.set = function(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
};

exports.unset = function(key) {
  return localStorage.removeItem(key);
};

exports.keys = function(key_prefix) {
  var i, _, _i, _len, _results;
  if (key_prefix == null) {
    key_prefix = '';
  }
  if (key_prefix !== '') {
    key_prefix += '.';
  }
  _results = [];
  for (i = _i = 0, _len = localStorage.length; _i < _len; i = ++_i) {
    _ = localStorage[i];
    if (localStorage.key(i).substr(0, key_prefix.length) === key_prefix) {
      _results.push(localStorage.key(i));
    }
  }
  return _results;
};

window._localstorage = module.exports;


},{}],2:[function(require,module,exports){
var $;

$ = require('../lib/zepto.js');

exports.render = function(parent, template, context) {
  $(parent).html(template(context));
  return $(document).triggerHandler('spevnik:render', [parent, template, context]);
};

exports.err = function(where, message, error_obj) {
  if (error_obj) {
    return console.error("" + where + ":\t" + message, error_obj);
  } else {
    return console.error("" + where + ":\t" + message);
  }
};


},{"../lib/zepto.js":4}],3:[function(require,module,exports){
var from, to;

from = 'àáäâæçčďèéëêěìíïîľĺňñòóöôŕřšßťùúüůûýž';

to = 'aaaaeccdeeeeeiiiillnnoooorrsstuuuuuyz';

module.exports = function(str) {
  var i, _, _i, _len;
  str = str.toLowerCase().trim();
  for (i = _i = 0, _len = from.length; _i < _len; i = ++_i) {
    _ = from[i];
    str = str.replace(new RegExp(from[i], 'g'), to[i]);
  }
  return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\/]/g, '-');
};

exports._from = from;

exports._to = to;

window._u2u = module.exports;


},{}],4:[function(require,module,exports){
/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */


;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    tagSelectorRE = /^[\w-]+$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'

    var nodes, dom, container = containers[name]
    container.innerHTML = '' + html
    dom = $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }
    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes. If a plain object is given, duplicate it.
      else if (isObject(selector))
        dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (isDocument(element) && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2 && typeof property == 'string')
        return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(){
      if (!this.length) return
      return ('scrollTop' in this[0]) ? this[0].scrollTop : this[0].scrollY
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, el = this[0],
        Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return isWindow(el) ? el['inner' + Dimension] :
        isDocument(el) ? el.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// window.Zepto = Zepto
// '$' in window || (window.$ = Zepto)
module.exports = Zepto

;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)))
    os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)

;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={},
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (handler.e == 'focus' || handler.e == 'blur') ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || type
  }

  function add(element, events, fn, selector, getDelegate, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = getDelegate && getDelegate(fn, event)
      var callback  = handler.del || fn
      handler.proxy = function (e) {
        var result = callback.apply(element, [e].concat(e.data))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      })
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (typeof type != 'string') props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    event.isDefaultPrevented = function(){ return this.defaultPrevented }
    return event
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    if (!('type' in options)) return $.ajax(options)

    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      cleanup = function() {
        clearTimeout(abortTimeout)
        $(script).remove()
        delete window[callbackName]
      },
      abort = function(type){
        cleanup()
        // In case of manual abort or timeout, keep an empty function as callback
        // so that the SCRIPT tag that eventually loads won't result in an error.
        if (!type || type == 'timeout') window[callbackName] = empty
        ajaxError(null, type || 'abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return false
    }

    window[callbackName] = function(data){
      cleanup()
      ajaxSuccess(data, xhr, options)
    }

    script.onerror = function() { abort('error') }

    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true,
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming,
    animationName, animationDuration, animationTiming,
    cssReset = {}

  function dasherize(str) { return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2')) }
  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd

    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      }
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

},{}],5:[function(require,module,exports){
var router, urls;

urls = require('./urls.coffee');

router = require('./router/router.coffee');

(require('./ui/ui.coffee')).init();

router.route(urls);


},{"./router/router.coffee":7,"./ui/ui.coffee":16,"./urls.coffee":17}],6:[function(require,module,exports){
/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/browser-prefix.js
var Handlebars = {};
module.exports = Handlebars;

(function(Handlebars, undefined) {
;
// lib/handlebars/base.js

Handlebars.VERSION = "1.0.0";
Handlebars.COMPILER_REVISION = 4;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '== 1.0.0-rc.3',
  3: '== 1.0.0-rc.4',
  4: '>= 1.0.0'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

var toString = Object.prototype.toString,
    functionType = '[object Function]',
    objectType = '[object Object]';

Handlebars.registerHelper = function(name, fn, inverse) {
  if (toString.call(name) === objectType) {
    if (inverse || fn) { throw new Handlebars.Exception('Arg not supported with multiple helpers'); }
    Handlebars.Utils.extend(this.helpers, name);
  } else {
    if (inverse) { fn.not = inverse; }
    this.helpers[name] = fn;
  }
};

Handlebars.registerPartial = function(name, str) {
  if (toString.call(name) === objectType) {
    Handlebars.Utils.extend(this.partials,  name);
  } else {
    this.partials[name] = str;
  }
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Missing helper: '" + arg + "'");
  }
});

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;

  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(conditional, options) {
  var type = toString.call(conditional);
  if(type === functionType) { conditional = conditional.call(this); }

  if(!conditional || Handlebars.Utils.isEmpty(conditional)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(conditional, options) {
  return Handlebars.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn});
});

Handlebars.registerHelper('with', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

var escape = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "`": "&#x60;"
};

var badChars = /[&<>"'`]/g;
var possible = /[&<>"'`]/;

var escapeChar = function(chr) {
  return escape[chr] || "&amp;";
};

Handlebars.Utils = {
  extend: function(obj, value) {
    for(var key in value) {
      if(value.hasOwnProperty(key)) {
        obj[key] = value[key];
      }
    }
  },

  escapeExpression: function(string) {
    // don't escape SafeStrings, since they're already safe
    if (string instanceof Handlebars.SafeString) {
      return string.toString();
    } else if (string == null || string === false) {
      return "";
    }

    // Force a string conversion as this will be done by the append regardless and
    // the regex test will do this transparently behind the scenes, causing issues if
    // an object's to string has escaped characters in it.
    string = string.toString();

    if(!possible.test(string)) { return string; }
    return string.replace(badChars, escapeChar);
  },

  isEmpty: function(value) {
    if (!value && value !== 0) {
      return true;
    } else if(toString.call(value) === "[object Array]" && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
};
;
// lib/handlebars/runtime.js

Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          programWrapper = Handlebars.VM.program(i, fn, data);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
        }
        return programWrapper;
      },
      merge: function(param, common) {
        var ret = param || common;

        if (param && common) {
          ret = {};
          Handlebars.Utils.extend(ret, common);
          Handlebars.Utils.extend(ret, param);
        }
        return ret;
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(i, fn, data /*, $depth */) {
    var args = Array.prototype.slice.call(arguments, 3);

    var program = function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
    program.program = i;
    program.depth = args.length;
    return program;
  },
  program: function(i, fn, data) {
    var program = function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
    program.program = i;
    program.depth = 0;
    return program;
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;
// lib/handlebars/browser-suffix.js
})(Handlebars);
;

},{}],7:[function(require,module,exports){
var $, options, patterns;

$ = require('../lib/zepto.js');

patterns = [];

exports.urlpattern = function(pattern, handler) {
  return {
    pattern: pattern,
    handler: handler
  };
};

options = {
  add_change_listener: function(fn) {
    return window.addEventListener('hashchange', function() {
      return fn();
    });
  },
  get_address: function() {
    return window.location.hash.substr(1);
  },
  redirect: function(address) {
    return window.location.hash = address;
  }
};

exports.route = function(_urls, _options) {
  var navigate;
  if (_options == null) {
    _options = {};
  }
  $.extend(options, _options);
  console.groupCollapsed('routing ready');
  console.log('- urls:', _urls);
  console.log('- options:', options);
  console.groupEnd();
  navigate = function(address, urls) {
    var handler, p, re, _i, _len;
    if (address == null) {
      address = options.get_address();
    }
    if (urls == null) {
      urls = _urls;
    }
    console.groupCollapsed("navigate to: " + address);
    handler = null;
    for (_i = 0, _len = urls.length; _i < _len; _i++) {
      p = urls[_i];
      re = new RegExp(p.pattern);
      if (re.test(address)) {
        console.log('matched pattern:', re);
        handler = p.handler;
        break;
      }
    }
    if (handler != null) {
      if (typeof handler === 'function') {
        handler(address);
      } else {
        navigate(address.substring((re.exec(address))[0].length), handler);
      }
    } else {
      document.body.innerText = 'Not Found';
    }
    return console.groupEnd();
  };
  options.add_change_listener(navigate);
  return navigate();
};

exports.redirect = function(address) {
  console.log("--> redirecting to: " + address);
  return options.redirect(address);
};


},{"../lib/zepto.js":4}],8:[function(require,module,exports){
var $, Song, db, localstorage, parse_song, text_to_html, u2u,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

u2u = require('../helpers/u2u.coffee');

$ = require('../lib/zepto.js');

localstorage = require('../helpers/localstorage.coffee');

db = {
  SCORE_BEGINSWITH: 5,
  SCORE_CONTAINS: 1,
  get: function(query) {
    return localstorage.get('song.' + u2u(query));
  },
  find: function(query) {
    var k, key, m, matches, r, regexes_beginswith, regexes_contains, score, w, words, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _results;
    query = u2u(query);
    words = query.split('_');
    regexes_beginswith = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        w = words[_i];
        _results.push(new RegExp('(^|/|_)' + w));
      }
      return _results;
    })();
    regexes_contains = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        w = words[_i];
        _results.push(new RegExp(w));
      }
      return _results;
    })();
    matches = [];
    _ref = localstorage.keys('song');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      key = k.substr('song.'.length);
      score = 0;
      for (_j = 0, _len1 = regexes_beginswith.length; _j < _len1; _j++) {
        r = regexes_beginswith[_j];
        if (r.test(key)) {
          score += db.SCORE_BEGINSWITH;
        }
      }
      if (!score) {
        for (_k = 0, _len2 = regexes_contains.length; _k < _len2; _k++) {
          r = regexes_contains[_k];
          if (r.test(key)) {
            score += db.SCORE_CONTAINS;
          }
        }
      }
      if (score) {
        matches.push({
          key: key,
          score: score
        });
      }
    }
    _ref1 = matches.sort(function(a, b) {
      return b.score - a.score;
    });
    _results = [];
    for (_l = 0, _len3 = _ref1.length; _l < _len3; _l++) {
      m = _ref1[_l];
      _results.push($.extend(m, db.get(m.key)));
    }
    return _results;
  },
  get_or_find: function(query) {
    return (db.get(query) ? [db.get(query)] : db.find(query));
  },
  save: function(song) {
    var key;
    console.debug('saving song:', song);
    key = u2u("" + song.meta.author + "/" + song.meta.title);
    localstorage.set('song.' + key, song);
    return key;
  },
  size: function() {
    return localstorage.keys('song').length;
  }
};

exports.parse_song = parse_song = function(content) {
  var k, m, meta, meta_match, text, v, _i, _len, _ref;
  content = content.replace(/\/\/.*\n/gm, '').trim().replace(/[\t ][\t ]*$/gm, '').replace(/\r?\n(\r?\n)+/gm, '\n\n');
  meta_match = content.split('\n\n', 1)[0].match(/^\w+\s*:\s*.*$/gm);
  meta = {};
  if (meta_match) {
    for (_i = 0, _len = meta_match.length; _i < _len; _i++) {
      m = meta_match[_i];
      _ref = m.split(':'), k = _ref[0], v = _ref[1];
      meta[u2u(k)] = v.trim();
    }
    text = content.substr(content.split('\n\n', 1)[0].length).trim();
  } else {
    text = content;
  }
  return {
    meta: meta,
    data: {
      text: text
    }
  };
};

exports.text_to_html = text_to_html = function(text) {
  var stanza;
  return ((function() {
    var _i, _len, _ref, _results;
    _ref = text.split('\n\n');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stanza = _ref[_i];
      _results.push('<div class="stanza">' + stanza + '</div>');
    }
    return _results;
  })()).join('').replace(/<<[\w#+\/]+>>/g, function(m) {
    return "<span class='chord'>" + (m.substr(2, m.length - 4)) + "</span>";
  });
};

Song = (function() {
  function Song(from) {
    this.to_html = __bind(this.to_html, this);
    var _ref;
    this.meta = {};
    this.data = {};
    if (from.txt) {
      _ref = parse_song(from.txt), this.meta = _ref.meta, this.data = _ref.data;
    }
    $.extend(this.meta, from.meta);
    $.extend(this.data, from.data);
    this.key = from.key;
  }

  Song.prototype.save = function() {
    return db.save(this);
  };

  Song.prototype.to_html = function() {
    return text_to_html(this.data.text);
  };

  return Song;

})();

exports.Song = Song;

exports.find = function(query) {
  var i, _i, _len, _ref, _results;
  _ref = db.get_or_find(query);
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    i = _ref[_i];
    _results.push(new Song(i));
  }
  return _results;
};

exports.size = db.size;


},{"../helpers/localstorage.coffee":1,"../helpers/u2u.coffee":3,"../lib/zepto.js":4}],9:[function(require,module,exports){
var $, render, router, songs;

render = require('../../helpers/snippets.coffee').render;

$ = require('../../lib/zepto.js');

router = require('../../router/router.coffee');

songs = require('../songs.coffee');

exports.handler = function() {
  render('#content', require('./add_song.hbs'));
  $('#text').on({
    focus: function() {
      return $('#text-container').addClass('focus');
    }
  });
  $('#text').on({
    blur: function() {
      return $('#text-container').removeClass('focus');
    }
  });
  $('#text').on("input", function(e) {
    return $('#preview').html(songs.text_to_html(songs.parse_song($('#text').val()).data.text));
  });
  $('#song-file').on({
    change: function(e) {
      var reader, _ref;
      reader = new FileReader();
      reader.onload = function(e) {
        var res;
        res = songs.parse_song(e.target.result);
        $('#author').val(res.meta.author);
        $('#title').val(res.meta.title);
        $('#text').text(res.data.text);
        $('#text').trigger('input');
        return $('legend.divide span').text('edit');
      };
      return reader.readAsText(((_ref = e.target.files) != null ? _ref : e.dataTransfer.files)[0]);
    }
  });
  return $('#add-song-form').submit(function(e) {
    var s;
    e.preventDefault();
    s = new songs.Song({
      meta: {
        author: $('#author').val(),
        title: $('#title').val()
      },
      txt: $('#text').val()
    });
    return router.redirect(s.save());
  });
};


},{"../../helpers/snippets.coffee":2,"../../lib/zepto.js":4,"../../router/router.coffee":7,"../songs.coffee":8,"./add_song.hbs":10}],10:[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<h1>Add a New Song</h1>\n\n<form id=\"add-song-form\">\n	<fieldset>\n		<label for=\"song-file\">Choose File</label>\n		<input id=\"song-file\" type=\"file\" />\n	</fieldset>\n	<legend class=\"divide\"><span>or</span></legend>\n	<fieldset>\n		<input id=\"author\" type=\"text\" placeholder=\"author\" />\n		<input id=\"title\" type=\"text\" placeholder=\"title\" />\n		<div id=\"text-container\">\n			<textarea id=\"text\" placeholder=\"text (mark chords like this: <<Ami>>; separate stanzas by blank lines; more details comming soon...)\"></textarea>\n			<div id=\"preview\" class=\"song-text\"></div>\n		</div>\n	</fieldset>\n	<input id=\"save-button\" type=\"submit\" value=\"Save\" />\n</form>\n";
  });

},{"handlebars-runtime":6}],11:[function(require,module,exports){
var $, NAVBAR_HIDE_TIMEOUT, router;

$ = require('../../lib/zepto.js');

router = require('../../router/router.coffee');

NAVBAR_HIDE_TIMEOUT = 4000;

window.$ = $;

exports.init = function() {
  var hide_timer, last_mouse_pos, navbar_hiding_off, navbar_hiding_on, s, s_compute_width;
  s = $('#search');
  s_compute_width = function() {
    var n;
    n = $('#mainnav-inside');
    return s.width(n.width() - parseInt(n.css('padding-left')) - parseInt(n.css('padding-right')) - $('#menu-button-wrapper').width() - 20);
  };
  $(window).on({
    resize: s_compute_width
  });
  $(s_compute_width);
  s.on({
    search: function() {
      return router.redirect(s.val());
    }
  });
  $('#menu-button').on('click', function() {
    return router.redirect('_add');
  });
  hide_timer = null;
  last_mouse_pos = [-1, -1];
  navbar_hiding_on = function() {
    var hide_navbar, reset_navbar_hiding, show_navbar;
    hide_navbar = function() {
      return $('#mainnav').css({
        opacity: 0
      });
    };
    show_navbar = function() {
      $('#mainnav').css({
        opacity: 1
      });
      return hide_timer = setTimeout(hide_navbar, NAVBAR_HIDE_TIMEOUT);
    };
    reset_navbar_hiding = function() {
      clearTimeout(hide_timer);
      return show_navbar();
    };
    $(reset_navbar_hiding);
    return $('#wrapper').on('mousemove click', function(e) {
      if (last_mouse_pos[0] !== e.screenX || last_mouse_pos[1] !== e.screenY) {
        reset_navbar_hiding();
      }
      return last_mouse_pos = [e.screenX, e.screenY];
    });
  };
  navbar_hiding_off = function() {
    $('#wrapper').off('mousemove click');
    $('#mainnav').css({
      opacity: 1
    });
    return clearTimeout(hide_timer);
  };
  $(document).on('DOMNodeInserted', '.song-text', navbar_hiding_on);
  return $(document).on('DOMNodeRemoved', '.song-text', navbar_hiding_off);
};


},{"../../lib/zepto.js":4,"../../router/router.coffee":7}],12:[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n	<ul class=\"songs-list\">\n	";
  options = {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data};
  if (stack1 = helpers.songs_list) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.songs_list; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.songs_list) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		<li data-score=\""
    + escapeExpression(((stack1 = depth0.score),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\"><a href=\"#"
    + escapeExpression(((stack1 = depth0.key),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.meta),stack1 == null || stack1 === false ? stack1 : stack1.author)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + ": "
    + escapeExpression(((stack1 = ((stack1 = depth0.meta),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></li>\n	";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	";
  stack1 = helpers['if'].call(depth0, depth0.no_songs, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program5(depth0,data) {
  
  
  return "\n		The song database is empty. <a href=\"#_add\">Add some songs!</a>\n	";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n		No match for `";
  if (stack1 = helpers.query) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.query; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'.\n	";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.songs_list, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });

},{"handlebars-runtime":6}],13:[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h1>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.song),stack1 == null || stack1 === false ? stack1 : stack1.meta)),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h1>\n<h2>by "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = depth0.song),stack1 == null || stack1 === false ? stack1 : stack1.meta)),stack1 == null || stack1 === false ? stack1 : stack1.author)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h2>\n<div class=\"song-text multicolumn\">";
  stack2 = ((stack1 = ((stack1 = depth0.song),stack1 == null || stack1 === false ? stack1 : stack1.to_html)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n";
  return buffer;
  });

},{"handlebars-runtime":6}],14:[function(require,module,exports){
var render, router, songs, u2u;

songs = require('../songs.coffee');

u2u = require('../../helpers/u2u.coffee');

render = require('../../helpers/snippets.coffee').render;

router = require('../../router/router.coffee');

exports.handler = function(url) {
  var c_url, context, query, song, songs_list, template;
  if (songs.size() === 0) {
    render('#content', require('./show-list.hbs'), {
      no_songs: true
    });
    return;
  }
  url = decodeURIComponent(url);
  c_url = u2u(url.replace(/\/+/g, '/').replace(/^\/+/, ''));
  if (c_url !== url) {
    return router.redirect(c_url);
  } else {
    query = url.replace(/\/+$/, '');
    songs_list = songs.find(query);
    console.debug('query results:', songs_list);
    if (songs_list.length === 1) {
      c_url = songs_list[0].key;
      if ((c_url != null) && url !== c_url) {
        router.redirect(c_url);
        return;
      }
      song = songs_list[0];
      template = require('./show-single.hbs');
      context = {
        query: query,
        song: song
      };
    } else {
      template = require('./show-list.hbs');
      context = {
        query: query,
        songs_list: songs_list
      };
    }
    return render('#content', template, context);
  }
};


},{"../../helpers/snippets.coffee":2,"../../helpers/u2u.coffee":3,"../../router/router.coffee":7,"../songs.coffee":8,"./show-list.hbs":12,"./show-single.hbs":13}],15:[function(require,module,exports){
var Handlebars = require('handlebars-runtime');
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div id=\"wrapper\">\n	<nav id=\"mainnav\">\n		<div id=\"mainnav-inside\">\n			<div id=\"menu-button-wrapper\"><button id=\"menu-button\">add</button></div>\n			<div id=\"search-wrapper\"><input id=\"search\" type=\"search\" placeholder=\"search\" incremental /></div>\n		</div>\n	</nav>\n\n	<div id=\"content\"></div>\n</div>\n";
  });

},{"handlebars-runtime":6}],16:[function(require,module,exports){
exports.init = function() {
  document.body.innerHTML = (require('./chrome.hbs'))();
  return (require('../songs/ui/search.coffee')).init();
};


},{"../songs/ui/search.coffee":11,"./chrome.hbs":15}],17:[function(require,module,exports){
var urlpattern;

urlpattern = require('./router/router.coffee').urlpattern;

module.exports = [urlpattern('_add', (require('./songs/ui/add_song.coffee')).handler), urlpattern('.*', (require('./songs/ui/show.coffee')).handler)];


},{"./router/router.coffee":7,"./songs/ui/add_song.coffee":9,"./songs/ui/show.coffee":14}]},{},[5])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvaGVscGVycy9sb2NhbHN0b3JhZ2UuY29mZmVlIiwiL2hvbWUva2FtaWxhL3Byb2plY3RzL3NwZXZuaWsyL2hlbHBlcnMvc25pcHBldHMuY29mZmVlIiwiL2hvbWUva2FtaWxhL3Byb2plY3RzL3NwZXZuaWsyL2hlbHBlcnMvdTJ1LmNvZmZlZSIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi9saWIvemVwdG8uanMiLCIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvbWFpbi5jb2ZmZWUiLCIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvbm9kZV9tb2R1bGVzL2hhbmRsZWJhcnMtcnVudGltZS9oYW5kbGViYXJzLnJ1bnRpbWUuanMiLCIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvcm91dGVyL3JvdXRlci5jb2ZmZWUiLCIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvc29uZ3Mvc29uZ3MuY29mZmVlIiwiL2hvbWUva2FtaWxhL3Byb2plY3RzL3NwZXZuaWsyL3NvbmdzL3VpL2FkZF9zb25nLmNvZmZlZSIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi9zb25ncy91aS9hZGRfc29uZy5oYnMiLCIvaG9tZS9rYW1pbGEvcHJvamVjdHMvc3Bldm5pazIvc29uZ3MvdWkvc2VhcmNoLmNvZmZlZSIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi9zb25ncy91aS9zaG93LWxpc3QuaGJzIiwiL2hvbWUva2FtaWxhL3Byb2plY3RzL3NwZXZuaWsyL3NvbmdzL3VpL3Nob3ctc2luZ2xlLmhicyIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi9zb25ncy91aS9zaG93LmNvZmZlZSIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi91aS9jaHJvbWUuaGJzIiwiL2hvbWUva2FtaWxhL3Byb2plY3RzL3NwZXZuaWsyL3VpL3VpLmNvZmZlZSIsIi9ob21lL2thbWlsYS9wcm9qZWN0cy9zcGV2bmlrMi91cmxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsQ0FBUSxFQUFSLElBQU8sRUFBUTtDQUFhLEVBQU0sQ0FBUCxDQUFKLEVBQVcsRUFBWCxHQUF1QjtDQUFoQzs7QUFDZCxDQURBLENBQ29CLENBQXBCLEVBQWMsRUFBUCxFQUFRO0NBQTRCLENBQWEsQ0FBMUIsQ0FBOEIsQ0FBSixFQUExQixFQUFBLEdBQVk7Q0FBNUI7O0FBQ2QsQ0FGQSxFQUVnQixFQUFoQixFQUFPLEVBQVU7Q0FBcUIsRUFBYixNQUFBLENBQUEsRUFBWTtDQUFyQjs7QUFFaEIsQ0FKQSxFQUllLENBQWYsR0FBTyxFQUFTLENBQUQ7Q0FDWCxLQUFBLGtCQUFBOztHQUR1QixDQUFYO0lBQ1o7Q0FBQSxDQUFBLEVBQXlCLENBQWMsS0FBZDtDQUF6QixFQUFBLENBQUEsTUFBQTtJQUFBO0FBQ0EsQ0FBQTtRQUFBLG1EQUFBO3lCQUFBO0NBQThELENBQWlCLENBQTlCLENBQUEsQ0FBb0QsQ0FBcEQsSUFBd0MsRUFBNUI7Q0FBN0QsRUFBQSxTQUFZO01BQVo7Q0FBQTttQkFGVztDQUFBOztBQUlmLENBUkEsRUFRdUIsR0FBakIsQ0FSTixNQVFBOzs7O0FDUkEsQ0FBQSxHQUFBOztBQUFBLENBQUEsRUFBSSxJQUFBLFVBQUE7O0FBRUosQ0FGQSxDQUUwQixDQUFULEdBQWpCLENBQU8sQ0FBVSxDQUFDO0NBQ2QsQ0FBQSxFQUFBLEVBQUEsQ0FBZSxDQUFBO0NBQ2YsQ0FBNkMsSUFBQSxDQUFBLENBQTdDLENBQUEsS0FBQSxFQUFBO0NBRmE7O0FBSWpCLENBTkEsQ0FNc0IsQ0FBdEIsRUFBYyxFQUFQLEVBQVE7Q0FDZCxDQUFBLEVBQUcsS0FBSDtDQUEwQixDQUFNLENBQUUsRUFBaEIsRUFBTyxFQUFQLEVBQUE7SUFBbEIsRUFBQTtDQUNhLENBQU0sQ0FBRSxFQUFoQixFQUFPLElBQVA7SUFGUTtDQUFBOzs7O0FDQWQsSUFBQSxJQUFBOztBQUFBLENBQUEsRUFBTyxDQUFQLG1DQUFBOztBQUNBLENBREEsQ0FDQSxDQUFPLG9DQURQOztBQUdBLENBSEEsRUFHaUIsR0FBWCxDQUFOLEVBQWtCO0NBQ2QsS0FBQSxRQUFBO0NBQUEsQ0FBQSxDQUFBLENBQU0sT0FBQTtBQUNOLENBQUEsTUFBQSw0Q0FBQTtpQkFBQTtDQUFBLENBQXVDLENBQXZDLENBQUEsRUFBdUIsQ0FBakI7Q0FBTixFQURBO0NBRUksQ0FBZ0IsQ0FBakIsR0FBSCxDQUFBLEVBQUEsU0FBQTtDQUhhOztBQU1qQixDQVRBLEVBU2dCLENBVGhCLENBU0EsRUFBTzs7QUFDUCxDQVZBLENBQUEsQ0FVQSxJQUFPOztBQUVQLENBWkEsRUFZYyxDQUFkLEVBQU0sQ0FaTjs7OztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzloREEsSUFBQSxRQUFBOztBQUFBLENBQUEsRUFBUyxDQUFULEdBQVMsUUFBQTs7QUFDVCxDQURBLEVBQ1MsR0FBVCxDQUFTLGlCQUFBOztBQUVULENBSEEsR0FHQSxHQUFDLFNBQUE7O0FBRUQsQ0FMQSxHQUtBLENBQUEsQ0FBTTs7OztBQ0xOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LEVBQUE7Q0FHSSxDQUE0QixDQUFwQixDQUFSLENBQUEsQ0FBUSxDQUFBO0NBQVIsRUFDYSxDQUFiLENBQWtCLEtBQWxCO0NBREEsQ0FFZ0MsRUFBaEMsQ0FBQSxFQUFPLEdBQVAsTUFBQTtDQUNBLEdBQUEsQ0FBd0IsQ0FBckIsSUFBVTtDQUNULEVBQVEsRUFBUixDQUFBLElBQW1CO0NBQ25CLEVBQWMsQ0FBWCxDQUFrQixDQUFyQixTQUFHO0NBQ0MsSUFBQSxDQUFNLEVBQU47Q0FDQSxhQUFBO1FBSEo7Q0FBQSxFQUlPLENBQVAsRUFBQSxJQUFrQjtDQUpsQixFQUtXLEdBQVgsQ0FBVyxDQUFYLFdBQVc7Q0FMWCxFQU1VLEdBQVYsQ0FBQTtDQUFVLENBQUUsR0FBRixHQUFFO0NBQUYsQ0FBUyxFQUFULElBQVM7Q0FQdkIsT0FDSTtNQURKO0NBU0ksRUFBVyxHQUFYLENBQVcsQ0FBWCxTQUFXO0NBQVgsRUFDVSxHQUFWLENBQUE7Q0FBVSxDQUFFLEdBQUYsR0FBRTtDQUFGLENBQVMsTUFBQSxFQUFUO0NBVmQsT0FTSTtNQVpKO0NBY08sQ0FBWSxJQUFuQixDQUFBLENBQUEsRUFBQSxDQUFBO0lBckJVO0NBQUE7Ozs7QUNQbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEEsQ0FBUSxFQUFPLENBQWYsR0FBTyxFQUFRO0NBQ2QsQ0FBQSxDQUEwQixDQUFiLEdBQWMsQ0FBbkIsQ0FBUixLQUEyQjtDQUMxQixHQUFELEdBQUMsRUFBRCxrQkFBQztDQUZhOzs7O0FDQWYsSUFBQSxNQUFBOztBQUFDLENBQUQsRUFBZSxJQUFBLEdBQWYsY0FBZTs7QUFFZixDQUZBLENBR3VCLENBRE4sQ0FFYixFQUZFLENBQU4sR0FDSSxjQUNvQixJQURBIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cy5nZXQgPSAoa2V5KSAtPiBKU09OLnBhcnNlIGxvY2FsU3RvcmFnZS5nZXRJdGVtIGtleVxuZXhwb3J0cy5zZXQgPSAoa2V5LCB2YWx1ZSkgLT4gbG9jYWxTdG9yYWdlLnNldEl0ZW0ga2V5LCBKU09OLnN0cmluZ2lmeSB2YWx1ZVxuZXhwb3J0cy51bnNldCA9IChrZXkpIC0+IGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtIGtleVxuXG5leHBvcnRzLmtleXMgPSAoa2V5X3ByZWZpeD0nJykgLT5cbiAgICBrZXlfcHJlZml4ICs9ICcuJyB1bmxlc3Mga2V5X3ByZWZpeCA9PSAnJ1xuICAgIGxvY2FsU3RvcmFnZS5rZXkgaSBmb3IgXywgaSBpbiBsb2NhbFN0b3JhZ2Ugd2hlbiBsb2NhbFN0b3JhZ2Uua2V5KGkpLnN1YnN0cigwLCBrZXlfcHJlZml4Lmxlbmd0aCkgPT0ga2V5X3ByZWZpeFxuXG53aW5kb3cuX2xvY2Fsc3RvcmFnZSA9IG1vZHVsZS5leHBvcnRzXG4iLCIkID0gcmVxdWlyZSAnLi4vbGliL3plcHRvLmpzJ1xuXG5leHBvcnRzLnJlbmRlciA9IChwYXJlbnQsIHRlbXBsYXRlLCBjb250ZXh0KSAtPlxuICAgICQocGFyZW50KS5odG1sIHRlbXBsYXRlIGNvbnRleHRcbiAgICAkKGRvY3VtZW50KS50cmlnZ2VySGFuZGxlciAnc3Bldm5pazpyZW5kZXInLCBbcGFyZW50LCB0ZW1wbGF0ZSwgY29udGV4dF1cblxuZXhwb3J0cy5lcnIgPSAod2hlcmUsIG1lc3NhZ2UsIGVycm9yX29iaikgLT5cblx0aWYgZXJyb3Jfb2JqIHRoZW4gY29uc29sZS5lcnJvciBcIiN7d2hlcmV9OlxcdCN7bWVzc2FnZX1cIiwgZXJyb3Jfb2JqXG5cdGVsc2UgY29uc29sZS5lcnJvciBcIiN7d2hlcmV9OlxcdCN7bWVzc2FnZX1cIlxuIiwiIyBwcm9kdWNlcyBhIHN0cmluZyB2YWxpZCBmb3IgaW5jbHVzaW9uIGluIGEgVVJMIGZyb20gYW55IHN0cmluZyBieTpcbiMgLSBsb3dlcmNhc2luZyBpdCBhbmQgdHJpbW1pbmcgd2hpdGVzcGFjZVxuIyAtIHJlcGxhY2luZyAoc29tZSkgVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggdGhlaXIgQVNDSUkgZXF1aXZhbGVudHNcbiMgLSByZXBsYWNpbmcgd2hpdGVzcGFjZSB3aXRoICdfJyBhbmQgb3RoZXIgbm9uLVVSTCAvIHVnbHkgY2hhcmFjdGVycyB3aXRoICctJ1xuXG4jIFRPRE8gdGhpbmdzIGxpa2Ugw6Ygb3Igw58gc2hvdWxkIGJlIGVuY29kZWQgd2l0aCBtb3JlIHRoYW4gMSBsZXR0ZXIgLS0gc2hvdWxkIEkgc3VwcG9ydCBpdD9cbmZyb20gPSAnw6DDocOkw6LDpsOnxI3Ej8Oow6nDq8OqxJvDrMOtw6/DrsS+xLrFiMOxw7LDs8O2w7TFlcWZxaHDn8Wlw7nDusO8xa/Du8O9xb4nXG50byAgID0gJ2FhYWFlY2NkZWVlZWVpaWlpbGxubm9vb29ycnNzdHV1dXV1eXonXG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cikgLT5cbiAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKS50cmltKClcbiAgICBzdHIgPSBzdHIucmVwbGFjZSAobmV3IFJlZ0V4cCBmcm9tW2ldLCAnZycpLCB0b1tpXSBmb3IgXyxpIGluIGZyb21cbiAgICBzdHIucmVwbGFjZSgvXFxzKy9nLCAnXycpXG4gICAgICAgLnJlcGxhY2UgL1teYS16QS1aMC05X1xcL10vZywgJy0nXG5cbmV4cG9ydHMuX2Zyb20gPSBmcm9tXG5leHBvcnRzLl90byAgID0gdG9cblxud2luZG93Ll91MnUgPSBtb2R1bGUuZXhwb3J0c1xuIiwiLyogWmVwdG8gdjEuMC0xLWdhM2NhYjZjIC0gcG9seWZpbGwgemVwdG8gZGV0ZWN0IGV2ZW50IGFqYXggZm9ybSBmeCAtIHplcHRvanMuY29tL2xpY2Vuc2UgKi9cblxuXG47KGZ1bmN0aW9uKHVuZGVmaW5lZCl7XG4gIGlmIChTdHJpbmcucHJvdG90eXBlLnRyaW0gPT09IHVuZGVmaW5lZCkgLy8gZml4IGZvciBpT1MgMy4yXG4gICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIH1cblxuICAvLyBGb3IgaU9TIDMueFxuICAvLyBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZVxuICBpZiAoQXJyYXkucHJvdG90eXBlLnJlZHVjZSA9PT0gdW5kZWZpbmVkKVxuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbihmdW4pe1xuICAgICAgaWYodGhpcyA9PT0gdm9pZCAwIHx8IHRoaXMgPT09IG51bGwpIHRocm93IG5ldyBUeXBlRXJyb3IoKVxuICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyksIGxlbiA9IHQubGVuZ3RoID4+PiAwLCBrID0gMCwgYWNjdW11bGF0b3JcbiAgICAgIGlmKHR5cGVvZiBmdW4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgbmV3IFR5cGVFcnJvcigpXG4gICAgICBpZihsZW4gPT0gMCAmJiBhcmd1bWVudHMubGVuZ3RoID09IDEpIHRocm93IG5ldyBUeXBlRXJyb3IoKVxuXG4gICAgICBpZihhcmd1bWVudHMubGVuZ3RoID49IDIpXG4gICAgICAgYWNjdW11bGF0b3IgPSBhcmd1bWVudHNbMV1cbiAgICAgIGVsc2VcbiAgICAgICAgZG97XG4gICAgICAgICAgaWYoayBpbiB0KXtcbiAgICAgICAgICAgIGFjY3VtdWxhdG9yID0gdFtrKytdXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZigrK2sgPj0gbGVuKSB0aHJvdyBuZXcgVHlwZUVycm9yKClcbiAgICAgICAgfSB3aGlsZSAodHJ1ZSlcblxuICAgICAgd2hpbGUgKGsgPCBsZW4pe1xuICAgICAgICBpZihrIGluIHQpIGFjY3VtdWxhdG9yID0gZnVuLmNhbGwodW5kZWZpbmVkLCBhY2N1bXVsYXRvciwgdFtrXSwgaywgdClcbiAgICAgICAgaysrXG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjdW11bGF0b3JcbiAgICB9XG5cbn0pKClcblxudmFyIFplcHRvID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdW5kZWZpbmVkLCBrZXksICQsIGNsYXNzTGlzdCwgZW1wdHlBcnJheSA9IFtdLCBzbGljZSA9IGVtcHR5QXJyYXkuc2xpY2UsIGZpbHRlciA9IGVtcHR5QXJyYXkuZmlsdGVyLFxuICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgIGVsZW1lbnREaXNwbGF5ID0ge30sIGNsYXNzQ2FjaGUgPSB7fSxcbiAgICBnZXRDb21wdXRlZFN0eWxlID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSxcbiAgICBjc3NOdW1iZXIgPSB7ICdjb2x1bW4tY291bnQnOiAxLCAnY29sdW1ucyc6IDEsICdmb250LXdlaWdodCc6IDEsICdsaW5lLWhlaWdodCc6IDEsJ29wYWNpdHknOiAxLCAnei1pbmRleCc6IDEsICd6b29tJzogMSB9LFxuICAgIGZyYWdtZW50UkUgPSAvXlxccyo8KFxcdyt8ISlbXj5dKj4vLFxuICAgIHRhZ0V4cGFuZGVyUkUgPSAvPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vaWcsXG4gICAgcm9vdE5vZGVSRSA9IC9eKD86Ym9keXxodG1sKSQvaSxcblxuICAgIC8vIHNwZWNpYWwgYXR0cmlidXRlcyB0aGF0IHNob3VsZCBiZSBnZXQvc2V0IHZpYSBtZXRob2QgY2FsbHNcbiAgICBtZXRob2RBdHRyaWJ1dGVzID0gWyd2YWwnLCAnY3NzJywgJ2h0bWwnLCAndGV4dCcsICdkYXRhJywgJ3dpZHRoJywgJ2hlaWdodCcsICdvZmZzZXQnXSxcblxuICAgIGFkamFjZW5jeU9wZXJhdG9ycyA9IFsgJ2FmdGVyJywgJ3ByZXBlbmQnLCAnYmVmb3JlJywgJ2FwcGVuZCcgXSxcbiAgICB0YWJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RhYmxlJyksXG4gICAgdGFibGVSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpLFxuICAgIGNvbnRhaW5lcnMgPSB7XG4gICAgICAndHInOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0Ym9keScpLFxuICAgICAgJ3Rib2R5JzogdGFibGUsICd0aGVhZCc6IHRhYmxlLCAndGZvb3QnOiB0YWJsZSxcbiAgICAgICd0ZCc6IHRhYmxlUm93LCAndGgnOiB0YWJsZVJvdyxcbiAgICAgICcqJzogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB9LFxuICAgIHJlYWR5UkUgPSAvY29tcGxldGV8bG9hZGVkfGludGVyYWN0aXZlLyxcbiAgICBjbGFzc1NlbGVjdG9yUkUgPSAvXlxcLihbXFx3LV0rKSQvLFxuICAgIGlkU2VsZWN0b3JSRSA9IC9eIyhbXFx3LV0qKSQvLFxuICAgIHRhZ1NlbGVjdG9yUkUgPSAvXltcXHctXSskLyxcbiAgICBjbGFzczJ0eXBlID0ge30sXG4gICAgdG9TdHJpbmcgPSBjbGFzczJ0eXBlLnRvU3RyaW5nLFxuICAgIHplcHRvID0ge30sXG4gICAgY2FtZWxpemUsIHVuaXEsXG4gICAgdGVtcFBhcmVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG5cbiAgemVwdG8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNlbGVjdG9yKSB7XG4gICAgaWYgKCFlbGVtZW50IHx8IGVsZW1lbnQubm9kZVR5cGUgIT09IDEpIHJldHVybiBmYWxzZVxuICAgIHZhciBtYXRjaGVzU2VsZWN0b3IgPSBlbGVtZW50LndlYmtpdE1hdGNoZXNTZWxlY3RvciB8fCBlbGVtZW50Lm1vek1hdGNoZXNTZWxlY3RvciB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50Lm9NYXRjaGVzU2VsZWN0b3IgfHwgZWxlbWVudC5tYXRjaGVzU2VsZWN0b3JcbiAgICBpZiAobWF0Y2hlc1NlbGVjdG9yKSByZXR1cm4gbWF0Y2hlc1NlbGVjdG9yLmNhbGwoZWxlbWVudCwgc2VsZWN0b3IpXG4gICAgLy8gZmFsbCBiYWNrIHRvIHBlcmZvcm1pbmcgYSBzZWxlY3RvcjpcbiAgICB2YXIgbWF0Y2gsIHBhcmVudCA9IGVsZW1lbnQucGFyZW50Tm9kZSwgdGVtcCA9ICFwYXJlbnRcbiAgICBpZiAodGVtcCkgKHBhcmVudCA9IHRlbXBQYXJlbnQpLmFwcGVuZENoaWxkKGVsZW1lbnQpXG4gICAgbWF0Y2ggPSB+emVwdG8ucXNhKHBhcmVudCwgc2VsZWN0b3IpLmluZGV4T2YoZWxlbWVudClcbiAgICB0ZW1wICYmIHRlbXBQYXJlbnQucmVtb3ZlQ2hpbGQoZWxlbWVudClcbiAgICByZXR1cm4gbWF0Y2hcbiAgfVxuXG4gIGZ1bmN0aW9uIHR5cGUob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSBudWxsID8gU3RyaW5nKG9iaikgOlxuICAgICAgY2xhc3MydHlwZVt0b1N0cmluZy5jYWxsKG9iaildIHx8IFwib2JqZWN0XCJcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHR5cGUodmFsdWUpID09IFwiZnVuY3Rpb25cIiB9XG4gIGZ1bmN0aW9uIGlzV2luZG93KG9iaikgICAgIHsgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iaiA9PSBvYmoud2luZG93IH1cbiAgZnVuY3Rpb24gaXNEb2N1bWVudChvYmopICAgeyByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqLm5vZGVUeXBlID09IG9iai5ET0NVTUVOVF9OT0RFIH1cbiAgZnVuY3Rpb24gaXNPYmplY3Qob2JqKSAgICAgeyByZXR1cm4gdHlwZShvYmopID09IFwib2JqZWN0XCIgfVxuICBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBpc09iamVjdChvYmopICYmICFpc1dpbmRvdyhvYmopICYmIG9iai5fX3Byb3RvX18gPT0gT2JqZWN0LnByb3RvdHlwZVxuICB9XG4gIGZ1bmN0aW9uIGlzQXJyYXkodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgfVxuICBmdW5jdGlvbiBsaWtlQXJyYXkob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqLmxlbmd0aCA9PSAnbnVtYmVyJyB9XG5cbiAgZnVuY3Rpb24gY29tcGFjdChhcnJheSkgeyByZXR1cm4gZmlsdGVyLmNhbGwoYXJyYXksIGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbSAhPSBudWxsIH0pIH1cbiAgZnVuY3Rpb24gZmxhdHRlbihhcnJheSkgeyByZXR1cm4gYXJyYXkubGVuZ3RoID4gMCA/ICQuZm4uY29uY2F0LmFwcGx5KFtdLCBhcnJheSkgOiBhcnJheSB9XG4gIGNhbWVsaXplID0gZnVuY3Rpb24oc3RyKXsgcmV0dXJuIHN0ci5yZXBsYWNlKC8tKyguKT8vZywgZnVuY3Rpb24obWF0Y2gsIGNocil7IHJldHVybiBjaHIgPyBjaHIudG9VcHBlckNhc2UoKSA6ICcnIH0pIH1cbiAgZnVuY3Rpb24gZGFzaGVyaXplKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvOjovZywgJy8nKVxuICAgICAgICAgICAucmVwbGFjZSgvKFtBLVpdKykoW0EtWl1bYS16XSkvZywgJyQxXyQyJylcbiAgICAgICAgICAgLnJlcGxhY2UoLyhbYS16XFxkXSkoW0EtWl0pL2csICckMV8kMicpXG4gICAgICAgICAgIC5yZXBsYWNlKC9fL2csICctJylcbiAgICAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgfVxuICB1bmlxID0gZnVuY3Rpb24oYXJyYXkpeyByZXR1cm4gZmlsdGVyLmNhbGwoYXJyYXksIGZ1bmN0aW9uKGl0ZW0sIGlkeCl7IHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0pID09IGlkeCB9KSB9XG5cbiAgZnVuY3Rpb24gY2xhc3NSRShuYW1lKSB7XG4gICAgcmV0dXJuIG5hbWUgaW4gY2xhc3NDYWNoZSA/XG4gICAgICBjbGFzc0NhY2hlW25hbWVdIDogKGNsYXNzQ2FjaGVbbmFtZV0gPSBuZXcgUmVnRXhwKCcoXnxcXFxccyknICsgbmFtZSArICcoXFxcXHN8JCknKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlQWRkUHgobmFtZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PSBcIm51bWJlclwiICYmICFjc3NOdW1iZXJbZGFzaGVyaXplKG5hbWUpXSkgPyB2YWx1ZSArIFwicHhcIiA6IHZhbHVlXG4gIH1cblxuICBmdW5jdGlvbiBkZWZhdWx0RGlzcGxheShub2RlTmFtZSkge1xuICAgIHZhciBlbGVtZW50LCBkaXNwbGF5XG4gICAgaWYgKCFlbGVtZW50RGlzcGxheVtub2RlTmFtZV0pIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKVxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KVxuICAgICAgZGlzcGxheSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgJycpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpXG4gICAgICBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudClcbiAgICAgIGRpc3BsYXkgPT0gXCJub25lXCIgJiYgKGRpc3BsYXkgPSBcImJsb2NrXCIpXG4gICAgICBlbGVtZW50RGlzcGxheVtub2RlTmFtZV0gPSBkaXNwbGF5XG4gICAgfVxuICAgIHJldHVybiBlbGVtZW50RGlzcGxheVtub2RlTmFtZV1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gJ2NoaWxkcmVuJyBpbiBlbGVtZW50ID9cbiAgICAgIHNsaWNlLmNhbGwoZWxlbWVudC5jaGlsZHJlbikgOlxuICAgICAgJC5tYXAoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbihub2RlKXsgaWYgKG5vZGUubm9kZVR5cGUgPT0gMSkgcmV0dXJuIG5vZGUgfSlcbiAgfVxuXG4gIC8vIGAkLnplcHRvLmZyYWdtZW50YCB0YWtlcyBhIGh0bWwgc3RyaW5nIGFuZCBhbiBvcHRpb25hbCB0YWcgbmFtZVxuICAvLyB0byBnZW5lcmF0ZSBET00gbm9kZXMgbm9kZXMgZnJvbSB0aGUgZ2l2ZW4gaHRtbCBzdHJpbmcuXG4gIC8vIFRoZSBnZW5lcmF0ZWQgRE9NIG5vZGVzIGFyZSByZXR1cm5lZCBhcyBhbiBhcnJheS5cbiAgLy8gVGhpcyBmdW5jdGlvbiBjYW4gYmUgb3ZlcnJpZGVuIGluIHBsdWdpbnMgZm9yIGV4YW1wbGUgdG8gbWFrZVxuICAvLyBpdCBjb21wYXRpYmxlIHdpdGggYnJvd3NlcnMgdGhhdCBkb24ndCBzdXBwb3J0IHRoZSBET00gZnVsbHkuXG4gIHplcHRvLmZyYWdtZW50ID0gZnVuY3Rpb24oaHRtbCwgbmFtZSwgcHJvcGVydGllcykge1xuICAgIGlmIChodG1sLnJlcGxhY2UpIGh0bWwgPSBodG1sLnJlcGxhY2UodGFnRXhwYW5kZXJSRSwgXCI8JDE+PC8kMj5cIilcbiAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkKSBuYW1lID0gZnJhZ21lbnRSRS50ZXN0KGh0bWwpICYmIFJlZ0V4cC4kMVxuICAgIGlmICghKG5hbWUgaW4gY29udGFpbmVycykpIG5hbWUgPSAnKidcblxuICAgIHZhciBub2RlcywgZG9tLCBjb250YWluZXIgPSBjb250YWluZXJzW25hbWVdXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnICsgaHRtbFxuICAgIGRvbSA9ICQuZWFjaChzbGljZS5jYWxsKGNvbnRhaW5lci5jaGlsZE5vZGVzKSwgZnVuY3Rpb24oKXtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzKVxuICAgIH0pXG4gICAgaWYgKGlzUGxhaW5PYmplY3QocHJvcGVydGllcykpIHtcbiAgICAgIG5vZGVzID0gJChkb20pXG4gICAgICAkLmVhY2gocHJvcGVydGllcywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAobWV0aG9kQXR0cmlidXRlcy5pbmRleE9mKGtleSkgPiAtMSkgbm9kZXNba2V5XSh2YWx1ZSlcbiAgICAgICAgZWxzZSBub2Rlcy5hdHRyKGtleSwgdmFsdWUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZG9tXG4gIH1cblxuICAvLyBgJC56ZXB0by5aYCBzd2FwcyBvdXQgdGhlIHByb3RvdHlwZSBvZiB0aGUgZ2l2ZW4gYGRvbWAgYXJyYXlcbiAgLy8gb2Ygbm9kZXMgd2l0aCBgJC5mbmAgYW5kIHRodXMgc3VwcGx5aW5nIGFsbCB0aGUgWmVwdG8gZnVuY3Rpb25zXG4gIC8vIHRvIHRoZSBhcnJheS4gTm90ZSB0aGF0IGBfX3Byb3RvX19gIGlzIG5vdCBzdXBwb3J0ZWQgb24gSW50ZXJuZXRcbiAgLy8gRXhwbG9yZXIuIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZW4gaW4gcGx1Z2lucy5cbiAgemVwdG8uWiA9IGZ1bmN0aW9uKGRvbSwgc2VsZWN0b3IpIHtcbiAgICBkb20gPSBkb20gfHwgW11cbiAgICBkb20uX19wcm90b19fID0gJC5mblxuICAgIGRvbS5zZWxlY3RvciA9IHNlbGVjdG9yIHx8ICcnXG4gICAgcmV0dXJuIGRvbVxuICB9XG5cbiAgLy8gYCQuemVwdG8uaXNaYCBzaG91bGQgcmV0dXJuIGB0cnVlYCBpZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgWmVwdG9cbiAgLy8gY29sbGVjdGlvbi4gVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJyaWRlbiBpbiBwbHVnaW5zLlxuICB6ZXB0by5pc1ogPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgemVwdG8uWlxuICB9XG5cbiAgLy8gYCQuemVwdG8uaW5pdGAgaXMgWmVwdG8ncyBjb3VudGVycGFydCB0byBqUXVlcnkncyBgJC5mbi5pbml0YCBhbmRcbiAgLy8gdGFrZXMgYSBDU1Mgc2VsZWN0b3IgYW5kIGFuIG9wdGlvbmFsIGNvbnRleHQgKGFuZCBoYW5kbGVzIHZhcmlvdXNcbiAgLy8gc3BlY2lhbCBjYXNlcykuXG4gIC8vIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZW4gaW4gcGx1Z2lucy5cbiAgemVwdG8uaW5pdCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgLy8gSWYgbm90aGluZyBnaXZlbiwgcmV0dXJuIGFuIGVtcHR5IFplcHRvIGNvbGxlY3Rpb25cbiAgICBpZiAoIXNlbGVjdG9yKSByZXR1cm4gemVwdG8uWigpXG4gICAgLy8gSWYgYSBmdW5jdGlvbiBpcyBnaXZlbiwgY2FsbCBpdCB3aGVuIHRoZSBET00gaXMgcmVhZHlcbiAgICBlbHNlIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSkgcmV0dXJuICQoZG9jdW1lbnQpLnJlYWR5KHNlbGVjdG9yKVxuICAgIC8vIElmIGEgWmVwdG8gY29sbGVjdGlvbiBpcyBnaXZlbiwganV0cyByZXR1cm4gaXRcbiAgICBlbHNlIGlmICh6ZXB0by5pc1ooc2VsZWN0b3IpKSByZXR1cm4gc2VsZWN0b3JcbiAgICBlbHNlIHtcbiAgICAgIHZhciBkb21cbiAgICAgIC8vIG5vcm1hbGl6ZSBhcnJheSBpZiBhbiBhcnJheSBvZiBub2RlcyBpcyBnaXZlblxuICAgICAgaWYgKGlzQXJyYXkoc2VsZWN0b3IpKSBkb20gPSBjb21wYWN0KHNlbGVjdG9yKVxuICAgICAgLy8gV3JhcCBET00gbm9kZXMuIElmIGEgcGxhaW4gb2JqZWN0IGlzIGdpdmVuLCBkdXBsaWNhdGUgaXQuXG4gICAgICBlbHNlIGlmIChpc09iamVjdChzZWxlY3RvcikpXG4gICAgICAgIGRvbSA9IFtpc1BsYWluT2JqZWN0KHNlbGVjdG9yKSA/ICQuZXh0ZW5kKHt9LCBzZWxlY3RvcikgOiBzZWxlY3Rvcl0sIHNlbGVjdG9yID0gbnVsbFxuICAgICAgLy8gSWYgaXQncyBhIGh0bWwgZnJhZ21lbnQsIGNyZWF0ZSBub2RlcyBmcm9tIGl0XG4gICAgICBlbHNlIGlmIChmcmFnbWVudFJFLnRlc3Qoc2VsZWN0b3IpKVxuICAgICAgICBkb20gPSB6ZXB0by5mcmFnbWVudChzZWxlY3Rvci50cmltKCksIFJlZ0V4cC4kMSwgY29udGV4dCksIHNlbGVjdG9yID0gbnVsbFxuICAgICAgLy8gSWYgdGhlcmUncyBhIGNvbnRleHQsIGNyZWF0ZSBhIGNvbGxlY3Rpb24gb24gdGhhdCBjb250ZXh0IGZpcnN0LCBhbmQgc2VsZWN0XG4gICAgICAvLyBub2RlcyBmcm9tIHRoZXJlXG4gICAgICBlbHNlIGlmIChjb250ZXh0ICE9PSB1bmRlZmluZWQpIHJldHVybiAkKGNvbnRleHQpLmZpbmQoc2VsZWN0b3IpXG4gICAgICAvLyBBbmQgbGFzdCBidXQgbm8gbGVhc3QsIGlmIGl0J3MgYSBDU1Mgc2VsZWN0b3IsIHVzZSBpdCB0byBzZWxlY3Qgbm9kZXMuXG4gICAgICBlbHNlIGRvbSA9IHplcHRvLnFzYShkb2N1bWVudCwgc2VsZWN0b3IpXG4gICAgICAvLyBjcmVhdGUgYSBuZXcgWmVwdG8gY29sbGVjdGlvbiBmcm9tIHRoZSBub2RlcyBmb3VuZFxuICAgICAgcmV0dXJuIHplcHRvLlooZG9tLCBzZWxlY3RvcilcbiAgICB9XG4gIH1cblxuICAvLyBgJGAgd2lsbCBiZSB0aGUgYmFzZSBgWmVwdG9gIG9iamVjdC4gV2hlbiBjYWxsaW5nIHRoaXNcbiAgLy8gZnVuY3Rpb24ganVzdCBjYWxsIGAkLnplcHRvLmluaXQsIHdoaWNoIG1ha2VzIHRoZSBpbXBsZW1lbnRhdGlvblxuICAvLyBkZXRhaWxzIG9mIHNlbGVjdGluZyBub2RlcyBhbmQgY3JlYXRpbmcgWmVwdG8gY29sbGVjdGlvbnNcbiAgLy8gcGF0Y2hhYmxlIGluIHBsdWdpbnMuXG4gICQgPSBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCl7XG4gICAgcmV0dXJuIHplcHRvLmluaXQoc2VsZWN0b3IsIGNvbnRleHQpXG4gIH1cblxuICBmdW5jdGlvbiBleHRlbmQodGFyZ2V0LCBzb3VyY2UsIGRlZXApIHtcbiAgICBmb3IgKGtleSBpbiBzb3VyY2UpXG4gICAgICBpZiAoZGVlcCAmJiAoaXNQbGFpbk9iamVjdChzb3VyY2Vba2V5XSkgfHwgaXNBcnJheShzb3VyY2Vba2V5XSkpKSB7XG4gICAgICAgIGlmIChpc1BsYWluT2JqZWN0KHNvdXJjZVtrZXldKSAmJiAhaXNQbGFpbk9iamVjdCh0YXJnZXRba2V5XSkpXG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSB7fVxuICAgICAgICBpZiAoaXNBcnJheShzb3VyY2Vba2V5XSkgJiYgIWlzQXJyYXkodGFyZ2V0W2tleV0pKVxuICAgICAgICAgIHRhcmdldFtrZXldID0gW11cbiAgICAgICAgZXh0ZW5kKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgZGVlcClcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHNvdXJjZVtrZXldICE9PSB1bmRlZmluZWQpIHRhcmdldFtrZXldID0gc291cmNlW2tleV1cbiAgfVxuXG4gIC8vIENvcHkgYWxsIGJ1dCB1bmRlZmluZWQgcHJvcGVydGllcyBmcm9tIG9uZSBvciBtb3JlXG4gIC8vIG9iamVjdHMgdG8gdGhlIGB0YXJnZXRgIG9iamVjdC5cbiAgJC5leHRlbmQgPSBmdW5jdGlvbih0YXJnZXQpe1xuICAgIHZhciBkZWVwLCBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBkZWVwID0gdGFyZ2V0XG4gICAgICB0YXJnZXQgPSBhcmdzLnNoaWZ0KClcbiAgICB9XG4gICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGFyZyl7IGV4dGVuZCh0YXJnZXQsIGFyZywgZGVlcCkgfSlcbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cblxuICAvLyBgJC56ZXB0by5xc2FgIGlzIFplcHRvJ3MgQ1NTIHNlbGVjdG9yIGltcGxlbWVudGF0aW9uIHdoaWNoXG4gIC8vIHVzZXMgYGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGxgIGFuZCBvcHRpbWl6ZXMgZm9yIHNvbWUgc3BlY2lhbCBjYXNlcywgbGlrZSBgI2lkYC5cbiAgLy8gVGhpcyBtZXRob2QgY2FuIGJlIG92ZXJyaWRlbiBpbiBwbHVnaW5zLlxuICB6ZXB0by5xc2EgPSBmdW5jdGlvbihlbGVtZW50LCBzZWxlY3Rvcil7XG4gICAgdmFyIGZvdW5kXG4gICAgcmV0dXJuIChpc0RvY3VtZW50KGVsZW1lbnQpICYmIGlkU2VsZWN0b3JSRS50ZXN0KHNlbGVjdG9yKSkgP1xuICAgICAgKCAoZm91bmQgPSBlbGVtZW50LmdldEVsZW1lbnRCeUlkKFJlZ0V4cC4kMSkpID8gW2ZvdW5kXSA6IFtdICkgOlxuICAgICAgKGVsZW1lbnQubm9kZVR5cGUgIT09IDEgJiYgZWxlbWVudC5ub2RlVHlwZSAhPT0gOSkgPyBbXSA6XG4gICAgICBzbGljZS5jYWxsKFxuICAgICAgICBjbGFzc1NlbGVjdG9yUkUudGVzdChzZWxlY3RvcikgPyBlbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoUmVnRXhwLiQxKSA6XG4gICAgICAgIHRhZ1NlbGVjdG9yUkUudGVzdChzZWxlY3RvcikgPyBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHNlbGVjdG9yKSA6XG4gICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgICAgIClcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbHRlcmVkKG5vZGVzLCBzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3RvciA9PT0gdW5kZWZpbmVkID8gJChub2RlcykgOiAkKG5vZGVzKS5maWx0ZXIoc2VsZWN0b3IpXG4gIH1cblxuICAkLmNvbnRhaW5zID0gZnVuY3Rpb24ocGFyZW50LCBub2RlKSB7XG4gICAgcmV0dXJuIHBhcmVudCAhPT0gbm9kZSAmJiBwYXJlbnQuY29udGFpbnMobm9kZSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGZ1bmNBcmcoY29udGV4dCwgYXJnLCBpZHgsIHBheWxvYWQpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihhcmcpID8gYXJnLmNhbGwoY29udGV4dCwgaWR4LCBwYXlsb2FkKSA6IGFyZ1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0QXR0cmlidXRlKG5vZGUsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFsdWUgPT0gbnVsbCA/IG5vZGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpIDogbm9kZS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsdWUpXG4gIH1cblxuICAvLyBhY2Nlc3MgY2xhc3NOYW1lIHByb3BlcnR5IHdoaWxlIHJlc3BlY3RpbmcgU1ZHQW5pbWF0ZWRTdHJpbmdcbiAgZnVuY3Rpb24gY2xhc3NOYW1lKG5vZGUsIHZhbHVlKXtcbiAgICB2YXIga2xhc3MgPSBub2RlLmNsYXNzTmFtZSxcbiAgICAgICAgc3ZnICAgPSBrbGFzcyAmJiBrbGFzcy5iYXNlVmFsICE9PSB1bmRlZmluZWRcblxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gc3ZnID8ga2xhc3MuYmFzZVZhbCA6IGtsYXNzXG4gICAgc3ZnID8gKGtsYXNzLmJhc2VWYWwgPSB2YWx1ZSkgOiAobm9kZS5jbGFzc05hbWUgPSB2YWx1ZSlcbiAgfVxuXG4gIC8vIFwidHJ1ZVwiICA9PiB0cnVlXG4gIC8vIFwiZmFsc2VcIiA9PiBmYWxzZVxuICAvLyBcIm51bGxcIiAgPT4gbnVsbFxuICAvLyBcIjQyXCIgICAgPT4gNDJcbiAgLy8gXCI0Mi41XCIgID0+IDQyLjVcbiAgLy8gSlNPTiAgICA9PiBwYXJzZSBpZiB2YWxpZFxuICAvLyBTdHJpbmcgID0+IHNlbGZcbiAgZnVuY3Rpb24gZGVzZXJpYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIHZhciBudW1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHZhbHVlID9cbiAgICAgICAgdmFsdWUgPT0gXCJ0cnVlXCIgfHxcbiAgICAgICAgKCB2YWx1ZSA9PSBcImZhbHNlXCIgPyBmYWxzZSA6XG4gICAgICAgICAgdmFsdWUgPT0gXCJudWxsXCIgPyBudWxsIDpcbiAgICAgICAgICAhaXNOYU4obnVtID0gTnVtYmVyKHZhbHVlKSkgPyBudW0gOlxuICAgICAgICAgIC9eW1xcW1xce10vLnRlc3QodmFsdWUpID8gJC5wYXJzZUpTT04odmFsdWUpIDpcbiAgICAgICAgICB2YWx1ZSApXG4gICAgICAgIDogdmFsdWVcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gICQudHlwZSA9IHR5cGVcbiAgJC5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvblxuICAkLmlzV2luZG93ID0gaXNXaW5kb3dcbiAgJC5pc0FycmF5ID0gaXNBcnJheVxuICAkLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0XG5cbiAgJC5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVcbiAgICBmb3IgKG5hbWUgaW4gb2JqKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgJC5pbkFycmF5ID0gZnVuY3Rpb24oZWxlbSwgYXJyYXksIGkpe1xuICAgIHJldHVybiBlbXB0eUFycmF5LmluZGV4T2YuY2FsbChhcnJheSwgZWxlbSwgaSlcbiAgfVxuXG4gICQuY2FtZWxDYXNlID0gY2FtZWxpemVcbiAgJC50cmltID0gZnVuY3Rpb24oc3RyKSB7IHJldHVybiBzdHIudHJpbSgpIH1cblxuICAvLyBwbHVnaW4gY29tcGF0aWJpbGl0eVxuICAkLnV1aWQgPSAwXG4gICQuc3VwcG9ydCA9IHsgfVxuICAkLmV4cHIgPSB7IH1cblxuICAkLm1hcCA9IGZ1bmN0aW9uKGVsZW1lbnRzLCBjYWxsYmFjayl7XG4gICAgdmFyIHZhbHVlLCB2YWx1ZXMgPSBbXSwgaSwga2V5XG4gICAgaWYgKGxpa2VBcnJheShlbGVtZW50cykpXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBjYWxsYmFjayhlbGVtZW50c1tpXSwgaSlcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHZhbHVlcy5wdXNoKHZhbHVlKVxuICAgICAgfVxuICAgIGVsc2VcbiAgICAgIGZvciAoa2V5IGluIGVsZW1lbnRzKSB7XG4gICAgICAgIHZhbHVlID0gY2FsbGJhY2soZWxlbWVudHNba2V5XSwga2V5KVxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkgdmFsdWVzLnB1c2godmFsdWUpXG4gICAgICB9XG4gICAgcmV0dXJuIGZsYXR0ZW4odmFsdWVzKVxuICB9XG5cbiAgJC5lYWNoID0gZnVuY3Rpb24oZWxlbWVudHMsIGNhbGxiYWNrKXtcbiAgICB2YXIgaSwga2V5XG4gICAgaWYgKGxpa2VBcnJheShlbGVtZW50cykpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoZWxlbWVudHNbaV0sIGksIGVsZW1lbnRzW2ldKSA9PT0gZmFsc2UpIHJldHVybiBlbGVtZW50c1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGtleSBpbiBlbGVtZW50cylcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoZWxlbWVudHNba2V5XSwga2V5LCBlbGVtZW50c1trZXldKSA9PT0gZmFsc2UpIHJldHVybiBlbGVtZW50c1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50c1xuICB9XG5cbiAgJC5ncmVwID0gZnVuY3Rpb24oZWxlbWVudHMsIGNhbGxiYWNrKXtcbiAgICByZXR1cm4gZmlsdGVyLmNhbGwoZWxlbWVudHMsIGNhbGxiYWNrKVxuICB9XG5cbiAgaWYgKHdpbmRvdy5KU09OKSAkLnBhcnNlSlNPTiA9IEpTT04ucGFyc2VcblxuICAvLyBQb3B1bGF0ZSB0aGUgY2xhc3MydHlwZSBtYXBcbiAgJC5lYWNoKFwiQm9vbGVhbiBOdW1iZXIgU3RyaW5nIEZ1bmN0aW9uIEFycmF5IERhdGUgUmVnRXhwIE9iamVjdCBFcnJvclwiLnNwbGl0KFwiIFwiKSwgZnVuY3Rpb24oaSwgbmFtZSkge1xuICAgIGNsYXNzMnR5cGVbIFwiW29iamVjdCBcIiArIG5hbWUgKyBcIl1cIiBdID0gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH0pXG5cbiAgLy8gRGVmaW5lIG1ldGhvZHMgdGhhdCB3aWxsIGJlIGF2YWlsYWJsZSBvbiBhbGxcbiAgLy8gWmVwdG8gY29sbGVjdGlvbnNcbiAgJC5mbiA9IHtcbiAgICAvLyBCZWNhdXNlIGEgY29sbGVjdGlvbiBhY3RzIGxpa2UgYW4gYXJyYXlcbiAgICAvLyBjb3B5IG92ZXIgdGhlc2UgdXNlZnVsIGFycmF5IGZ1bmN0aW9ucy5cbiAgICBmb3JFYWNoOiBlbXB0eUFycmF5LmZvckVhY2gsXG4gICAgcmVkdWNlOiBlbXB0eUFycmF5LnJlZHVjZSxcbiAgICBwdXNoOiBlbXB0eUFycmF5LnB1c2gsXG4gICAgc29ydDogZW1wdHlBcnJheS5zb3J0LFxuICAgIGluZGV4T2Y6IGVtcHR5QXJyYXkuaW5kZXhPZixcbiAgICBjb25jYXQ6IGVtcHR5QXJyYXkuY29uY2F0LFxuXG4gICAgLy8gYG1hcGAgYW5kIGBzbGljZWAgaW4gdGhlIGpRdWVyeSBBUEkgd29yayBkaWZmZXJlbnRseVxuICAgIC8vIGZyb20gdGhlaXIgYXJyYXkgY291bnRlcnBhcnRzXG4gICAgbWFwOiBmdW5jdGlvbihmbil7XG4gICAgICByZXR1cm4gJCgkLm1hcCh0aGlzLCBmdW5jdGlvbihlbCwgaSl7IHJldHVybiBmbi5jYWxsKGVsLCBpLCBlbCkgfSkpXG4gICAgfSxcbiAgICBzbGljZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkKHNsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpXG4gICAgfSxcblxuICAgIHJlYWR5OiBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICBpZiAocmVhZHlSRS50ZXN0KGRvY3VtZW50LnJlYWR5U3RhdGUpKSBjYWxsYmFjaygkKVxuICAgICAgZWxzZSBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXsgY2FsbGJhY2soJCkgfSwgZmFsc2UpXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihpZHgpe1xuICAgICAgcmV0dXJuIGlkeCA9PT0gdW5kZWZpbmVkID8gc2xpY2UuY2FsbCh0aGlzKSA6IHRoaXNbaWR4ID49IDAgPyBpZHggOiBpZHggKyB0aGlzLmxlbmd0aF1cbiAgICB9LFxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzLmdldCgpIH0sXG4gICAgc2l6ZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLmxlbmd0aFxuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICBpZiAodGhpcy5wYXJlbnROb2RlICE9IG51bGwpXG4gICAgICAgICAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpXG4gICAgICB9KVxuICAgIH0sXG4gICAgZWFjaDogZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgZW1wdHlBcnJheS5ldmVyeS5jYWxsKHRoaXMsIGZ1bmN0aW9uKGVsLCBpZHgpe1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChlbCwgaWR4LCBlbCkgIT09IGZhbHNlXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgaWYgKGlzRnVuY3Rpb24oc2VsZWN0b3IpKSByZXR1cm4gdGhpcy5ub3QodGhpcy5ub3Qoc2VsZWN0b3IpKVxuICAgICAgcmV0dXJuICQoZmlsdGVyLmNhbGwodGhpcywgZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgICAgIHJldHVybiB6ZXB0by5tYXRjaGVzKGVsZW1lbnQsIHNlbGVjdG9yKVxuICAgICAgfSkpXG4gICAgfSxcbiAgICBhZGQ6IGZ1bmN0aW9uKHNlbGVjdG9yLGNvbnRleHQpe1xuICAgICAgcmV0dXJuICQodW5pcSh0aGlzLmNvbmNhdCgkKHNlbGVjdG9yLGNvbnRleHQpKSkpXG4gICAgfSxcbiAgICBpczogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID4gMCAmJiB6ZXB0by5tYXRjaGVzKHRoaXNbMF0sIHNlbGVjdG9yKVxuICAgIH0sXG4gICAgbm90OiBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICB2YXIgbm9kZXM9W11cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSAmJiBzZWxlY3Rvci5jYWxsICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpZHgpe1xuICAgICAgICAgIGlmICghc2VsZWN0b3IuY2FsbCh0aGlzLGlkeCkpIG5vZGVzLnB1c2godGhpcylcbiAgICAgICAgfSlcbiAgICAgIGVsc2Uge1xuICAgICAgICB2YXIgZXhjbHVkZXMgPSB0eXBlb2Ygc2VsZWN0b3IgPT0gJ3N0cmluZycgPyB0aGlzLmZpbHRlcihzZWxlY3RvcikgOlxuICAgICAgICAgIChsaWtlQXJyYXkoc2VsZWN0b3IpICYmIGlzRnVuY3Rpb24oc2VsZWN0b3IuaXRlbSkpID8gc2xpY2UuY2FsbChzZWxlY3RvcikgOiAkKHNlbGVjdG9yKVxuICAgICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24oZWwpe1xuICAgICAgICAgIGlmIChleGNsdWRlcy5pbmRleE9mKGVsKSA8IDApIG5vZGVzLnB1c2goZWwpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gJChub2RlcylcbiAgICB9LFxuICAgIGhhczogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBpc09iamVjdChzZWxlY3RvcikgP1xuICAgICAgICAgICQuY29udGFpbnModGhpcywgc2VsZWN0b3IpIDpcbiAgICAgICAgICAkKHRoaXMpLmZpbmQoc2VsZWN0b3IpLnNpemUoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIGVxOiBmdW5jdGlvbihpZHgpe1xuICAgICAgcmV0dXJuIGlkeCA9PT0gLTEgPyB0aGlzLnNsaWNlKGlkeCkgOiB0aGlzLnNsaWNlKGlkeCwgKyBpZHggKyAxKVxuICAgIH0sXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZWwgPSB0aGlzWzBdXG4gICAgICByZXR1cm4gZWwgJiYgIWlzT2JqZWN0KGVsKSA/IGVsIDogJChlbClcbiAgICB9LFxuICAgIGxhc3Q6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgZWwgPSB0aGlzW3RoaXMubGVuZ3RoIC0gMV1cbiAgICAgIHJldHVybiBlbCAmJiAhaXNPYmplY3QoZWwpID8gZWwgOiAkKGVsKVxuICAgIH0sXG4gICAgZmluZDogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgdmFyIHJlc3VsdCwgJHRoaXMgPSB0aGlzXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09ICdvYmplY3QnKVxuICAgICAgICByZXN1bHQgPSAkKHNlbGVjdG9yKS5maWx0ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgbm9kZSA9IHRoaXNcbiAgICAgICAgICByZXR1cm4gZW1wdHlBcnJheS5zb21lLmNhbGwoJHRoaXMsIGZ1bmN0aW9uKHBhcmVudCl7XG4gICAgICAgICAgICByZXR1cm4gJC5jb250YWlucyhwYXJlbnQsIG5vZGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIGVsc2UgaWYgKHRoaXMubGVuZ3RoID09IDEpIHJlc3VsdCA9ICQoemVwdG8ucXNhKHRoaXNbMF0sIHNlbGVjdG9yKSlcbiAgICAgIGVsc2UgcmVzdWx0ID0gdGhpcy5tYXAoZnVuY3Rpb24oKXsgcmV0dXJuIHplcHRvLnFzYSh0aGlzLCBzZWxlY3RvcikgfSlcbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9LFxuICAgIGNsb3Nlc3Q6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KXtcbiAgICAgIHZhciBub2RlID0gdGhpc1swXSwgY29sbGVjdGlvbiA9IGZhbHNlXG4gICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09ICdvYmplY3QnKSBjb2xsZWN0aW9uID0gJChzZWxlY3RvcilcbiAgICAgIHdoaWxlIChub2RlICYmICEoY29sbGVjdGlvbiA/IGNvbGxlY3Rpb24uaW5kZXhPZihub2RlKSA+PSAwIDogemVwdG8ubWF0Y2hlcyhub2RlLCBzZWxlY3RvcikpKVxuICAgICAgICBub2RlID0gbm9kZSAhPT0gY29udGV4dCAmJiAhaXNEb2N1bWVudChub2RlKSAmJiBub2RlLnBhcmVudE5vZGVcbiAgICAgIHJldHVybiAkKG5vZGUpXG4gICAgfSxcbiAgICBwYXJlbnRzOiBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICB2YXIgYW5jZXN0b3JzID0gW10sIG5vZGVzID0gdGhpc1xuICAgICAgd2hpbGUgKG5vZGVzLmxlbmd0aCA+IDApXG4gICAgICAgIG5vZGVzID0gJC5tYXAobm9kZXMsIGZ1bmN0aW9uKG5vZGUpe1xuICAgICAgICAgIGlmICgobm9kZSA9IG5vZGUucGFyZW50Tm9kZSkgJiYgIWlzRG9jdW1lbnQobm9kZSkgJiYgYW5jZXN0b3JzLmluZGV4T2Yobm9kZSkgPCAwKSB7XG4gICAgICAgICAgICBhbmNlc3RvcnMucHVzaChub2RlKVxuICAgICAgICAgICAgcmV0dXJuIG5vZGVcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICByZXR1cm4gZmlsdGVyZWQoYW5jZXN0b3JzLCBzZWxlY3RvcilcbiAgICB9LFxuICAgIHBhcmVudDogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgcmV0dXJuIGZpbHRlcmVkKHVuaXEodGhpcy5wbHVjaygncGFyZW50Tm9kZScpKSwgc2VsZWN0b3IpXG4gICAgfSxcbiAgICBjaGlsZHJlbjogZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgcmV0dXJuIGZpbHRlcmVkKHRoaXMubWFwKGZ1bmN0aW9uKCl7IHJldHVybiBjaGlsZHJlbih0aGlzKSB9KSwgc2VsZWN0b3IpXG4gICAgfSxcbiAgICBjb250ZW50czogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKSB7IHJldHVybiBzbGljZS5jYWxsKHRoaXMuY2hpbGROb2RlcykgfSlcbiAgICB9LFxuICAgIHNpYmxpbmdzOiBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICByZXR1cm4gZmlsdGVyZWQodGhpcy5tYXAoZnVuY3Rpb24oaSwgZWwpe1xuICAgICAgICByZXR1cm4gZmlsdGVyLmNhbGwoY2hpbGRyZW4oZWwucGFyZW50Tm9kZSksIGZ1bmN0aW9uKGNoaWxkKXsgcmV0dXJuIGNoaWxkIT09ZWwgfSlcbiAgICAgIH0pLCBzZWxlY3RvcilcbiAgICB9LFxuICAgIGVtcHR5OiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpeyB0aGlzLmlubmVySFRNTCA9ICcnIH0pXG4gICAgfSxcbiAgICAvLyBgcGx1Y2tgIGlzIGJvcnJvd2VkIGZyb20gUHJvdG90eXBlLmpzXG4gICAgcGx1Y2s6IGZ1bmN0aW9uKHByb3BlcnR5KXtcbiAgICAgIHJldHVybiAkLm1hcCh0aGlzLCBmdW5jdGlvbihlbCl7IHJldHVybiBlbFtwcm9wZXJ0eV0gfSlcbiAgICB9LFxuICAgIHNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9PSBcIm5vbmVcIiAmJiAodGhpcy5zdHlsZS5kaXNwbGF5ID0gbnVsbClcbiAgICAgICAgaWYgKGdldENvbXB1dGVkU3R5bGUodGhpcywgJycpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpID09IFwibm9uZVwiKVxuICAgICAgICAgIHRoaXMuc3R5bGUuZGlzcGxheSA9IGRlZmF1bHREaXNwbGF5KHRoaXMubm9kZU5hbWUpXG4gICAgICB9KVxuICAgIH0sXG4gICAgcmVwbGFjZVdpdGg6IGZ1bmN0aW9uKG5ld0NvbnRlbnQpe1xuICAgICAgcmV0dXJuIHRoaXMuYmVmb3JlKG5ld0NvbnRlbnQpLnJlbW92ZSgpXG4gICAgfSxcbiAgICB3cmFwOiBmdW5jdGlvbihzdHJ1Y3R1cmUpe1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmN0aW9uKHN0cnVjdHVyZSlcbiAgICAgIGlmICh0aGlzWzBdICYmICFmdW5jKVxuICAgICAgICB2YXIgZG9tICAgPSAkKHN0cnVjdHVyZSkuZ2V0KDApLFxuICAgICAgICAgICAgY2xvbmUgPSBkb20ucGFyZW50Tm9kZSB8fCB0aGlzLmxlbmd0aCA+IDFcblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgICQodGhpcykud3JhcEFsbChcbiAgICAgICAgICBmdW5jID8gc3RydWN0dXJlLmNhbGwodGhpcywgaW5kZXgpIDpcbiAgICAgICAgICAgIGNsb25lID8gZG9tLmNsb25lTm9kZSh0cnVlKSA6IGRvbVxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0sXG4gICAgd3JhcEFsbDogZnVuY3Rpb24oc3RydWN0dXJlKXtcbiAgICAgIGlmICh0aGlzWzBdKSB7XG4gICAgICAgICQodGhpc1swXSkuYmVmb3JlKHN0cnVjdHVyZSA9ICQoc3RydWN0dXJlKSlcbiAgICAgICAgdmFyIGNoaWxkcmVuXG4gICAgICAgIC8vIGRyaWxsIGRvd24gdG8gdGhlIGlubW9zdCBlbGVtZW50XG4gICAgICAgIHdoaWxlICgoY2hpbGRyZW4gPSBzdHJ1Y3R1cmUuY2hpbGRyZW4oKSkubGVuZ3RoKSBzdHJ1Y3R1cmUgPSBjaGlsZHJlbi5maXJzdCgpXG4gICAgICAgICQoc3RydWN0dXJlKS5hcHBlbmQodGhpcylcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICB3cmFwSW5uZXI6IGZ1bmN0aW9uKHN0cnVjdHVyZSl7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuY3Rpb24oc3RydWN0dXJlKVxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpbmRleCl7XG4gICAgICAgIHZhciBzZWxmID0gJCh0aGlzKSwgY29udGVudHMgPSBzZWxmLmNvbnRlbnRzKCksXG4gICAgICAgICAgICBkb20gID0gZnVuYyA/IHN0cnVjdHVyZS5jYWxsKHRoaXMsIGluZGV4KSA6IHN0cnVjdHVyZVxuICAgICAgICBjb250ZW50cy5sZW5ndGggPyBjb250ZW50cy53cmFwQWxsKGRvbSkgOiBzZWxmLmFwcGVuZChkb20pXG4gICAgICB9KVxuICAgIH0sXG4gICAgdW53cmFwOiBmdW5jdGlvbigpe1xuICAgICAgdGhpcy5wYXJlbnQoKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICQodGhpcykucmVwbGFjZVdpdGgoJCh0aGlzKS5jaGlsZHJlbigpKVxuICAgICAgfSlcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSxcbiAgICBjbG9uZTogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpeyByZXR1cm4gdGhpcy5jbG9uZU5vZGUodHJ1ZSkgfSlcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gdGhpcy5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKVxuICAgIH0sXG4gICAgdG9nZ2xlOiBmdW5jdGlvbihzZXR0aW5nKXtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGVsID0gJCh0aGlzKVxuICAgICAgICA7KHNldHRpbmcgPT09IHVuZGVmaW5lZCA/IGVsLmNzcyhcImRpc3BsYXlcIikgPT0gXCJub25lXCIgOiBzZXR0aW5nKSA/IGVsLnNob3coKSA6IGVsLmhpZGUoKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHByZXY6IGZ1bmN0aW9uKHNlbGVjdG9yKXsgcmV0dXJuICQodGhpcy5wbHVjaygncHJldmlvdXNFbGVtZW50U2libGluZycpKS5maWx0ZXIoc2VsZWN0b3IgfHwgJyonKSB9LFxuICAgIG5leHQ6IGZ1bmN0aW9uKHNlbGVjdG9yKXsgcmV0dXJuICQodGhpcy5wbHVjaygnbmV4dEVsZW1lbnRTaWJsaW5nJykpLmZpbHRlcihzZWxlY3RvciB8fCAnKicpIH0sXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICByZXR1cm4gaHRtbCA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgKHRoaXMubGVuZ3RoID4gMCA/IHRoaXNbMF0uaW5uZXJIVE1MIDogbnVsbCkgOlxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcbiAgICAgICAgICB2YXIgb3JpZ2luSHRtbCA9IHRoaXMuaW5uZXJIVE1MXG4gICAgICAgICAgJCh0aGlzKS5lbXB0eSgpLmFwcGVuZCggZnVuY0FyZyh0aGlzLCBodG1sLCBpZHgsIG9yaWdpbkh0bWwpIClcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgcmV0dXJuIHRleHQgPT09IHVuZGVmaW5lZCA/XG4gICAgICAgICh0aGlzLmxlbmd0aCA+IDAgPyB0aGlzWzBdLnRleHRDb250ZW50IDogbnVsbCkgOlxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXsgdGhpcy50ZXh0Q29udGVudCA9IHRleHQgfSlcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcbiAgICAgIHZhciByZXN1bHRcbiAgICAgIHJldHVybiAodHlwZW9mIG5hbWUgPT0gJ3N0cmluZycgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgP1xuICAgICAgICAodGhpcy5sZW5ndGggPT0gMCB8fCB0aGlzWzBdLm5vZGVUeXBlICE9PSAxID8gdW5kZWZpbmVkIDpcbiAgICAgICAgICAobmFtZSA9PSAndmFsdWUnICYmIHRoaXNbMF0ubm9kZU5hbWUgPT0gJ0lOUFVUJykgPyB0aGlzLnZhbCgpIDpcbiAgICAgICAgICAoIShyZXN1bHQgPSB0aGlzWzBdLmdldEF0dHJpYnV0ZShuYW1lKSkgJiYgbmFtZSBpbiB0aGlzWzBdKSA/IHRoaXNbMF1bbmFtZV0gOiByZXN1bHRcbiAgICAgICAgKSA6XG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbihpZHgpe1xuICAgICAgICAgIGlmICh0aGlzLm5vZGVUeXBlICE9PSAxKSByZXR1cm5cbiAgICAgICAgICBpZiAoaXNPYmplY3QobmFtZSkpIGZvciAoa2V5IGluIG5hbWUpIHNldEF0dHJpYnV0ZSh0aGlzLCBrZXksIG5hbWVba2V5XSlcbiAgICAgICAgICBlbHNlIHNldEF0dHJpYnV0ZSh0aGlzLCBuYW1lLCBmdW5jQXJnKHRoaXMsIHZhbHVlLCBpZHgsIHRoaXMuZ2V0QXR0cmlidXRlKG5hbWUpKSlcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIHJlbW92ZUF0dHI6IGZ1bmN0aW9uKG5hbWUpe1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpeyB0aGlzLm5vZGVUeXBlID09PSAxICYmIHNldEF0dHJpYnV0ZSh0aGlzLCBuYW1lKSB9KVxuICAgIH0sXG4gICAgcHJvcDogZnVuY3Rpb24obmFtZSwgdmFsdWUpe1xuICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/XG4gICAgICAgICh0aGlzWzBdICYmIHRoaXNbMF1bbmFtZV0pIDpcbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XG4gICAgICAgICAgdGhpc1tuYW1lXSA9IGZ1bmNBcmcodGhpcywgdmFsdWUsIGlkeCwgdGhpc1tuYW1lXSlcbiAgICAgICAgfSlcbiAgICB9LFxuICAgIGRhdGE6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcbiAgICAgIHZhciBkYXRhID0gdGhpcy5hdHRyKCdkYXRhLScgKyBkYXNoZXJpemUobmFtZSksIHZhbHVlKVxuICAgICAgcmV0dXJuIGRhdGEgIT09IG51bGwgPyBkZXNlcmlhbGl6ZVZhbHVlKGRhdGEpIDogdW5kZWZpbmVkXG4gICAgfSxcbiAgICB2YWw6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAodmFsdWUgPT09IHVuZGVmaW5lZCkgP1xuICAgICAgICAodGhpc1swXSAmJiAodGhpc1swXS5tdWx0aXBsZSA/XG4gICAgICAgICAgICQodGhpc1swXSkuZmluZCgnb3B0aW9uJykuZmlsdGVyKGZ1bmN0aW9uKG8peyByZXR1cm4gdGhpcy5zZWxlY3RlZCB9KS5wbHVjaygndmFsdWUnKSA6XG4gICAgICAgICAgIHRoaXNbMF0udmFsdWUpXG4gICAgICAgICkgOlxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcbiAgICAgICAgICB0aGlzLnZhbHVlID0gZnVuY0FyZyh0aGlzLCB2YWx1ZSwgaWR4LCB0aGlzLnZhbHVlKVxuICAgICAgICB9KVxuICAgIH0sXG4gICAgb2Zmc2V0OiBmdW5jdGlvbihjb29yZGluYXRlcyl7XG4gICAgICBpZiAoY29vcmRpbmF0ZXMpIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaW5kZXgpe1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgY29vcmRzID0gZnVuY0FyZyh0aGlzLCBjb29yZGluYXRlcywgaW5kZXgsICR0aGlzLm9mZnNldCgpKSxcbiAgICAgICAgICAgIHBhcmVudE9mZnNldCA9ICR0aGlzLm9mZnNldFBhcmVudCgpLm9mZnNldCgpLFxuICAgICAgICAgICAgcHJvcHMgPSB7XG4gICAgICAgICAgICAgIHRvcDogIGNvb3Jkcy50b3AgIC0gcGFyZW50T2Zmc2V0LnRvcCxcbiAgICAgICAgICAgICAgbGVmdDogY29vcmRzLmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdFxuICAgICAgICAgICAgfVxuXG4gICAgICAgIGlmICgkdGhpcy5jc3MoJ3Bvc2l0aW9uJykgPT0gJ3N0YXRpYycpIHByb3BzWydwb3NpdGlvbiddID0gJ3JlbGF0aXZlJ1xuICAgICAgICAkdGhpcy5jc3MocHJvcHMpXG4gICAgICB9KVxuICAgICAgaWYgKHRoaXMubGVuZ3RoPT0wKSByZXR1cm4gbnVsbFxuICAgICAgdmFyIG9iaiA9IHRoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IG9iai5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0LFxuICAgICAgICB0b3A6IG9iai50b3AgKyB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKG9iai53aWR0aCksXG4gICAgICAgIGhlaWdodDogTWF0aC5yb3VuZChvYmouaGVpZ2h0KVxuICAgICAgfVxuICAgIH0sXG4gICAgY3NzOiBmdW5jdGlvbihwcm9wZXJ0eSwgdmFsdWUpe1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyICYmIHR5cGVvZiBwcm9wZXJ0eSA9PSAnc3RyaW5nJylcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0gJiYgKHRoaXNbMF0uc3R5bGVbY2FtZWxpemUocHJvcGVydHkpXSB8fCBnZXRDb21wdXRlZFN0eWxlKHRoaXNbMF0sICcnKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KSlcblxuICAgICAgdmFyIGNzcyA9ICcnXG4gICAgICBpZiAodHlwZShwcm9wZXJ0eSkgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKCF2YWx1ZSAmJiB2YWx1ZSAhPT0gMClcbiAgICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKXsgdGhpcy5zdHlsZS5yZW1vdmVQcm9wZXJ0eShkYXNoZXJpemUocHJvcGVydHkpKSB9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgY3NzID0gZGFzaGVyaXplKHByb3BlcnR5KSArIFwiOlwiICsgbWF5YmVBZGRQeChwcm9wZXJ0eSwgdmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGtleSBpbiBwcm9wZXJ0eSlcbiAgICAgICAgICBpZiAoIXByb3BlcnR5W2tleV0gJiYgcHJvcGVydHlba2V5XSAhPT0gMClcbiAgICAgICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpeyB0aGlzLnN0eWxlLnJlbW92ZVByb3BlcnR5KGRhc2hlcml6ZShrZXkpKSB9KVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNzcyArPSBkYXNoZXJpemUoa2V5KSArICc6JyArIG1heWJlQWRkUHgoa2V5LCBwcm9wZXJ0eVtrZXldKSArICc7J1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7IHRoaXMuc3R5bGUuY3NzVGV4dCArPSAnOycgKyBjc3MgfSlcbiAgICB9LFxuICAgIGluZGV4OiBmdW5jdGlvbihlbGVtZW50KXtcbiAgICAgIHJldHVybiBlbGVtZW50ID8gdGhpcy5pbmRleE9mKCQoZWxlbWVudClbMF0pIDogdGhpcy5wYXJlbnQoKS5jaGlsZHJlbigpLmluZGV4T2YodGhpc1swXSlcbiAgICB9LFxuICAgIGhhc0NsYXNzOiBmdW5jdGlvbihuYW1lKXtcbiAgICAgIHJldHVybiBlbXB0eUFycmF5LnNvbWUuY2FsbCh0aGlzLCBmdW5jdGlvbihlbCl7XG4gICAgICAgIHJldHVybiB0aGlzLnRlc3QoY2xhc3NOYW1lKGVsKSlcbiAgICAgIH0sIGNsYXNzUkUobmFtZSkpXG4gICAgfSxcbiAgICBhZGRDbGFzczogZnVuY3Rpb24obmFtZSl7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XG4gICAgICAgIGNsYXNzTGlzdCA9IFtdXG4gICAgICAgIHZhciBjbHMgPSBjbGFzc05hbWUodGhpcyksIG5ld05hbWUgPSBmdW5jQXJnKHRoaXMsIG5hbWUsIGlkeCwgY2xzKVxuICAgICAgICBuZXdOYW1lLnNwbGl0KC9cXHMrL2cpLmZvckVhY2goZnVuY3Rpb24oa2xhc3Mpe1xuICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcyhrbGFzcykpIGNsYXNzTGlzdC5wdXNoKGtsYXNzKVxuICAgICAgICB9LCB0aGlzKVxuICAgICAgICBjbGFzc0xpc3QubGVuZ3RoICYmIGNsYXNzTmFtZSh0aGlzLCBjbHMgKyAoY2xzID8gXCIgXCIgOiBcIlwiKSArIGNsYXNzTGlzdC5qb2luKFwiIFwiKSlcbiAgICAgIH0pXG4gICAgfSxcbiAgICByZW1vdmVDbGFzczogZnVuY3Rpb24obmFtZSl7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGlkeCl7XG4gICAgICAgIGlmIChuYW1lID09PSB1bmRlZmluZWQpIHJldHVybiBjbGFzc05hbWUodGhpcywgJycpXG4gICAgICAgIGNsYXNzTGlzdCA9IGNsYXNzTmFtZSh0aGlzKVxuICAgICAgICBmdW5jQXJnKHRoaXMsIG5hbWUsIGlkeCwgY2xhc3NMaXN0KS5zcGxpdCgvXFxzKy9nKS5mb3JFYWNoKGZ1bmN0aW9uKGtsYXNzKXtcbiAgICAgICAgICBjbGFzc0xpc3QgPSBjbGFzc0xpc3QucmVwbGFjZShjbGFzc1JFKGtsYXNzKSwgXCIgXCIpXG4gICAgICAgIH0pXG4gICAgICAgIGNsYXNzTmFtZSh0aGlzLCBjbGFzc0xpc3QudHJpbSgpKVxuICAgICAgfSlcbiAgICB9LFxuICAgIHRvZ2dsZUNsYXNzOiBmdW5jdGlvbihuYW1lLCB3aGVuKXtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KXtcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSwgbmFtZXMgPSBmdW5jQXJnKHRoaXMsIG5hbWUsIGlkeCwgY2xhc3NOYW1lKHRoaXMpKVxuICAgICAgICBuYW1lcy5zcGxpdCgvXFxzKy9nKS5mb3JFYWNoKGZ1bmN0aW9uKGtsYXNzKXtcbiAgICAgICAgICAod2hlbiA9PT0gdW5kZWZpbmVkID8gISR0aGlzLmhhc0NsYXNzKGtsYXNzKSA6IHdoZW4pID9cbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKGtsYXNzKSA6ICR0aGlzLnJlbW92ZUNsYXNzKGtsYXNzKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LFxuICAgIHNjcm9sbFRvcDogZnVuY3Rpb24oKXtcbiAgICAgIGlmICghdGhpcy5sZW5ndGgpIHJldHVyblxuICAgICAgcmV0dXJuICgnc2Nyb2xsVG9wJyBpbiB0aGlzWzBdKSA/IHRoaXNbMF0uc2Nyb2xsVG9wIDogdGhpc1swXS5zY3JvbGxZXG4gICAgfSxcbiAgICBwb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMubGVuZ3RoKSByZXR1cm5cblxuICAgICAgdmFyIGVsZW0gPSB0aGlzWzBdLFxuICAgICAgICAvLyBHZXQgKnJlYWwqIG9mZnNldFBhcmVudFxuICAgICAgICBvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCgpLFxuICAgICAgICAvLyBHZXQgY29ycmVjdCBvZmZzZXRzXG4gICAgICAgIG9mZnNldCAgICAgICA9IHRoaXMub2Zmc2V0KCksXG4gICAgICAgIHBhcmVudE9mZnNldCA9IHJvb3ROb2RlUkUudGVzdChvZmZzZXRQYXJlbnRbMF0ubm9kZU5hbWUpID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IG9mZnNldFBhcmVudC5vZmZzZXQoKVxuXG4gICAgICAvLyBTdWJ0cmFjdCBlbGVtZW50IG1hcmdpbnNcbiAgICAgIC8vIG5vdGU6IHdoZW4gYW4gZWxlbWVudCBoYXMgbWFyZ2luOiBhdXRvIHRoZSBvZmZzZXRMZWZ0IGFuZCBtYXJnaW5MZWZ0XG4gICAgICAvLyBhcmUgdGhlIHNhbWUgaW4gU2FmYXJpIGNhdXNpbmcgb2Zmc2V0LmxlZnQgdG8gaW5jb3JyZWN0bHkgYmUgMFxuICAgICAgb2Zmc2V0LnRvcCAgLT0gcGFyc2VGbG9hdCggJChlbGVtKS5jc3MoJ21hcmdpbi10b3AnKSApIHx8IDBcbiAgICAgIG9mZnNldC5sZWZ0IC09IHBhcnNlRmxvYXQoICQoZWxlbSkuY3NzKCdtYXJnaW4tbGVmdCcpICkgfHwgMFxuXG4gICAgICAvLyBBZGQgb2Zmc2V0UGFyZW50IGJvcmRlcnNcbiAgICAgIHBhcmVudE9mZnNldC50b3AgICs9IHBhcnNlRmxvYXQoICQob2Zmc2V0UGFyZW50WzBdKS5jc3MoJ2JvcmRlci10b3Atd2lkdGgnKSApIHx8IDBcbiAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQoICQob2Zmc2V0UGFyZW50WzBdKS5jc3MoJ2JvcmRlci1sZWZ0LXdpZHRoJykgKSB8fCAwXG5cbiAgICAgIC8vIFN1YnRyYWN0IHRoZSB0d28gb2Zmc2V0c1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG9wOiAgb2Zmc2V0LnRvcCAgLSBwYXJlbnRPZmZzZXQudG9wLFxuICAgICAgICBsZWZ0OiBvZmZzZXQubGVmdCAtIHBhcmVudE9mZnNldC5sZWZ0XG4gICAgICB9XG4gICAgfSxcbiAgICBvZmZzZXRQYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgICAgIHdoaWxlIChwYXJlbnQgJiYgIXJvb3ROb2RlUkUudGVzdChwYXJlbnQubm9kZU5hbWUpICYmICQocGFyZW50KS5jc3MoXCJwb3NpdGlvblwiKSA9PSBcInN0YXRpY1wiKVxuICAgICAgICAgIHBhcmVudCA9IHBhcmVudC5vZmZzZXRQYXJlbnRcbiAgICAgICAgcmV0dXJuIHBhcmVudFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLyBmb3Igbm93XG4gICQuZm4uZGV0YWNoID0gJC5mbi5yZW1vdmVcblxuICAvLyBHZW5lcmF0ZSB0aGUgYHdpZHRoYCBhbmQgYGhlaWdodGAgZnVuY3Rpb25zXG4gIDtbJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goZnVuY3Rpb24oZGltZW5zaW9uKXtcbiAgICAkLmZuW2RpbWVuc2lvbl0gPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICB2YXIgb2Zmc2V0LCBlbCA9IHRoaXNbMF0sXG4gICAgICAgIERpbWVuc2lvbiA9IGRpbWVuc2lvbi5yZXBsYWNlKC8uLywgZnVuY3Rpb24obSl7IHJldHVybiBtWzBdLnRvVXBwZXJDYXNlKCkgfSlcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gaXNXaW5kb3coZWwpID8gZWxbJ2lubmVyJyArIERpbWVuc2lvbl0gOlxuICAgICAgICBpc0RvY3VtZW50KGVsKSA/IGVsLmRvY3VtZW50RWxlbWVudFsnb2Zmc2V0JyArIERpbWVuc2lvbl0gOlxuICAgICAgICAob2Zmc2V0ID0gdGhpcy5vZmZzZXQoKSkgJiYgb2Zmc2V0W2RpbWVuc2lvbl1cbiAgICAgIGVsc2UgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihpZHgpe1xuICAgICAgICBlbCA9ICQodGhpcylcbiAgICAgICAgZWwuY3NzKGRpbWVuc2lvbiwgZnVuY0FyZyh0aGlzLCB2YWx1ZSwgaWR4LCBlbFtkaW1lbnNpb25dKCkpKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgZnVuY3Rpb24gdHJhdmVyc2VOb2RlKG5vZGUsIGZ1bikge1xuICAgIGZ1bihub2RlKVxuICAgIGZvciAodmFyIGtleSBpbiBub2RlLmNoaWxkTm9kZXMpIHRyYXZlcnNlTm9kZShub2RlLmNoaWxkTm9kZXNba2V5XSwgZnVuKVxuICB9XG5cbiAgLy8gR2VuZXJhdGUgdGhlIGBhZnRlcmAsIGBwcmVwZW5kYCwgYGJlZm9yZWAsIGBhcHBlbmRgLFxuICAvLyBgaW5zZXJ0QWZ0ZXJgLCBgaW5zZXJ0QmVmb3JlYCwgYGFwcGVuZFRvYCwgYW5kIGBwcmVwZW5kVG9gIG1ldGhvZHMuXG4gIGFkamFjZW5jeU9wZXJhdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKG9wZXJhdG9yLCBvcGVyYXRvckluZGV4KSB7XG4gICAgdmFyIGluc2lkZSA9IG9wZXJhdG9ySW5kZXggJSAyIC8vPT4gcHJlcGVuZCwgYXBwZW5kXG5cbiAgICAkLmZuW29wZXJhdG9yXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAvLyBhcmd1bWVudHMgY2FuIGJlIG5vZGVzLCBhcnJheXMgb2Ygbm9kZXMsIFplcHRvIG9iamVjdHMgYW5kIEhUTUwgc3RyaW5nc1xuICAgICAgdmFyIGFyZ1R5cGUsIG5vZGVzID0gJC5tYXAoYXJndW1lbnRzLCBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgICAgIGFyZ1R5cGUgPSB0eXBlKGFyZylcbiAgICAgICAgICAgIHJldHVybiBhcmdUeXBlID09IFwib2JqZWN0XCIgfHwgYXJnVHlwZSA9PSBcImFycmF5XCIgfHwgYXJnID09IG51bGwgP1xuICAgICAgICAgICAgICBhcmcgOiB6ZXB0by5mcmFnbWVudChhcmcpXG4gICAgICAgICAgfSksXG4gICAgICAgICAgcGFyZW50LCBjb3B5QnlDbG9uZSA9IHRoaXMubGVuZ3RoID4gMVxuICAgICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHJldHVybiB0aGlzXG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oXywgdGFyZ2V0KXtcbiAgICAgICAgcGFyZW50ID0gaW5zaWRlID8gdGFyZ2V0IDogdGFyZ2V0LnBhcmVudE5vZGVcblxuICAgICAgICAvLyBjb252ZXJ0IGFsbCBtZXRob2RzIHRvIGEgXCJiZWZvcmVcIiBvcGVyYXRpb25cbiAgICAgICAgdGFyZ2V0ID0gb3BlcmF0b3JJbmRleCA9PSAwID8gdGFyZ2V0Lm5leHRTaWJsaW5nIDpcbiAgICAgICAgICAgICAgICAgb3BlcmF0b3JJbmRleCA9PSAxID8gdGFyZ2V0LmZpcnN0Q2hpbGQgOlxuICAgICAgICAgICAgICAgICBvcGVyYXRvckluZGV4ID09IDIgPyB0YXJnZXQgOlxuICAgICAgICAgICAgICAgICBudWxsXG5cbiAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbihub2RlKXtcbiAgICAgICAgICBpZiAoY29weUJ5Q2xvbmUpIG5vZGUgPSBub2RlLmNsb25lTm9kZSh0cnVlKVxuICAgICAgICAgIGVsc2UgaWYgKCFwYXJlbnQpIHJldHVybiAkKG5vZGUpLnJlbW92ZSgpXG5cbiAgICAgICAgICB0cmF2ZXJzZU5vZGUocGFyZW50Lmluc2VydEJlZm9yZShub2RlLCB0YXJnZXQpLCBmdW5jdGlvbihlbCl7XG4gICAgICAgICAgICBpZiAoZWwubm9kZU5hbWUgIT0gbnVsbCAmJiBlbC5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpID09PSAnU0NSSVBUJyAmJlxuICAgICAgICAgICAgICAgKCFlbC50eXBlIHx8IGVsLnR5cGUgPT09ICd0ZXh0L2phdmFzY3JpcHQnKSAmJiAhZWwuc3JjKVxuICAgICAgICAgICAgICB3aW5kb3dbJ2V2YWwnXS5jYWxsKHdpbmRvdywgZWwuaW5uZXJIVE1MKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIGFmdGVyICAgID0+IGluc2VydEFmdGVyXG4gICAgLy8gcHJlcGVuZCAgPT4gcHJlcGVuZFRvXG4gICAgLy8gYmVmb3JlICAgPT4gaW5zZXJ0QmVmb3JlXG4gICAgLy8gYXBwZW5kICAgPT4gYXBwZW5kVG9cbiAgICAkLmZuW2luc2lkZSA/IG9wZXJhdG9yKydUbycgOiAnaW5zZXJ0Jysob3BlcmF0b3JJbmRleCA/ICdCZWZvcmUnIDogJ0FmdGVyJyldID0gZnVuY3Rpb24oaHRtbCl7XG4gICAgICAkKGh0bWwpW29wZXJhdG9yXSh0aGlzKVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH0pXG5cbiAgemVwdG8uWi5wcm90b3R5cGUgPSAkLmZuXG5cbiAgLy8gRXhwb3J0IGludGVybmFsIEFQSSBmdW5jdGlvbnMgaW4gdGhlIGAkLnplcHRvYCBuYW1lc3BhY2VcbiAgemVwdG8udW5pcSA9IHVuaXFcbiAgemVwdG8uZGVzZXJpYWxpemVWYWx1ZSA9IGRlc2VyaWFsaXplVmFsdWVcbiAgJC56ZXB0byA9IHplcHRvXG5cbiAgcmV0dXJuICRcbn0pKClcblxuLy8gd2luZG93LlplcHRvID0gWmVwdG9cbi8vICckJyBpbiB3aW5kb3cgfHwgKHdpbmRvdy4kID0gWmVwdG8pXG5tb2R1bGUuZXhwb3J0cyA9IFplcHRvXG5cbjsoZnVuY3Rpb24oJCl7XG4gIGZ1bmN0aW9uIGRldGVjdCh1YSl7XG4gICAgdmFyIG9zID0gdGhpcy5vcyA9IHt9LCBicm93c2VyID0gdGhpcy5icm93c2VyID0ge30sXG4gICAgICB3ZWJraXQgPSB1YS5tYXRjaCgvV2ViS2l0XFwvKFtcXGQuXSspLyksXG4gICAgICBhbmRyb2lkID0gdWEubWF0Y2goLyhBbmRyb2lkKVxccysoW1xcZC5dKykvKSxcbiAgICAgIGlwYWQgPSB1YS5tYXRjaCgvKGlQYWQpLipPU1xccyhbXFxkX10rKS8pLFxuICAgICAgaXBob25lID0gIWlwYWQgJiYgdWEubWF0Y2goLyhpUGhvbmVcXHNPUylcXHMoW1xcZF9dKykvKSxcbiAgICAgIHdlYm9zID0gdWEubWF0Y2goLyh3ZWJPU3xocHdPUylbXFxzXFwvXShbXFxkLl0rKS8pLFxuICAgICAgdG91Y2hwYWQgPSB3ZWJvcyAmJiB1YS5tYXRjaCgvVG91Y2hQYWQvKSxcbiAgICAgIGtpbmRsZSA9IHVhLm1hdGNoKC9LaW5kbGVcXC8oW1xcZC5dKykvKSxcbiAgICAgIHNpbGsgPSB1YS5tYXRjaCgvU2lsa1xcLyhbXFxkLl9dKykvKSxcbiAgICAgIGJsYWNrYmVycnkgPSB1YS5tYXRjaCgvKEJsYWNrQmVycnkpLipWZXJzaW9uXFwvKFtcXGQuXSspLyksXG4gICAgICBiYjEwID0gdWEubWF0Y2goLyhCQjEwKS4qVmVyc2lvblxcLyhbXFxkLl0rKS8pLFxuICAgICAgcmltdGFibGV0b3MgPSB1YS5tYXRjaCgvKFJJTVxcc1RhYmxldFxcc09TKVxccyhbXFxkLl0rKS8pLFxuICAgICAgcGxheWJvb2sgPSB1YS5tYXRjaCgvUGxheUJvb2svKSxcbiAgICAgIGNocm9tZSA9IHVhLm1hdGNoKC9DaHJvbWVcXC8oW1xcZC5dKykvKSB8fCB1YS5tYXRjaCgvQ3JpT1NcXC8oW1xcZC5dKykvKSxcbiAgICAgIGZpcmVmb3ggPSB1YS5tYXRjaCgvRmlyZWZveFxcLyhbXFxkLl0rKS8pXG5cbiAgICAvLyBUb2RvOiBjbGVhbiB0aGlzIHVwIHdpdGggYSBiZXR0ZXIgT1MvYnJvd3NlciBzZXBlcmF0aW9uOlxuICAgIC8vIC0gZGlzY2VybiAobW9yZSkgYmV0d2VlbiBtdWx0aXBsZSBicm93c2VycyBvbiBhbmRyb2lkXG4gICAgLy8gLSBkZWNpZGUgaWYga2luZGxlIGZpcmUgaW4gc2lsayBtb2RlIGlzIGFuZHJvaWQgb3Igbm90XG4gICAgLy8gLSBGaXJlZm94IG9uIEFuZHJvaWQgZG9lc24ndCBzcGVjaWZ5IHRoZSBBbmRyb2lkIHZlcnNpb25cbiAgICAvLyAtIHBvc3NpYmx5IGRldmlkZSBpbiBvcywgZGV2aWNlIGFuZCBicm93c2VyIGhhc2hlc1xuXG4gICAgaWYgKGJyb3dzZXIud2Via2l0ID0gISF3ZWJraXQpIGJyb3dzZXIudmVyc2lvbiA9IHdlYmtpdFsxXVxuXG4gICAgaWYgKGFuZHJvaWQpIG9zLmFuZHJvaWQgPSB0cnVlLCBvcy52ZXJzaW9uID0gYW5kcm9pZFsyXVxuICAgIGlmIChpcGhvbmUpIG9zLmlvcyA9IG9zLmlwaG9uZSA9IHRydWUsIG9zLnZlcnNpb24gPSBpcGhvbmVbMl0ucmVwbGFjZSgvXy9nLCAnLicpXG4gICAgaWYgKGlwYWQpIG9zLmlvcyA9IG9zLmlwYWQgPSB0cnVlLCBvcy52ZXJzaW9uID0gaXBhZFsyXS5yZXBsYWNlKC9fL2csICcuJylcbiAgICBpZiAod2Vib3MpIG9zLndlYm9zID0gdHJ1ZSwgb3MudmVyc2lvbiA9IHdlYm9zWzJdXG4gICAgaWYgKHRvdWNocGFkKSBvcy50b3VjaHBhZCA9IHRydWVcbiAgICBpZiAoYmxhY2tiZXJyeSkgb3MuYmxhY2tiZXJyeSA9IHRydWUsIG9zLnZlcnNpb24gPSBibGFja2JlcnJ5WzJdXG4gICAgaWYgKGJiMTApIG9zLmJiMTAgPSB0cnVlLCBvcy52ZXJzaW9uID0gYmIxMFsyXVxuICAgIGlmIChyaW10YWJsZXRvcykgb3MucmltdGFibGV0b3MgPSB0cnVlLCBvcy52ZXJzaW9uID0gcmltdGFibGV0b3NbMl1cbiAgICBpZiAocGxheWJvb2spIGJyb3dzZXIucGxheWJvb2sgPSB0cnVlXG4gICAgaWYgKGtpbmRsZSkgb3Mua2luZGxlID0gdHJ1ZSwgb3MudmVyc2lvbiA9IGtpbmRsZVsxXVxuICAgIGlmIChzaWxrKSBicm93c2VyLnNpbGsgPSB0cnVlLCBicm93c2VyLnZlcnNpb24gPSBzaWxrWzFdXG4gICAgaWYgKCFzaWxrICYmIG9zLmFuZHJvaWQgJiYgdWEubWF0Y2goL0tpbmRsZSBGaXJlLykpIGJyb3dzZXIuc2lsayA9IHRydWVcbiAgICBpZiAoY2hyb21lKSBicm93c2VyLmNocm9tZSA9IHRydWUsIGJyb3dzZXIudmVyc2lvbiA9IGNocm9tZVsxXVxuICAgIGlmIChmaXJlZm94KSBicm93c2VyLmZpcmVmb3ggPSB0cnVlLCBicm93c2VyLnZlcnNpb24gPSBmaXJlZm94WzFdXG5cbiAgICBvcy50YWJsZXQgPSAhIShpcGFkIHx8IHBsYXlib29rIHx8IChhbmRyb2lkICYmICF1YS5tYXRjaCgvTW9iaWxlLykpIHx8IChmaXJlZm94ICYmIHVhLm1hdGNoKC9UYWJsZXQvKSkpXG4gICAgb3MucGhvbmUgID0gISEoIW9zLnRhYmxldCAmJiAoYW5kcm9pZCB8fCBpcGhvbmUgfHwgd2Vib3MgfHwgYmxhY2tiZXJyeSB8fCBiYjEwIHx8XG4gICAgICAoY2hyb21lICYmIHVhLm1hdGNoKC9BbmRyb2lkLykpIHx8IChjaHJvbWUgJiYgdWEubWF0Y2goL0NyaU9TXFwvKFtcXGQuXSspLykpIHx8IChmaXJlZm94ICYmIHVhLm1hdGNoKC9Nb2JpbGUvKSkpKVxuICB9XG5cbiAgZGV0ZWN0LmNhbGwoJCwgbmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgLy8gbWFrZSBhdmFpbGFibGUgdG8gdW5pdCB0ZXN0c1xuICAkLl9fZGV0ZWN0ID0gZGV0ZWN0XG5cbn0pKFplcHRvKVxuXG47KGZ1bmN0aW9uKCQpe1xuICB2YXIgJCQgPSAkLnplcHRvLnFzYSwgaGFuZGxlcnMgPSB7fSwgX3ppZCA9IDEsIHNwZWNpYWxFdmVudHM9e30sXG4gICAgICBob3ZlciA9IHsgbW91c2VlbnRlcjogJ21vdXNlb3ZlcicsIG1vdXNlbGVhdmU6ICdtb3VzZW91dCcgfVxuXG4gIHNwZWNpYWxFdmVudHMuY2xpY2sgPSBzcGVjaWFsRXZlbnRzLm1vdXNlZG93biA9IHNwZWNpYWxFdmVudHMubW91c2V1cCA9IHNwZWNpYWxFdmVudHMubW91c2Vtb3ZlID0gJ01vdXNlRXZlbnRzJ1xuXG4gIGZ1bmN0aW9uIHppZChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuX3ppZCB8fCAoZWxlbWVudC5femlkID0gX3ppZCsrKVxuICB9XG4gIGZ1bmN0aW9uIGZpbmRIYW5kbGVycyhlbGVtZW50LCBldmVudCwgZm4sIHNlbGVjdG9yKSB7XG4gICAgZXZlbnQgPSBwYXJzZShldmVudClcbiAgICBpZiAoZXZlbnQubnMpIHZhciBtYXRjaGVyID0gbWF0Y2hlckZvcihldmVudC5ucylcbiAgICByZXR1cm4gKGhhbmRsZXJzW3ppZChlbGVtZW50KV0gfHwgW10pLmZpbHRlcihmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlclxuICAgICAgICAmJiAoIWV2ZW50LmUgIHx8IGhhbmRsZXIuZSA9PSBldmVudC5lKVxuICAgICAgICAmJiAoIWV2ZW50Lm5zIHx8IG1hdGNoZXIudGVzdChoYW5kbGVyLm5zKSlcbiAgICAgICAgJiYgKCFmbiAgICAgICB8fCB6aWQoaGFuZGxlci5mbikgPT09IHppZChmbikpXG4gICAgICAgICYmICghc2VsZWN0b3IgfHwgaGFuZGxlci5zZWwgPT0gc2VsZWN0b3IpXG4gICAgfSlcbiAgfVxuICBmdW5jdGlvbiBwYXJzZShldmVudCkge1xuICAgIHZhciBwYXJ0cyA9ICgnJyArIGV2ZW50KS5zcGxpdCgnLicpXG4gICAgcmV0dXJuIHtlOiBwYXJ0c1swXSwgbnM6IHBhcnRzLnNsaWNlKDEpLnNvcnQoKS5qb2luKCcgJyl9XG4gIH1cbiAgZnVuY3Rpb24gbWF0Y2hlckZvcihucykge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoPzpefCApJyArIG5zLnJlcGxhY2UoJyAnLCAnIC4qID8nKSArICcoPzogfCQpJylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVhY2hFdmVudChldmVudHMsIGZuLCBpdGVyYXRvcil7XG4gICAgaWYgKCQudHlwZShldmVudHMpICE9IFwic3RyaW5nXCIpICQuZWFjaChldmVudHMsIGl0ZXJhdG9yKVxuICAgIGVsc2UgZXZlbnRzLnNwbGl0KC9cXHMvKS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpeyBpdGVyYXRvcih0eXBlLCBmbikgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGV2ZW50Q2FwdHVyZShoYW5kbGVyLCBjYXB0dXJlU2V0dGluZykge1xuICAgIHJldHVybiBoYW5kbGVyLmRlbCAmJlxuICAgICAgKGhhbmRsZXIuZSA9PSAnZm9jdXMnIHx8IGhhbmRsZXIuZSA9PSAnYmx1cicpIHx8XG4gICAgICAhIWNhcHR1cmVTZXR0aW5nXG4gIH1cblxuICBmdW5jdGlvbiByZWFsRXZlbnQodHlwZSkge1xuICAgIHJldHVybiBob3Zlclt0eXBlXSB8fCB0eXBlXG4gIH1cblxuICBmdW5jdGlvbiBhZGQoZWxlbWVudCwgZXZlbnRzLCBmbiwgc2VsZWN0b3IsIGdldERlbGVnYXRlLCBjYXB0dXJlKXtcbiAgICB2YXIgaWQgPSB6aWQoZWxlbWVudCksIHNldCA9IChoYW5kbGVyc1tpZF0gfHwgKGhhbmRsZXJzW2lkXSA9IFtdKSlcbiAgICBlYWNoRXZlbnQoZXZlbnRzLCBmbiwgZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgICAgIHZhciBoYW5kbGVyICAgPSBwYXJzZShldmVudClcbiAgICAgIGhhbmRsZXIuZm4gICAgPSBmblxuICAgICAgaGFuZGxlci5zZWwgICA9IHNlbGVjdG9yXG4gICAgICAvLyBlbXVsYXRlIG1vdXNlZW50ZXIsIG1vdXNlbGVhdmVcbiAgICAgIGlmIChoYW5kbGVyLmUgaW4gaG92ZXIpIGZuID0gZnVuY3Rpb24oZSl7XG4gICAgICAgIHZhciByZWxhdGVkID0gZS5yZWxhdGVkVGFyZ2V0XG4gICAgICAgIGlmICghcmVsYXRlZCB8fCAocmVsYXRlZCAhPT0gdGhpcyAmJiAhJC5jb250YWlucyh0aGlzLCByZWxhdGVkKSkpXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZXIuZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgICAgaGFuZGxlci5kZWwgICA9IGdldERlbGVnYXRlICYmIGdldERlbGVnYXRlKGZuLCBldmVudClcbiAgICAgIHZhciBjYWxsYmFjayAgPSBoYW5kbGVyLmRlbCB8fCBmblxuICAgICAgaGFuZGxlci5wcm94eSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjay5hcHBseShlbGVtZW50LCBbZV0uY29uY2F0KGUuZGF0YSkpXG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSBlLnByZXZlbnREZWZhdWx0KCksIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgfVxuICAgICAgaGFuZGxlci5pID0gc2V0Lmxlbmd0aFxuICAgICAgc2V0LnB1c2goaGFuZGxlcilcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihyZWFsRXZlbnQoaGFuZGxlci5lKSwgaGFuZGxlci5wcm94eSwgZXZlbnRDYXB0dXJlKGhhbmRsZXIsIGNhcHR1cmUpKVxuICAgIH0pXG4gIH1cbiAgZnVuY3Rpb24gcmVtb3ZlKGVsZW1lbnQsIGV2ZW50cywgZm4sIHNlbGVjdG9yLCBjYXB0dXJlKXtcbiAgICB2YXIgaWQgPSB6aWQoZWxlbWVudClcbiAgICBlYWNoRXZlbnQoZXZlbnRzIHx8ICcnLCBmbiwgZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgICAgIGZpbmRIYW5kbGVycyhlbGVtZW50LCBldmVudCwgZm4sIHNlbGVjdG9yKS5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpe1xuICAgICAgICBkZWxldGUgaGFuZGxlcnNbaWRdW2hhbmRsZXIuaV1cbiAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHJlYWxFdmVudChoYW5kbGVyLmUpLCBoYW5kbGVyLnByb3h5LCBldmVudENhcHR1cmUoaGFuZGxlciwgY2FwdHVyZSkpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICAkLmV2ZW50ID0geyBhZGQ6IGFkZCwgcmVtb3ZlOiByZW1vdmUgfVxuXG4gICQucHJveHkgPSBmdW5jdGlvbihmbiwgY29udGV4dCkge1xuICAgIGlmICgkLmlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICB2YXIgcHJveHlGbiA9IGZ1bmN0aW9uKCl7IHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpIH1cbiAgICAgIHByb3h5Rm4uX3ppZCA9IHppZChmbilcbiAgICAgIHJldHVybiBwcm94eUZuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29udGV4dCA9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuICQucHJveHkoZm5bY29udGV4dF0sIGZuKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiZXhwZWN0ZWQgZnVuY3Rpb25cIilcbiAgICB9XG4gIH1cblxuICAkLmZuLmJpbmQgPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spe1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIGFkZCh0aGlzLCBldmVudCwgY2FsbGJhY2spXG4gICAgfSlcbiAgfVxuICAkLmZuLnVuYmluZCA9IGZ1bmN0aW9uKGV2ZW50LCBjYWxsYmFjayl7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgcmVtb3ZlKHRoaXMsIGV2ZW50LCBjYWxsYmFjaylcbiAgICB9KVxuICB9XG4gICQuZm4ub25lID0gZnVuY3Rpb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGksIGVsZW1lbnQpe1xuICAgICAgYWRkKHRoaXMsIGV2ZW50LCBjYWxsYmFjaywgbnVsbCwgZnVuY3Rpb24oZm4sIHR5cGUpe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcbiAgICAgICAgICB2YXIgcmVzdWx0ID0gZm4uYXBwbHkoZWxlbWVudCwgYXJndW1lbnRzKVxuICAgICAgICAgIHJlbW92ZShlbGVtZW50LCB0eXBlLCBmbilcbiAgICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHZhciByZXR1cm5UcnVlID0gZnVuY3Rpb24oKXtyZXR1cm4gdHJ1ZX0sXG4gICAgICByZXR1cm5GYWxzZSA9IGZ1bmN0aW9uKCl7cmV0dXJuIGZhbHNlfSxcbiAgICAgIGlnbm9yZVByb3BlcnRpZXMgPSAvXihbQS1aXXxsYXllcltYWV0kKS8sXG4gICAgICBldmVudE1ldGhvZHMgPSB7XG4gICAgICAgIHByZXZlbnREZWZhdWx0OiAnaXNEZWZhdWx0UHJldmVudGVkJyxcbiAgICAgICAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uOiAnaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQnLFxuICAgICAgICBzdG9wUHJvcGFnYXRpb246ICdpc1Byb3BhZ2F0aW9uU3RvcHBlZCdcbiAgICAgIH1cbiAgZnVuY3Rpb24gY3JlYXRlUHJveHkoZXZlbnQpIHtcbiAgICB2YXIga2V5LCBwcm94eSA9IHsgb3JpZ2luYWxFdmVudDogZXZlbnQgfVxuICAgIGZvciAoa2V5IGluIGV2ZW50KVxuICAgICAgaWYgKCFpZ25vcmVQcm9wZXJ0aWVzLnRlc3Qoa2V5KSAmJiBldmVudFtrZXldICE9PSB1bmRlZmluZWQpIHByb3h5W2tleV0gPSBldmVudFtrZXldXG5cbiAgICAkLmVhY2goZXZlbnRNZXRob2RzLCBmdW5jdGlvbihuYW1lLCBwcmVkaWNhdGUpIHtcbiAgICAgIHByb3h5W25hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpc1twcmVkaWNhdGVdID0gcmV0dXJuVHJ1ZVxuICAgICAgICByZXR1cm4gZXZlbnRbbmFtZV0uYXBwbHkoZXZlbnQsIGFyZ3VtZW50cylcbiAgICAgIH1cbiAgICAgIHByb3h5W3ByZWRpY2F0ZV0gPSByZXR1cm5GYWxzZVxuICAgIH0pXG4gICAgcmV0dXJuIHByb3h5XG4gIH1cblxuICAvLyBlbXVsYXRlcyB0aGUgJ2RlZmF1bHRQcmV2ZW50ZWQnIHByb3BlcnR5IGZvciBicm93c2VycyB0aGF0IGhhdmUgbm9uZVxuICBmdW5jdGlvbiBmaXgoZXZlbnQpIHtcbiAgICBpZiAoISgnZGVmYXVsdFByZXZlbnRlZCcgaW4gZXZlbnQpKSB7XG4gICAgICBldmVudC5kZWZhdWx0UHJldmVudGVkID0gZmFsc2VcbiAgICAgIHZhciBwcmV2ZW50ID0gZXZlbnQucHJldmVudERlZmF1bHRcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IHRydWVcbiAgICAgICAgcHJldmVudC5jYWxsKHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgJC5mbi5kZWxlZ2F0ZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spe1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWxlbWVudCl7XG4gICAgICBhZGQoZWxlbWVudCwgZXZlbnQsIGNhbGxiYWNrLCBzZWxlY3RvciwgZnVuY3Rpb24oZm4pe1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSl7XG4gICAgICAgICAgdmFyIGV2dCwgbWF0Y2ggPSAkKGUudGFyZ2V0KS5jbG9zZXN0KHNlbGVjdG9yLCBlbGVtZW50KS5nZXQoMClcbiAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIGV2dCA9ICQuZXh0ZW5kKGNyZWF0ZVByb3h5KGUpLCB7Y3VycmVudFRhcmdldDogbWF0Y2gsIGxpdmVGaXJlZDogZWxlbWVudH0pXG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkobWF0Y2gsIFtldnRdLmNvbmNhdChbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gICQuZm4udW5kZWxlZ2F0ZSA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spe1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIHJlbW92ZSh0aGlzLCBldmVudCwgY2FsbGJhY2ssIHNlbGVjdG9yKVxuICAgIH0pXG4gIH1cblxuICAkLmZuLmxpdmUgPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spe1xuICAgICQoZG9jdW1lbnQuYm9keSkuZGVsZWdhdGUodGhpcy5zZWxlY3RvciwgZXZlbnQsIGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgJC5mbi5kaWUgPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spe1xuICAgICQoZG9jdW1lbnQuYm9keSkudW5kZWxlZ2F0ZSh0aGlzLnNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gICQuZm4ub24gPSBmdW5jdGlvbihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKXtcbiAgICByZXR1cm4gIXNlbGVjdG9yIHx8ICQuaXNGdW5jdGlvbihzZWxlY3RvcikgP1xuICAgICAgdGhpcy5iaW5kKGV2ZW50LCBzZWxlY3RvciB8fCBjYWxsYmFjaykgOiB0aGlzLmRlbGVnYXRlKHNlbGVjdG9yLCBldmVudCwgY2FsbGJhY2spXG4gIH1cbiAgJC5mbi5vZmYgPSBmdW5jdGlvbihldmVudCwgc2VsZWN0b3IsIGNhbGxiYWNrKXtcbiAgICByZXR1cm4gIXNlbGVjdG9yIHx8ICQuaXNGdW5jdGlvbihzZWxlY3RvcikgP1xuICAgICAgdGhpcy51bmJpbmQoZXZlbnQsIHNlbGVjdG9yIHx8IGNhbGxiYWNrKSA6IHRoaXMudW5kZWxlZ2F0ZShzZWxlY3RvciwgZXZlbnQsIGNhbGxiYWNrKVxuICB9XG5cbiAgJC5mbi50cmlnZ2VyID0gZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuICAgIGlmICh0eXBlb2YgZXZlbnQgPT0gJ3N0cmluZycgfHwgJC5pc1BsYWluT2JqZWN0KGV2ZW50KSkgZXZlbnQgPSAkLkV2ZW50KGV2ZW50KVxuICAgIGZpeChldmVudClcbiAgICBldmVudC5kYXRhID0gZGF0YVxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgIC8vIGl0ZW1zIGluIHRoZSBjb2xsZWN0aW9uIG1pZ2h0IG5vdCBiZSBET00gZWxlbWVudHNcbiAgICAgIC8vICh0b2RvOiBwb3NzaWJseSBzdXBwb3J0IGV2ZW50cyBvbiBwbGFpbiBvbGQgb2JqZWN0cylcbiAgICAgIGlmKCdkaXNwYXRjaEV2ZW50JyBpbiB0aGlzKSB0aGlzLmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHRyaWdnZXJzIGV2ZW50IGhhbmRsZXJzIG9uIGN1cnJlbnQgZWxlbWVudCBqdXN0IGFzIGlmIGFuIGV2ZW50IG9jY3VycmVkLFxuICAvLyBkb2Vzbid0IHRyaWdnZXIgYW4gYWN0dWFsIGV2ZW50LCBkb2Vzbid0IGJ1YmJsZVxuICAkLmZuLnRyaWdnZXJIYW5kbGVyID0gZnVuY3Rpb24oZXZlbnQsIGRhdGEpe1xuICAgIHZhciBlLCByZXN1bHRcbiAgICB0aGlzLmVhY2goZnVuY3Rpb24oaSwgZWxlbWVudCl7XG4gICAgICBlID0gY3JlYXRlUHJveHkodHlwZW9mIGV2ZW50ID09ICdzdHJpbmcnID8gJC5FdmVudChldmVudCkgOiBldmVudClcbiAgICAgIGUuZGF0YSA9IGRhdGFcbiAgICAgIGUudGFyZ2V0ID0gZWxlbWVudFxuICAgICAgJC5lYWNoKGZpbmRIYW5kbGVycyhlbGVtZW50LCBldmVudC50eXBlIHx8IGV2ZW50KSwgZnVuY3Rpb24oaSwgaGFuZGxlcil7XG4gICAgICAgIHJlc3VsdCA9IGhhbmRsZXIucHJveHkoZSlcbiAgICAgICAgaWYgKGUuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKSkgcmV0dXJuIGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLy8gc2hvcnRjdXQgbWV0aG9kcyBmb3IgYC5iaW5kKGV2ZW50LCBmbilgIGZvciBlYWNoIGV2ZW50IHR5cGVcbiAgOygnZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrICcrXG4gICdtb3VzZWRvd24gbW91c2V1cCBtb3VzZW1vdmUgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlZW50ZXIgbW91c2VsZWF2ZSAnK1xuICAnY2hhbmdlIHNlbGVjdCBrZXlkb3duIGtleXByZXNzIGtleXVwIGVycm9yJykuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgJC5mbltldmVudF0gPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGNhbGxiYWNrID9cbiAgICAgICAgdGhpcy5iaW5kKGV2ZW50LCBjYWxsYmFjaykgOlxuICAgICAgICB0aGlzLnRyaWdnZXIoZXZlbnQpXG4gICAgfVxuICB9KVxuXG4gIDtbJ2ZvY3VzJywgJ2JsdXInXS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAkLmZuW25hbWVdID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIGlmIChjYWxsYmFjaykgdGhpcy5iaW5kKG5hbWUsIGNhbGxiYWNrKVxuICAgICAgZWxzZSB0aGlzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgdHJ5IHsgdGhpc1tuYW1lXSgpIH1cbiAgICAgICAgY2F0Y2goZSkge31cbiAgICAgIH0pXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfSlcblxuICAkLkV2ZW50ID0gZnVuY3Rpb24odHlwZSwgcHJvcHMpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgIT0gJ3N0cmluZycpIHByb3BzID0gdHlwZSwgdHlwZSA9IHByb3BzLnR5cGVcbiAgICB2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudChzcGVjaWFsRXZlbnRzW3R5cGVdIHx8ICdFdmVudHMnKSwgYnViYmxlcyA9IHRydWVcbiAgICBpZiAocHJvcHMpIGZvciAodmFyIG5hbWUgaW4gcHJvcHMpIChuYW1lID09ICdidWJibGVzJykgPyAoYnViYmxlcyA9ICEhcHJvcHNbbmFtZV0pIDogKGV2ZW50W25hbWVdID0gcHJvcHNbbmFtZV0pXG4gICAgZXZlbnQuaW5pdEV2ZW50KHR5cGUsIGJ1YmJsZXMsIHRydWUsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwpXG4gICAgZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkID0gZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXMuZGVmYXVsdFByZXZlbnRlZCB9XG4gICAgcmV0dXJuIGV2ZW50XG4gIH1cblxufSkoWmVwdG8pXG5cbjsoZnVuY3Rpb24oJCl7XG4gIHZhciBqc29ucElEID0gMCxcbiAgICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAga2V5LFxuICAgICAgbmFtZSxcbiAgICAgIHJzY3JpcHQgPSAvPHNjcmlwdFxcYltePF0qKD86KD8hPFxcL3NjcmlwdD4pPFtePF0qKSo8XFwvc2NyaXB0Pi9naSxcbiAgICAgIHNjcmlwdFR5cGVSRSA9IC9eKD86dGV4dHxhcHBsaWNhdGlvbilcXC9qYXZhc2NyaXB0L2ksXG4gICAgICB4bWxUeXBlUkUgPSAvXig/OnRleHR8YXBwbGljYXRpb24pXFwveG1sL2ksXG4gICAgICBqc29uVHlwZSA9ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGh0bWxUeXBlID0gJ3RleHQvaHRtbCcsXG4gICAgICBibGFua1JFID0gL15cXHMqJC9cblxuICAvLyB0cmlnZ2VyIGEgY3VzdG9tIGV2ZW50IGFuZCByZXR1cm4gZmFsc2UgaWYgaXQgd2FzIGNhbmNlbGxlZFxuICBmdW5jdGlvbiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnROYW1lKVxuICAgICQoY29udGV4dCkudHJpZ2dlcihldmVudCwgZGF0YSlcbiAgICByZXR1cm4gIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWRcbiAgfVxuXG4gIC8vIHRyaWdnZXIgYW4gQWpheCBcImdsb2JhbFwiIGV2ZW50XG4gIGZ1bmN0aW9uIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsIGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmIChzZXR0aW5ncy5nbG9iYWwpIHJldHVybiB0cmlnZ2VyQW5kUmV0dXJuKGNvbnRleHQgfHwgZG9jdW1lbnQsIGV2ZW50TmFtZSwgZGF0YSlcbiAgfVxuXG4gIC8vIE51bWJlciBvZiBhY3RpdmUgQWpheCByZXF1ZXN0c1xuICAkLmFjdGl2ZSA9IDBcblxuICBmdW5jdGlvbiBhamF4U3RhcnQoc2V0dGluZ3MpIHtcbiAgICBpZiAoc2V0dGluZ3MuZ2xvYmFsICYmICQuYWN0aXZlKysgPT09IDApIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIG51bGwsICdhamF4U3RhcnQnKVxuICB9XG4gIGZ1bmN0aW9uIGFqYXhTdG9wKHNldHRpbmdzKSB7XG4gICAgaWYgKHNldHRpbmdzLmdsb2JhbCAmJiAhKC0tJC5hY3RpdmUpKSB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBudWxsLCAnYWpheFN0b3AnKVxuICB9XG5cbiAgLy8gdHJpZ2dlcnMgYW4gZXh0cmEgZ2xvYmFsIGV2ZW50IFwiYWpheEJlZm9yZVNlbmRcIiB0aGF0J3MgbGlrZSBcImFqYXhTZW5kXCIgYnV0IGNhbmNlbGFibGVcbiAgZnVuY3Rpb24gYWpheEJlZm9yZVNlbmQoeGhyLCBzZXR0aW5ncykge1xuICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICAgIGlmIChzZXR0aW5ncy5iZWZvcmVTZW5kLmNhbGwoY29udGV4dCwgeGhyLCBzZXR0aW5ncykgPT09IGZhbHNlIHx8XG4gICAgICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4QmVmb3JlU2VuZCcsIFt4aHIsIHNldHRpbmdzXSkgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheFNlbmQnLCBbeGhyLCBzZXR0aW5nc10pXG4gIH1cbiAgZnVuY3Rpb24gYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBzZXR0aW5ncykge1xuICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dCwgc3RhdHVzID0gJ3N1Y2Nlc3MnXG4gICAgc2V0dGluZ3Muc3VjY2Vzcy5jYWxsKGNvbnRleHQsIGRhdGEsIHN0YXR1cywgeGhyKVxuICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4U3VjY2VzcycsIFt4aHIsIHNldHRpbmdzLCBkYXRhXSlcbiAgICBhamF4Q29tcGxldGUoc3RhdHVzLCB4aHIsIHNldHRpbmdzKVxuICB9XG4gIC8vIHR5cGU6IFwidGltZW91dFwiLCBcImVycm9yXCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG4gIGZ1bmN0aW9uIGFqYXhFcnJvcihlcnJvciwgdHlwZSwgeGhyLCBzZXR0aW5ncykge1xuICAgIHZhciBjb250ZXh0ID0gc2V0dGluZ3MuY29udGV4dFxuICAgIHNldHRpbmdzLmVycm9yLmNhbGwoY29udGV4dCwgeGhyLCB0eXBlLCBlcnJvcilcbiAgICB0cmlnZ2VyR2xvYmFsKHNldHRpbmdzLCBjb250ZXh0LCAnYWpheEVycm9yJywgW3hociwgc2V0dGluZ3MsIGVycm9yXSlcbiAgICBhamF4Q29tcGxldGUodHlwZSwgeGhyLCBzZXR0aW5ncylcbiAgfVxuICAvLyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBcIm5vdG1vZGlmaWVkXCIsIFwiZXJyb3JcIiwgXCJ0aW1lb3V0XCIsIFwiYWJvcnRcIiwgXCJwYXJzZXJlcnJvclwiXG4gIGZ1bmN0aW9uIGFqYXhDb21wbGV0ZShzdGF0dXMsIHhociwgc2V0dGluZ3MpIHtcbiAgICB2YXIgY29udGV4dCA9IHNldHRpbmdzLmNvbnRleHRcbiAgICBzZXR0aW5ncy5jb21wbGV0ZS5jYWxsKGNvbnRleHQsIHhociwgc3RhdHVzKVxuICAgIHRyaWdnZXJHbG9iYWwoc2V0dGluZ3MsIGNvbnRleHQsICdhamF4Q29tcGxldGUnLCBbeGhyLCBzZXR0aW5nc10pXG4gICAgYWpheFN0b3Aoc2V0dGluZ3MpXG4gIH1cblxuICAvLyBFbXB0eSBmdW5jdGlvbiwgdXNlZCBhcyBkZWZhdWx0IGNhbGxiYWNrXG4gIGZ1bmN0aW9uIGVtcHR5KCkge31cblxuICAkLmFqYXhKU09OUCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIGlmICghKCd0eXBlJyBpbiBvcHRpb25zKSkgcmV0dXJuICQuYWpheChvcHRpb25zKVxuXG4gICAgdmFyIGNhbGxiYWNrTmFtZSA9ICdqc29ucCcgKyAoKytqc29ucElEKSxcbiAgICAgIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpLFxuICAgICAgY2xlYW51cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoYWJvcnRUaW1lb3V0KVxuICAgICAgICAkKHNjcmlwdCkucmVtb3ZlKClcbiAgICAgICAgZGVsZXRlIHdpbmRvd1tjYWxsYmFja05hbWVdXG4gICAgICB9LFxuICAgICAgYWJvcnQgPSBmdW5jdGlvbih0eXBlKXtcbiAgICAgICAgY2xlYW51cCgpXG4gICAgICAgIC8vIEluIGNhc2Ugb2YgbWFudWFsIGFib3J0IG9yIHRpbWVvdXQsIGtlZXAgYW4gZW1wdHkgZnVuY3Rpb24gYXMgY2FsbGJhY2tcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgU0NSSVBUIHRhZyB0aGF0IGV2ZW50dWFsbHkgbG9hZHMgd29uJ3QgcmVzdWx0IGluIGFuIGVycm9yLlxuICAgICAgICBpZiAoIXR5cGUgfHwgdHlwZSA9PSAndGltZW91dCcpIHdpbmRvd1tjYWxsYmFja05hbWVdID0gZW1wdHlcbiAgICAgICAgYWpheEVycm9yKG51bGwsIHR5cGUgfHwgJ2Fib3J0JywgeGhyLCBvcHRpb25zKVxuICAgICAgfSxcbiAgICAgIHhociA9IHsgYWJvcnQ6IGFib3J0IH0sIGFib3J0VGltZW91dFxuXG4gICAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgb3B0aW9ucykgPT09IGZhbHNlKSB7XG4gICAgICBhYm9ydCgnYWJvcnQnKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgd2luZG93W2NhbGxiYWNrTmFtZV0gPSBmdW5jdGlvbihkYXRhKXtcbiAgICAgIGNsZWFudXAoKVxuICAgICAgYWpheFN1Y2Nlc3MoZGF0YSwgeGhyLCBvcHRpb25zKVxuICAgIH1cblxuICAgIHNjcmlwdC5vbmVycm9yID0gZnVuY3Rpb24oKSB7IGFib3J0KCdlcnJvcicpIH1cblxuICAgIHNjcmlwdC5zcmMgPSBvcHRpb25zLnVybC5yZXBsYWNlKC89XFw/LywgJz0nICsgY2FsbGJhY2tOYW1lKVxuICAgICQoJ2hlYWQnKS5hcHBlbmQoc2NyaXB0KVxuXG4gICAgaWYgKG9wdGlvbnMudGltZW91dCA+IDApIGFib3J0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGFib3J0KCd0aW1lb3V0JylcbiAgICB9LCBvcHRpb25zLnRpbWVvdXQpXG5cbiAgICByZXR1cm4geGhyXG4gIH1cblxuICAkLmFqYXhTZXR0aW5ncyA9IHtcbiAgICAvLyBEZWZhdWx0IHR5cGUgb2YgcmVxdWVzdFxuICAgIHR5cGU6ICdHRVQnLFxuICAgIC8vIENhbGxiYWNrIHRoYXQgaXMgZXhlY3V0ZWQgYmVmb3JlIHJlcXVlc3RcbiAgICBiZWZvcmVTZW5kOiBlbXB0eSxcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIGlmIHRoZSByZXF1ZXN0IHN1Y2NlZWRzXG4gICAgc3VjY2VzczogZW1wdHksXG4gICAgLy8gQ2FsbGJhY2sgdGhhdCBpcyBleGVjdXRlZCB0aGUgdGhlIHNlcnZlciBkcm9wcyBlcnJvclxuICAgIGVycm9yOiBlbXB0eSxcbiAgICAvLyBDYWxsYmFjayB0aGF0IGlzIGV4ZWN1dGVkIG9uIHJlcXVlc3QgY29tcGxldGUgKGJvdGg6IGVycm9yIGFuZCBzdWNjZXNzKVxuICAgIGNvbXBsZXRlOiBlbXB0eSxcbiAgICAvLyBUaGUgY29udGV4dCBmb3IgdGhlIGNhbGxiYWNrc1xuICAgIGNvbnRleHQ6IG51bGwsXG4gICAgLy8gV2hldGhlciB0byB0cmlnZ2VyIFwiZ2xvYmFsXCIgQWpheCBldmVudHNcbiAgICBnbG9iYWw6IHRydWUsXG4gICAgLy8gVHJhbnNwb3J0XG4gICAgeGhyOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpXG4gICAgfSxcbiAgICAvLyBNSU1FIHR5cGVzIG1hcHBpbmdcbiAgICBhY2NlcHRzOiB7XG4gICAgICBzY3JpcHQ6ICd0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQnLFxuICAgICAganNvbjogICBqc29uVHlwZSxcbiAgICAgIHhtbDogICAgJ2FwcGxpY2F0aW9uL3htbCwgdGV4dC94bWwnLFxuICAgICAgaHRtbDogICBodG1sVHlwZSxcbiAgICAgIHRleHQ6ICAgJ3RleHQvcGxhaW4nXG4gICAgfSxcbiAgICAvLyBXaGV0aGVyIHRoZSByZXF1ZXN0IGlzIHRvIGFub3RoZXIgZG9tYWluXG4gICAgY3Jvc3NEb21haW46IGZhbHNlLFxuICAgIC8vIERlZmF1bHQgdGltZW91dFxuICAgIHRpbWVvdXQ6IDAsXG4gICAgLy8gV2hldGhlciBkYXRhIHNob3VsZCBiZSBzZXJpYWxpemVkIHRvIHN0cmluZ1xuICAgIHByb2Nlc3NEYXRhOiB0cnVlLFxuICAgIC8vIFdoZXRoZXIgdGhlIGJyb3dzZXIgc2hvdWxkIGJlIGFsbG93ZWQgdG8gY2FjaGUgR0VUIHJlc3BvbnNlc1xuICAgIGNhY2hlOiB0cnVlLFxuICB9XG5cbiAgZnVuY3Rpb24gbWltZVRvRGF0YVR5cGUobWltZSkge1xuICAgIGlmIChtaW1lKSBtaW1lID0gbWltZS5zcGxpdCgnOycsIDIpWzBdXG4gICAgcmV0dXJuIG1pbWUgJiYgKCBtaW1lID09IGh0bWxUeXBlID8gJ2h0bWwnIDpcbiAgICAgIG1pbWUgPT0ganNvblR5cGUgPyAnanNvbicgOlxuICAgICAgc2NyaXB0VHlwZVJFLnRlc3QobWltZSkgPyAnc2NyaXB0JyA6XG4gICAgICB4bWxUeXBlUkUudGVzdChtaW1lKSAmJiAneG1sJyApIHx8ICd0ZXh0J1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwZW5kUXVlcnkodXJsLCBxdWVyeSkge1xuICAgIHJldHVybiAodXJsICsgJyYnICsgcXVlcnkpLnJlcGxhY2UoL1smP117MSwyfS8sICc/JylcbiAgfVxuXG4gIC8vIHNlcmlhbGl6ZSBwYXlsb2FkIGFuZCBhcHBlbmQgaXQgdG8gdGhlIFVSTCBmb3IgR0VUIHJlcXVlc3RzXG4gIGZ1bmN0aW9uIHNlcmlhbGl6ZURhdGEob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnByb2Nlc3NEYXRhICYmIG9wdGlvbnMuZGF0YSAmJiAkLnR5cGUob3B0aW9ucy5kYXRhKSAhPSBcInN0cmluZ1wiKVxuICAgICAgb3B0aW9ucy5kYXRhID0gJC5wYXJhbShvcHRpb25zLmRhdGEsIG9wdGlvbnMudHJhZGl0aW9uYWwpXG4gICAgaWYgKG9wdGlvbnMuZGF0YSAmJiAoIW9wdGlvbnMudHlwZSB8fCBvcHRpb25zLnR5cGUudG9VcHBlckNhc2UoKSA9PSAnR0VUJykpXG4gICAgICBvcHRpb25zLnVybCA9IGFwcGVuZFF1ZXJ5KG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEpXG4gIH1cblxuICAkLmFqYXggPSBmdW5jdGlvbihvcHRpb25zKXtcbiAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucyB8fCB7fSlcbiAgICBmb3IgKGtleSBpbiAkLmFqYXhTZXR0aW5ncykgaWYgKHNldHRpbmdzW2tleV0gPT09IHVuZGVmaW5lZCkgc2V0dGluZ3Nba2V5XSA9ICQuYWpheFNldHRpbmdzW2tleV1cblxuICAgIGFqYXhTdGFydChzZXR0aW5ncylcblxuICAgIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIHNldHRpbmdzLmNyb3NzRG9tYWluID0gL14oW1xcdy1dKzopP1xcL1xcLyhbXlxcL10rKS8udGVzdChzZXR0aW5ncy51cmwpICYmXG4gICAgICBSZWdFeHAuJDIgIT0gd2luZG93LmxvY2F0aW9uLmhvc3RcblxuICAgIGlmICghc2V0dGluZ3MudXJsKSBzZXR0aW5ncy51cmwgPSB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKVxuICAgIHNlcmlhbGl6ZURhdGEoc2V0dGluZ3MpXG4gICAgaWYgKHNldHRpbmdzLmNhY2hlID09PSBmYWxzZSkgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnXz0nICsgRGF0ZS5ub3coKSlcblxuICAgIHZhciBkYXRhVHlwZSA9IHNldHRpbmdzLmRhdGFUeXBlLCBoYXNQbGFjZWhvbGRlciA9IC89XFw/Ly50ZXN0KHNldHRpbmdzLnVybClcbiAgICBpZiAoZGF0YVR5cGUgPT0gJ2pzb25wJyB8fCBoYXNQbGFjZWhvbGRlcikge1xuICAgICAgaWYgKCFoYXNQbGFjZWhvbGRlcikgc2V0dGluZ3MudXJsID0gYXBwZW5kUXVlcnkoc2V0dGluZ3MudXJsLCAnY2FsbGJhY2s9PycpXG4gICAgICByZXR1cm4gJC5hamF4SlNPTlAoc2V0dGluZ3MpXG4gICAgfVxuXG4gICAgdmFyIG1pbWUgPSBzZXR0aW5ncy5hY2NlcHRzW2RhdGFUeXBlXSxcbiAgICAgICAgYmFzZUhlYWRlcnMgPSB7IH0sXG4gICAgICAgIHByb3RvY29sID0gL14oW1xcdy1dKzopXFwvXFwvLy50ZXN0KHNldHRpbmdzLnVybCkgPyBSZWdFeHAuJDEgOiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wsXG4gICAgICAgIHhociA9IHNldHRpbmdzLnhocigpLCBhYm9ydFRpbWVvdXRcblxuICAgIGlmICghc2V0dGluZ3MuY3Jvc3NEb21haW4pIGJhc2VIZWFkZXJzWydYLVJlcXVlc3RlZC1XaXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnXG4gICAgaWYgKG1pbWUpIHtcbiAgICAgIGJhc2VIZWFkZXJzWydBY2NlcHQnXSA9IG1pbWVcbiAgICAgIGlmIChtaW1lLmluZGV4T2YoJywnKSA+IC0xKSBtaW1lID0gbWltZS5zcGxpdCgnLCcsIDIpWzBdXG4gICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSAmJiB4aHIub3ZlcnJpZGVNaW1lVHlwZShtaW1lKVxuICAgIH1cbiAgICBpZiAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgKHNldHRpbmdzLmNvbnRlbnRUeXBlICE9PSBmYWxzZSAmJiBzZXR0aW5ncy5kYXRhICYmIHNldHRpbmdzLnR5cGUudG9VcHBlckNhc2UoKSAhPSAnR0VUJykpXG4gICAgICBiYXNlSGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAoc2V0dGluZ3MuY29udGVudFR5cGUgfHwgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpXG4gICAgc2V0dGluZ3MuaGVhZGVycyA9ICQuZXh0ZW5kKGJhc2VIZWFkZXJzLCBzZXR0aW5ncy5oZWFkZXJzIHx8IHt9KVxuXG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHk7XG4gICAgICAgIGNsZWFyVGltZW91dChhYm9ydFRpbWVvdXQpXG4gICAgICAgIHZhciByZXN1bHQsIGVycm9yID0gZmFsc2VcbiAgICAgICAgaWYgKCh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB8fCB4aHIuc3RhdHVzID09IDMwNCB8fCAoeGhyLnN0YXR1cyA9PSAwICYmIHByb3RvY29sID09ICdmaWxlOicpKSB7XG4gICAgICAgICAgZGF0YVR5cGUgPSBkYXRhVHlwZSB8fCBtaW1lVG9EYXRhVHlwZSh4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ2NvbnRlbnQtdHlwZScpKVxuICAgICAgICAgIHJlc3VsdCA9IHhoci5yZXNwb25zZVRleHRcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9nbG9iYWwtZXZhbC13aGF0LWFyZS10aGUtb3B0aW9ucy9cbiAgICAgICAgICAgIGlmIChkYXRhVHlwZSA9PSAnc2NyaXB0JykgICAgKDEsZXZhbCkocmVzdWx0KVxuICAgICAgICAgICAgZWxzZSBpZiAoZGF0YVR5cGUgPT0gJ3htbCcpICByZXN1bHQgPSB4aHIucmVzcG9uc2VYTUxcbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGFUeXBlID09ICdqc29uJykgcmVzdWx0ID0gYmxhbmtSRS50ZXN0KHJlc3VsdCkgPyBudWxsIDogJC5wYXJzZUpTT04ocmVzdWx0KVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgZXJyb3IgPSBlIH1cblxuICAgICAgICAgIGlmIChlcnJvcikgYWpheEVycm9yKGVycm9yLCAncGFyc2VyZXJyb3InLCB4aHIsIHNldHRpbmdzKVxuICAgICAgICAgIGVsc2UgYWpheFN1Y2Nlc3MocmVzdWx0LCB4aHIsIHNldHRpbmdzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFqYXhFcnJvcihudWxsLCB4aHIuc3RhdHVzID8gJ2Vycm9yJyA6ICdhYm9ydCcsIHhociwgc2V0dGluZ3MpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYXN5bmMgPSAnYXN5bmMnIGluIHNldHRpbmdzID8gc2V0dGluZ3MuYXN5bmMgOiB0cnVlXG4gICAgeGhyLm9wZW4oc2V0dGluZ3MudHlwZSwgc2V0dGluZ3MudXJsLCBhc3luYylcblxuICAgIGZvciAobmFtZSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCBzZXR0aW5ncy5oZWFkZXJzW25hbWVdKVxuXG4gICAgaWYgKGFqYXhCZWZvcmVTZW5kKHhociwgc2V0dGluZ3MpID09PSBmYWxzZSkge1xuICAgICAgeGhyLmFib3J0KClcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGlmIChzZXR0aW5ncy50aW1lb3V0ID4gMCkgYWJvcnRUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZW1wdHlcbiAgICAgICAgeGhyLmFib3J0KClcbiAgICAgICAgYWpheEVycm9yKG51bGwsICd0aW1lb3V0JywgeGhyLCBzZXR0aW5ncylcbiAgICAgIH0sIHNldHRpbmdzLnRpbWVvdXQpXG5cbiAgICAvLyBhdm9pZCBzZW5kaW5nIGVtcHR5IHN0cmluZyAoIzMxOSlcbiAgICB4aHIuc2VuZChzZXR0aW5ncy5kYXRhID8gc2V0dGluZ3MuZGF0YSA6IG51bGwpXG4gICAgcmV0dXJuIHhoclxuICB9XG5cbiAgLy8gaGFuZGxlIG9wdGlvbmFsIGRhdGEvc3VjY2VzcyBhcmd1bWVudHNcbiAgZnVuY3Rpb24gcGFyc2VBcmd1bWVudHModXJsLCBkYXRhLCBzdWNjZXNzLCBkYXRhVHlwZSkge1xuICAgIHZhciBoYXNEYXRhID0gISQuaXNGdW5jdGlvbihkYXRhKVxuICAgIHJldHVybiB7XG4gICAgICB1cmw6ICAgICAgdXJsLFxuICAgICAgZGF0YTogICAgIGhhc0RhdGEgID8gZGF0YSA6IHVuZGVmaW5lZCxcbiAgICAgIHN1Y2Nlc3M6ICAhaGFzRGF0YSA/IGRhdGEgOiAkLmlzRnVuY3Rpb24oc3VjY2VzcykgPyBzdWNjZXNzIDogdW5kZWZpbmVkLFxuICAgICAgZGF0YVR5cGU6IGhhc0RhdGEgID8gZGF0YVR5cGUgfHwgc3VjY2VzcyA6IHN1Y2Nlc3NcbiAgICB9XG4gIH1cblxuICAkLmdldCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpe1xuICAgIHJldHVybiAkLmFqYXgocGFyc2VBcmd1bWVudHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKSlcbiAgfVxuXG4gICQucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2VzcywgZGF0YVR5cGUpe1xuICAgIHZhciBvcHRpb25zID0gcGFyc2VBcmd1bWVudHMuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgIG9wdGlvbnMudHlwZSA9ICdQT1NUJ1xuICAgIHJldHVybiAkLmFqYXgob3B0aW9ucylcbiAgfVxuXG4gICQuZ2V0SlNPTiA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2Vzcyl7XG4gICAgdmFyIG9wdGlvbnMgPSBwYXJzZUFyZ3VtZW50cy5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgb3B0aW9ucy5kYXRhVHlwZSA9ICdqc29uJ1xuICAgIHJldHVybiAkLmFqYXgob3B0aW9ucylcbiAgfVxuXG4gICQuZm4ubG9hZCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgc3VjY2Vzcyl7XG4gICAgaWYgKCF0aGlzLmxlbmd0aCkgcmV0dXJuIHRoaXNcbiAgICB2YXIgc2VsZiA9IHRoaXMsIHBhcnRzID0gdXJsLnNwbGl0KC9cXHMvKSwgc2VsZWN0b3IsXG4gICAgICAgIG9wdGlvbnMgPSBwYXJzZUFyZ3VtZW50cyh1cmwsIGRhdGEsIHN1Y2Nlc3MpLFxuICAgICAgICBjYWxsYmFjayA9IG9wdGlvbnMuc3VjY2Vzc1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSBvcHRpb25zLnVybCA9IHBhcnRzWzBdLCBzZWxlY3RvciA9IHBhcnRzWzFdXG4gICAgb3B0aW9ucy5zdWNjZXNzID0gZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgc2VsZi5odG1sKHNlbGVjdG9yID9cbiAgICAgICAgJCgnPGRpdj4nKS5odG1sKHJlc3BvbnNlLnJlcGxhY2UocnNjcmlwdCwgXCJcIikpLmZpbmQoc2VsZWN0b3IpXG4gICAgICAgIDogcmVzcG9uc2UpXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5hcHBseShzZWxmLCBhcmd1bWVudHMpXG4gICAgfVxuICAgICQuYWpheChvcHRpb25zKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB2YXIgZXNjYXBlID0gZW5jb2RlVVJJQ29tcG9uZW50XG5cbiAgZnVuY3Rpb24gc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbCwgc2NvcGUpe1xuICAgIHZhciB0eXBlLCBhcnJheSA9ICQuaXNBcnJheShvYmopXG4gICAgJC5lYWNoKG9iaiwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgdHlwZSA9ICQudHlwZSh2YWx1ZSlcbiAgICAgIGlmIChzY29wZSkga2V5ID0gdHJhZGl0aW9uYWwgPyBzY29wZSA6IHNjb3BlICsgJ1snICsgKGFycmF5ID8gJycgOiBrZXkpICsgJ10nXG4gICAgICAvLyBoYW5kbGUgZGF0YSBpbiBzZXJpYWxpemVBcnJheSgpIGZvcm1hdFxuICAgICAgaWYgKCFzY29wZSAmJiBhcnJheSkgcGFyYW1zLmFkZCh2YWx1ZS5uYW1lLCB2YWx1ZS52YWx1ZSlcbiAgICAgIC8vIHJlY3Vyc2UgaW50byBuZXN0ZWQgb2JqZWN0c1xuICAgICAgZWxzZSBpZiAodHlwZSA9PSBcImFycmF5XCIgfHwgKCF0cmFkaXRpb25hbCAmJiB0eXBlID09IFwib2JqZWN0XCIpKVxuICAgICAgICBzZXJpYWxpemUocGFyYW1zLCB2YWx1ZSwgdHJhZGl0aW9uYWwsIGtleSlcbiAgICAgIGVsc2UgcGFyYW1zLmFkZChrZXksIHZhbHVlKVxuICAgIH0pXG4gIH1cblxuICAkLnBhcmFtID0gZnVuY3Rpb24ob2JqLCB0cmFkaXRpb25hbCl7XG4gICAgdmFyIHBhcmFtcyA9IFtdXG4gICAgcGFyYW1zLmFkZCA9IGZ1bmN0aW9uKGssIHYpeyB0aGlzLnB1c2goZXNjYXBlKGspICsgJz0nICsgZXNjYXBlKHYpKSB9XG4gICAgc2VyaWFsaXplKHBhcmFtcywgb2JqLCB0cmFkaXRpb25hbClcbiAgICByZXR1cm4gcGFyYW1zLmpvaW4oJyYnKS5yZXBsYWNlKC8lMjAvZywgJysnKVxuICB9XG59KShaZXB0bylcblxuOyhmdW5jdGlvbiAoJCkge1xuICAkLmZuLnNlcmlhbGl6ZUFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXSwgZWxcbiAgICAkKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLmdldCgwKS5lbGVtZW50cykgKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsID0gJCh0aGlzKVxuICAgICAgdmFyIHR5cGUgPSBlbC5hdHRyKCd0eXBlJylcbiAgICAgIGlmICh0aGlzLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT0gJ2ZpZWxkc2V0JyAmJlxuICAgICAgICAhdGhpcy5kaXNhYmxlZCAmJiB0eXBlICE9ICdzdWJtaXQnICYmIHR5cGUgIT0gJ3Jlc2V0JyAmJiB0eXBlICE9ICdidXR0b24nICYmXG4gICAgICAgICgodHlwZSAhPSAncmFkaW8nICYmIHR5cGUgIT0gJ2NoZWNrYm94JykgfHwgdGhpcy5jaGVja2VkKSlcbiAgICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICAgIG5hbWU6IGVsLmF0dHIoJ25hbWUnKSxcbiAgICAgICAgICB2YWx1ZTogZWwudmFsKClcbiAgICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gICQuZm4uc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXVxuICAgIHRoaXMuc2VyaWFsaXplQXJyYXkoKS5mb3JFYWNoKGZ1bmN0aW9uIChlbG0pIHtcbiAgICAgIHJlc3VsdC5wdXNoKCBlbmNvZGVVUklDb21wb25lbnQoZWxtLm5hbWUpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGVsbS52YWx1ZSkgKVxuICAgIH0pXG4gICAgcmV0dXJuIHJlc3VsdC5qb2luKCcmJylcbiAgfVxuXG4gICQuZm4uc3VibWl0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgaWYgKGNhbGxiYWNrKSB0aGlzLmJpbmQoJ3N1Ym1pdCcsIGNhbGxiYWNrKVxuICAgIGVsc2UgaWYgKHRoaXMubGVuZ3RoKSB7XG4gICAgICB2YXIgZXZlbnQgPSAkLkV2ZW50KCdzdWJtaXQnKVxuICAgICAgdGhpcy5lcSgwKS50cmlnZ2VyKGV2ZW50KVxuICAgICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB0aGlzLmdldCgwKS5zdWJtaXQoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbn0pKFplcHRvKVxuXG47KGZ1bmN0aW9uKCQsIHVuZGVmaW5lZCl7XG4gIHZhciBwcmVmaXggPSAnJywgZXZlbnRQcmVmaXgsIGVuZEV2ZW50TmFtZSwgZW5kQW5pbWF0aW9uTmFtZSxcbiAgICB2ZW5kb3JzID0geyBXZWJraXQ6ICd3ZWJraXQnLCBNb3o6ICcnLCBPOiAnbycsIG1zOiAnTVMnIH0sXG4gICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgIHN1cHBvcnRlZFRyYW5zZm9ybXMgPSAvXigodHJhbnNsYXRlfHJvdGF0ZXxzY2FsZSkoWHxZfFp8M2QpP3xtYXRyaXgoM2QpP3xwZXJzcGVjdGl2ZXxza2V3KFh8WSk/KSQvaSxcbiAgICB0cmFuc2Zvcm0sXG4gICAgdHJhbnNpdGlvblByb3BlcnR5LCB0cmFuc2l0aW9uRHVyYXRpb24sIHRyYW5zaXRpb25UaW1pbmcsXG4gICAgYW5pbWF0aW9uTmFtZSwgYW5pbWF0aW9uRHVyYXRpb24sIGFuaW1hdGlvblRpbWluZyxcbiAgICBjc3NSZXNldCA9IHt9XG5cbiAgZnVuY3Rpb24gZGFzaGVyaXplKHN0cikgeyByZXR1cm4gZG93bmNhc2Uoc3RyLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pLywgJyQxLSQyJykpIH1cbiAgZnVuY3Rpb24gZG93bmNhc2Uoc3RyKSB7IHJldHVybiBzdHIudG9Mb3dlckNhc2UoKSB9XG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZUV2ZW50KG5hbWUpIHsgcmV0dXJuIGV2ZW50UHJlZml4ID8gZXZlbnRQcmVmaXggKyBuYW1lIDogZG93bmNhc2UobmFtZSkgfVxuXG4gICQuZWFjaCh2ZW5kb3JzLCBmdW5jdGlvbih2ZW5kb3IsIGV2ZW50KXtcbiAgICBpZiAodGVzdEVsLnN0eWxlW3ZlbmRvciArICdUcmFuc2l0aW9uUHJvcGVydHknXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBwcmVmaXggPSAnLScgKyBkb3duY2FzZSh2ZW5kb3IpICsgJy0nXG4gICAgICBldmVudFByZWZpeCA9IGV2ZW50XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgdHJhbnNmb3JtID0gcHJlZml4ICsgJ3RyYW5zZm9ybSdcbiAgY3NzUmVzZXRbdHJhbnNpdGlvblByb3BlcnR5ID0gcHJlZml4ICsgJ3RyYW5zaXRpb24tcHJvcGVydHknXSA9XG4gIGNzc1Jlc2V0W3RyYW5zaXRpb25EdXJhdGlvbiA9IHByZWZpeCArICd0cmFuc2l0aW9uLWR1cmF0aW9uJ10gPVxuICBjc3NSZXNldFt0cmFuc2l0aW9uVGltaW5nICAgPSBwcmVmaXggKyAndHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb24nXSA9XG4gIGNzc1Jlc2V0W2FuaW1hdGlvbk5hbWUgICAgICA9IHByZWZpeCArICdhbmltYXRpb24tbmFtZSddID1cbiAgY3NzUmVzZXRbYW5pbWF0aW9uRHVyYXRpb24gID0gcHJlZml4ICsgJ2FuaW1hdGlvbi1kdXJhdGlvbiddID1cbiAgY3NzUmVzZXRbYW5pbWF0aW9uVGltaW5nICAgID0gcHJlZml4ICsgJ2FuaW1hdGlvbi10aW1pbmctZnVuY3Rpb24nXSA9ICcnXG5cbiAgJC5meCA9IHtcbiAgICBvZmY6IChldmVudFByZWZpeCA9PT0gdW5kZWZpbmVkICYmIHRlc3RFbC5zdHlsZS50cmFuc2l0aW9uUHJvcGVydHkgPT09IHVuZGVmaW5lZCksXG4gICAgc3BlZWRzOiB7IF9kZWZhdWx0OiA0MDAsIGZhc3Q6IDIwMCwgc2xvdzogNjAwIH0sXG4gICAgY3NzUHJlZml4OiBwcmVmaXgsXG4gICAgdHJhbnNpdGlvbkVuZDogbm9ybWFsaXplRXZlbnQoJ1RyYW5zaXRpb25FbmQnKSxcbiAgICBhbmltYXRpb25FbmQ6IG5vcm1hbGl6ZUV2ZW50KCdBbmltYXRpb25FbmQnKVxuICB9XG5cbiAgJC5mbi5hbmltYXRlID0gZnVuY3Rpb24ocHJvcGVydGllcywgZHVyYXRpb24sIGVhc2UsIGNhbGxiYWNrKXtcbiAgICBpZiAoJC5pc1BsYWluT2JqZWN0KGR1cmF0aW9uKSlcbiAgICAgIGVhc2UgPSBkdXJhdGlvbi5lYXNpbmcsIGNhbGxiYWNrID0gZHVyYXRpb24uY29tcGxldGUsIGR1cmF0aW9uID0gZHVyYXRpb24uZHVyYXRpb25cbiAgICBpZiAoZHVyYXRpb24pIGR1cmF0aW9uID0gKHR5cGVvZiBkdXJhdGlvbiA9PSAnbnVtYmVyJyA/IGR1cmF0aW9uIDpcbiAgICAgICAgICAgICAgICAgICAgKCQuZnguc3BlZWRzW2R1cmF0aW9uXSB8fCAkLmZ4LnNwZWVkcy5fZGVmYXVsdCkpIC8gMTAwMFxuICAgIHJldHVybiB0aGlzLmFuaW0ocHJvcGVydGllcywgZHVyYXRpb24sIGVhc2UsIGNhbGxiYWNrKVxuICB9XG5cbiAgJC5mbi5hbmltID0gZnVuY3Rpb24ocHJvcGVydGllcywgZHVyYXRpb24sIGVhc2UsIGNhbGxiYWNrKXtcbiAgICB2YXIga2V5LCBjc3NWYWx1ZXMgPSB7fSwgY3NzUHJvcGVydGllcywgdHJhbnNmb3JtcyA9ICcnLFxuICAgICAgICB0aGF0ID0gdGhpcywgd3JhcHBlZENhbGxiYWNrLCBlbmRFdmVudCA9ICQuZngudHJhbnNpdGlvbkVuZFxuXG4gICAgaWYgKGR1cmF0aW9uID09PSB1bmRlZmluZWQpIGR1cmF0aW9uID0gMC40XG4gICAgaWYgKCQuZngub2ZmKSBkdXJhdGlvbiA9IDBcblxuICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PSAnc3RyaW5nJykge1xuICAgICAgLy8ga2V5ZnJhbWUgYW5pbWF0aW9uXG4gICAgICBjc3NWYWx1ZXNbYW5pbWF0aW9uTmFtZV0gPSBwcm9wZXJ0aWVzXG4gICAgICBjc3NWYWx1ZXNbYW5pbWF0aW9uRHVyYXRpb25dID0gZHVyYXRpb24gKyAncydcbiAgICAgIGNzc1ZhbHVlc1thbmltYXRpb25UaW1pbmddID0gKGVhc2UgfHwgJ2xpbmVhcicpXG4gICAgICBlbmRFdmVudCA9ICQuZnguYW5pbWF0aW9uRW5kXG4gICAgfSBlbHNlIHtcbiAgICAgIGNzc1Byb3BlcnRpZXMgPSBbXVxuICAgICAgLy8gQ1NTIHRyYW5zaXRpb25zXG4gICAgICBmb3IgKGtleSBpbiBwcm9wZXJ0aWVzKVxuICAgICAgICBpZiAoc3VwcG9ydGVkVHJhbnNmb3Jtcy50ZXN0KGtleSkpIHRyYW5zZm9ybXMgKz0ga2V5ICsgJygnICsgcHJvcGVydGllc1trZXldICsgJykgJ1xuICAgICAgICBlbHNlIGNzc1ZhbHVlc1trZXldID0gcHJvcGVydGllc1trZXldLCBjc3NQcm9wZXJ0aWVzLnB1c2goZGFzaGVyaXplKGtleSkpXG5cbiAgICAgIGlmICh0cmFuc2Zvcm1zKSBjc3NWYWx1ZXNbdHJhbnNmb3JtXSA9IHRyYW5zZm9ybXMsIGNzc1Byb3BlcnRpZXMucHVzaCh0cmFuc2Zvcm0pXG4gICAgICBpZiAoZHVyYXRpb24gPiAwICYmIHR5cGVvZiBwcm9wZXJ0aWVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjc3NWYWx1ZXNbdHJhbnNpdGlvblByb3BlcnR5XSA9IGNzc1Byb3BlcnRpZXMuam9pbignLCAnKVxuICAgICAgICBjc3NWYWx1ZXNbdHJhbnNpdGlvbkR1cmF0aW9uXSA9IGR1cmF0aW9uICsgJ3MnXG4gICAgICAgIGNzc1ZhbHVlc1t0cmFuc2l0aW9uVGltaW5nXSA9IChlYXNlIHx8ICdsaW5lYXInKVxuICAgICAgfVxuICAgIH1cblxuICAgIHdyYXBwZWRDYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgIGlmICh0eXBlb2YgZXZlbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQgIT09IGV2ZW50LmN1cnJlbnRUYXJnZXQpIHJldHVybiAvLyBtYWtlcyBzdXJlIHRoZSBldmVudCBkaWRuJ3QgYnViYmxlIGZyb20gXCJiZWxvd1wiXG4gICAgICAgICQoZXZlbnQudGFyZ2V0KS51bmJpbmQoZW5kRXZlbnQsIHdyYXBwZWRDYWxsYmFjaylcbiAgICAgIH1cbiAgICAgICQodGhpcykuY3NzKGNzc1Jlc2V0KVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2suY2FsbCh0aGlzKVxuICAgIH1cbiAgICBpZiAoZHVyYXRpb24gPiAwKSB0aGlzLmJpbmQoZW5kRXZlbnQsIHdyYXBwZWRDYWxsYmFjaylcblxuICAgIC8vIHRyaWdnZXIgcGFnZSByZWZsb3cgc28gbmV3IGVsZW1lbnRzIGNhbiBhbmltYXRlXG4gICAgdGhpcy5zaXplKCkgJiYgdGhpcy5nZXQoMCkuY2xpZW50TGVmdFxuXG4gICAgdGhpcy5jc3MoY3NzVmFsdWVzKVxuXG4gICAgaWYgKGR1cmF0aW9uIDw9IDApIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGF0LmVhY2goZnVuY3Rpb24oKXsgd3JhcHBlZENhbGxiYWNrLmNhbGwodGhpcykgfSlcbiAgICB9LCAwKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHRlc3RFbCA9IG51bGxcbn0pKFplcHRvKVxuIiwidXJscyAgID0gcmVxdWlyZSAnLi91cmxzLmNvZmZlZSdcbnJvdXRlciA9IHJlcXVpcmUgJy4vcm91dGVyL3JvdXRlci5jb2ZmZWUnXG5cbihyZXF1aXJlICcuL3VpL3VpLmNvZmZlZScpLmluaXQoKVxuXG5yb3V0ZXIucm91dGUgdXJsc1xuIiwiLypcblxuQ29weXJpZ2h0IChDKSAyMDExIGJ5IFllaHVkYSBLYXR6XG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cblxuKi9cblxuLy8gbGliL2hhbmRsZWJhcnMvYnJvd3Nlci1wcmVmaXguanNcbnZhciBIYW5kbGViYXJzID0ge307XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnM7XG5cbihmdW5jdGlvbihIYW5kbGViYXJzLCB1bmRlZmluZWQpIHtcbjtcbi8vIGxpYi9oYW5kbGViYXJzL2Jhc2UuanNcblxuSGFuZGxlYmFycy5WRVJTSU9OID0gXCIxLjAuMFwiO1xuSGFuZGxlYmFycy5DT01QSUxFUl9SRVZJU0lPTiA9IDQ7XG5cbkhhbmRsZWJhcnMuUkVWSVNJT05fQ0hBTkdFUyA9IHtcbiAgMTogJzw9IDEuMC5yYy4yJywgLy8gMS4wLnJjLjIgaXMgYWN0dWFsbHkgcmV2MiBidXQgZG9lc24ndCByZXBvcnQgaXRcbiAgMjogJz09IDEuMC4wLXJjLjMnLFxuICAzOiAnPT0gMS4wLjAtcmMuNCcsXG4gIDQ6ICc+PSAxLjAuMCdcbn07XG5cbkhhbmRsZWJhcnMuaGVscGVycyAgPSB7fTtcbkhhbmRsZWJhcnMucGFydGlhbHMgPSB7fTtcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBmdW5jdGlvblR5cGUgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG9iamVjdFR5cGUgPSAnW29iamVjdCBPYmplY3RdJztcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlciA9IGZ1bmN0aW9uKG5hbWUsIGZuLCBpbnZlcnNlKSB7XG4gIGlmICh0b1N0cmluZy5jYWxsKG5hbWUpID09PSBvYmplY3RUeXBlKSB7XG4gICAgaWYgKGludmVyc2UgfHwgZm4pIHsgdGhyb3cgbmV3IEhhbmRsZWJhcnMuRXhjZXB0aW9uKCdBcmcgbm90IHN1cHBvcnRlZCB3aXRoIG11bHRpcGxlIGhlbHBlcnMnKTsgfVxuICAgIEhhbmRsZWJhcnMuVXRpbHMuZXh0ZW5kKHRoaXMuaGVscGVycywgbmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGludmVyc2UpIHsgZm4ubm90ID0gaW52ZXJzZTsgfVxuICAgIHRoaXMuaGVscGVyc1tuYW1lXSA9IGZuO1xuICB9XG59O1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVyUGFydGlhbCA9IGZ1bmN0aW9uKG5hbWUsIHN0cikge1xuICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgIEhhbmRsZWJhcnMuVXRpbHMuZXh0ZW5kKHRoaXMucGFydGlhbHMsICBuYW1lKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnBhcnRpYWxzW25hbWVdID0gc3RyO1xuICB9XG59O1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdoZWxwZXJNaXNzaW5nJywgZnVuY3Rpb24oYXJnKSB7XG4gIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgaGVscGVyOiAnXCIgKyBhcmcgKyBcIidcIik7XG4gIH1cbn0pO1xuXG5IYW5kbGViYXJzLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gIHZhciBpbnZlcnNlID0gb3B0aW9ucy5pbnZlcnNlIHx8IGZ1bmN0aW9uKCkge30sIGZuID0gb3B0aW9ucy5mbjtcblxuICB2YXIgdHlwZSA9IHRvU3RyaW5nLmNhbGwoY29udGV4dCk7XG5cbiAgaWYodHlwZSA9PT0gZnVuY3Rpb25UeXBlKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICBpZihjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuKHRoaXMpO1xuICB9IGVsc2UgaWYoY29udGV4dCA9PT0gZmFsc2UgfHwgY29udGV4dCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gIH0gZWxzZSBpZih0eXBlID09PSBcIltvYmplY3QgQXJyYXldXCIpIHtcbiAgICBpZihjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBIYW5kbGViYXJzLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGludmVyc2UodGhpcyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmbihjb250ZXh0KTtcbiAgfVxufSk7XG5cbkhhbmRsZWJhcnMuSyA9IGZ1bmN0aW9uKCkge307XG5cbkhhbmRsZWJhcnMuY3JlYXRlRnJhbWUgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uKG9iamVjdCkge1xuICBIYW5kbGViYXJzLksucHJvdG90eXBlID0gb2JqZWN0O1xuICB2YXIgb2JqID0gbmV3IEhhbmRsZWJhcnMuSygpO1xuICBIYW5kbGViYXJzLksucHJvdG90eXBlID0gbnVsbDtcbiAgcmV0dXJuIG9iajtcbn07XG5cbkhhbmRsZWJhcnMubG9nZ2VyID0ge1xuICBERUJVRzogMCwgSU5GTzogMSwgV0FSTjogMiwgRVJST1I6IDMsIGxldmVsOiAzLFxuXG4gIG1ldGhvZE1hcDogezA6ICdkZWJ1ZycsIDE6ICdpbmZvJywgMjogJ3dhcm4nLCAzOiAnZXJyb3InfSxcblxuICAvLyBjYW4gYmUgb3ZlcnJpZGRlbiBpbiB0aGUgaG9zdCBlbnZpcm9ubWVudFxuICBsb2c6IGZ1bmN0aW9uKGxldmVsLCBvYmopIHtcbiAgICBpZiAoSGFuZGxlYmFycy5sb2dnZXIubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgIHZhciBtZXRob2QgPSBIYW5kbGViYXJzLmxvZ2dlci5tZXRob2RNYXBbbGV2ZWxdO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlW21ldGhvZF0pIHtcbiAgICAgICAgY29uc29sZVttZXRob2RdLmNhbGwoY29uc29sZSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbkhhbmRsZWJhcnMubG9nID0gZnVuY3Rpb24obGV2ZWwsIG9iaikgeyBIYW5kbGViYXJzLmxvZ2dlci5sb2cobGV2ZWwsIG9iaik7IH07XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2VhY2gnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gIHZhciBmbiA9IG9wdGlvbnMuZm4sIGludmVyc2UgPSBvcHRpb25zLmludmVyc2U7XG4gIHZhciBpID0gMCwgcmV0ID0gXCJcIiwgZGF0YTtcblxuICB2YXIgdHlwZSA9IHRvU3RyaW5nLmNhbGwoY29udGV4dCk7XG4gIGlmKHR5cGUgPT09IGZ1bmN0aW9uVHlwZSkgeyBjb250ZXh0ID0gY29udGV4dC5jYWxsKHRoaXMpOyB9XG5cbiAgaWYgKG9wdGlvbnMuZGF0YSkge1xuICAgIGRhdGEgPSBIYW5kbGViYXJzLmNyZWF0ZUZyYW1lKG9wdGlvbnMuZGF0YSk7XG4gIH1cblxuICBpZihjb250ZXh0ICYmIHR5cGVvZiBjb250ZXh0ID09PSAnb2JqZWN0Jykge1xuICAgIGlmKGNvbnRleHQgaW5zdGFuY2VvZiBBcnJheSl7XG4gICAgICBmb3IodmFyIGogPSBjb250ZXh0Lmxlbmd0aDsgaTxqOyBpKyspIHtcbiAgICAgICAgaWYgKGRhdGEpIHsgZGF0YS5pbmRleCA9IGk7IH1cbiAgICAgICAgcmV0ID0gcmV0ICsgZm4oY29udGV4dFtpXSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IodmFyIGtleSBpbiBjb250ZXh0KSB7XG4gICAgICAgIGlmKGNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIGlmKGRhdGEpIHsgZGF0YS5rZXkgPSBrZXk7IH1cbiAgICAgICAgICByZXQgPSByZXQgKyBmbihjb250ZXh0W2tleV0sIHtkYXRhOiBkYXRhfSk7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYoaSA9PT0gMCl7XG4gICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiByZXQ7XG59KTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICB2YXIgdHlwZSA9IHRvU3RyaW5nLmNhbGwoY29uZGl0aW9uYWwpO1xuICBpZih0eXBlID09PSBmdW5jdGlvblR5cGUpIHsgY29uZGl0aW9uYWwgPSBjb25kaXRpb25hbC5jYWxsKHRoaXMpOyB9XG5cbiAgaWYoIWNvbmRpdGlvbmFsIHx8IEhhbmRsZWJhcnMuVXRpbHMuaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5pbnZlcnNlKHRoaXMpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICB9XG59KTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcigndW5sZXNzJywgZnVuY3Rpb24oY29uZGl0aW9uYWwsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIEhhbmRsZWJhcnMuaGVscGVyc1snaWYnXS5jYWxsKHRoaXMsIGNvbmRpdGlvbmFsLCB7Zm46IG9wdGlvbnMuaW52ZXJzZSwgaW52ZXJzZTogb3B0aW9ucy5mbn0pO1xufSk7XG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gIHZhciB0eXBlID0gdG9TdHJpbmcuY2FsbChjb250ZXh0KTtcbiAgaWYodHlwZSA9PT0gZnVuY3Rpb25UeXBlKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICBpZiAoIUhhbmRsZWJhcnMuVXRpbHMuaXNFbXB0eShjb250ZXh0KSkgcmV0dXJuIG9wdGlvbnMuZm4oY29udGV4dCk7XG59KTtcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbG9nJywgZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICB2YXIgbGV2ZWwgPSBvcHRpb25zLmRhdGEgJiYgb3B0aW9ucy5kYXRhLmxldmVsICE9IG51bGwgPyBwYXJzZUludChvcHRpb25zLmRhdGEubGV2ZWwsIDEwKSA6IDE7XG4gIEhhbmRsZWJhcnMubG9nKGxldmVsLCBjb250ZXh0KTtcbn0pO1xuO1xuLy8gbGliL2hhbmRsZWJhcnMvdXRpbHMuanNcblxudmFyIGVycm9yUHJvcHMgPSBbJ2Rlc2NyaXB0aW9uJywgJ2ZpbGVOYW1lJywgJ2xpbmVOdW1iZXInLCAnbWVzc2FnZScsICduYW1lJywgJ251bWJlcicsICdzdGFjayddO1xuXG5IYW5kbGViYXJzLkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgdmFyIHRtcCA9IEVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gIC8vIFVuZm9ydHVuYXRlbHkgZXJyb3JzIGFyZSBub3QgZW51bWVyYWJsZSBpbiBDaHJvbWUgKGF0IGxlYXN0KSwgc28gYGZvciBwcm9wIGluIHRtcGAgZG9lc24ndCB3b3JrLlxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlcnJvclByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzW2Vycm9yUHJvcHNbaWR4XV0gPSB0bXBbZXJyb3JQcm9wc1tpZHhdXTtcbiAgfVxufTtcbkhhbmRsZWJhcnMuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG4vLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuSGFuZGxlYmFycy5TYWZlU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xufTtcbkhhbmRsZWJhcnMuU2FmZVN0cmluZy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3RyaW5nLnRvU3RyaW5nKCk7XG59O1xuXG52YXIgZXNjYXBlID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogXCImcXVvdDtcIixcbiAgXCInXCI6IFwiJiN4Mjc7XCIsXG4gIFwiYFwiOiBcIiYjeDYwO1wiXG59O1xuXG52YXIgYmFkQ2hhcnMgPSAvWyY8PlwiJ2BdL2c7XG52YXIgcG9zc2libGUgPSAvWyY8PlwiJ2BdLztcblxudmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdIHx8IFwiJmFtcDtcIjtcbn07XG5cbkhhbmRsZWJhcnMuVXRpbHMgPSB7XG4gIGV4dGVuZDogZnVuY3Rpb24ob2JqLCB2YWx1ZSkge1xuICAgIGZvcih2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICBpZih2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsdWVba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgZXNjYXBlRXhwcmVzc2lvbjogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgaW5zdGFuY2VvZiBIYW5kbGViYXJzLlNhZmVTdHJpbmcpIHtcbiAgICAgIHJldHVybiBzdHJpbmcudG9TdHJpbmcoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsIHx8IHN0cmluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cblxuICAgIC8vIEZvcmNlIGEgc3RyaW5nIGNvbnZlcnNpb24gYXMgdGhpcyB3aWxsIGJlIGRvbmUgYnkgdGhlIGFwcGVuZCByZWdhcmRsZXNzIGFuZFxuICAgIC8vIHRoZSByZWdleCB0ZXN0IHdpbGwgZG8gdGhpcyB0cmFuc3BhcmVudGx5IGJlaGluZCB0aGUgc2NlbmVzLCBjYXVzaW5nIGlzc3VlcyBpZlxuICAgIC8vIGFuIG9iamVjdCdzIHRvIHN0cmluZyBoYXMgZXNjYXBlZCBjaGFyYWN0ZXJzIGluIGl0LlxuICAgIHN0cmluZyA9IHN0cmluZy50b1N0cmluZygpO1xuXG4gICAgaWYoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKGJhZENoYXJzLCBlc2NhcGVDaGFyKTtcbiAgfSxcblxuICBpc0VtcHR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZih0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn07XG47XG4vLyBsaWIvaGFuZGxlYmFycy9ydW50aW1lLmpzXG5cbkhhbmRsZWJhcnMuVk0gPSB7XG4gIHRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZVNwZWMpIHtcbiAgICAvLyBKdXN0IGFkZCB3YXRlclxuICAgIHZhciBjb250YWluZXIgPSB7XG4gICAgICBlc2NhcGVFeHByZXNzaW9uOiBIYW5kbGViYXJzLlV0aWxzLmVzY2FwZUV4cHJlc3Npb24sXG4gICAgICBpbnZva2VQYXJ0aWFsOiBIYW5kbGViYXJzLlZNLmludm9rZVBhcnRpYWwsXG4gICAgICBwcm9ncmFtczogW10sXG4gICAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgICAgICB2YXIgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldO1xuICAgICAgICBpZihkYXRhKSB7XG4gICAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSBIYW5kbGViYXJzLlZNLnByb2dyYW0oaSwgZm4sIGRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKCFwcm9ncmFtV3JhcHBlcikge1xuICAgICAgICAgIHByb2dyYW1XcmFwcGVyID0gdGhpcy5wcm9ncmFtc1tpXSA9IEhhbmRsZWJhcnMuVk0ucHJvZ3JhbShpLCBmbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgICAgfSxcbiAgICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICAgIHZhciByZXQgPSBwYXJhbSB8fCBjb21tb247XG5cbiAgICAgICAgaWYgKHBhcmFtICYmIGNvbW1vbikge1xuICAgICAgICAgIHJldCA9IHt9O1xuICAgICAgICAgIEhhbmRsZWJhcnMuVXRpbHMuZXh0ZW5kKHJldCwgY29tbW9uKTtcbiAgICAgICAgICBIYW5kbGViYXJzLlV0aWxzLmV4dGVuZChyZXQsIHBhcmFtKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfSxcbiAgICAgIHByb2dyYW1XaXRoRGVwdGg6IEhhbmRsZWJhcnMuVk0ucHJvZ3JhbVdpdGhEZXB0aCxcbiAgICAgIG5vb3A6IEhhbmRsZWJhcnMuVk0ubm9vcCxcbiAgICAgIGNvbXBpbGVySW5mbzogbnVsbFxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICB2YXIgcmVzdWx0ID0gdGVtcGxhdGVTcGVjLmNhbGwoY29udGFpbmVyLCBIYW5kbGViYXJzLCBjb250ZXh0LCBvcHRpb25zLmhlbHBlcnMsIG9wdGlvbnMucGFydGlhbHMsIG9wdGlvbnMuZGF0YSk7XG5cbiAgICAgIHZhciBjb21waWxlckluZm8gPSBjb250YWluZXIuY29tcGlsZXJJbmZvIHx8IFtdLFxuICAgICAgICAgIGNvbXBpbGVyUmV2aXNpb24gPSBjb21waWxlckluZm9bMF0gfHwgMSxcbiAgICAgICAgICBjdXJyZW50UmV2aXNpb24gPSBIYW5kbGViYXJzLkNPTVBJTEVSX1JFVklTSU9OO1xuXG4gICAgICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgICAgIGlmIChjb21waWxlclJldmlzaW9uIDwgY3VycmVudFJldmlzaW9uKSB7XG4gICAgICAgICAgdmFyIHJ1bnRpbWVWZXJzaW9ucyA9IEhhbmRsZWJhcnMuUkVWSVNJT05fQ0hBTkdFU1tjdXJyZW50UmV2aXNpb25dLFxuICAgICAgICAgICAgICBjb21waWxlclZlcnNpb25zID0gSGFuZGxlYmFycy5SRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgICAgIHRocm93IFwiVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gXCIrXG4gICAgICAgICAgICAgICAgXCJQbGVhc2UgdXBkYXRlIHlvdXIgcHJlY29tcGlsZXIgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitydW50aW1lVmVyc2lvbnMrXCIpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoXCIrY29tcGlsZXJWZXJzaW9ucytcIikuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICAgICAgdGhyb3cgXCJUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuIFwiK1xuICAgICAgICAgICAgICAgIFwiUGxlYXNlIHVwZGF0ZSB5b3VyIHJ1bnRpbWUgdG8gYSBuZXdlciB2ZXJzaW9uIChcIitjb21waWxlckluZm9bMV0rXCIpLlwiO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfSxcblxuICBwcm9ncmFtV2l0aERlcHRoOiBmdW5jdGlvbihpLCBmbiwgZGF0YSAvKiwgJGRlcHRoICovKSB7XG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDMpO1xuXG4gICAgdmFyIHByb2dyYW0gPSBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIFtjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YV0uY29uY2F0KGFyZ3MpKTtcbiAgICB9O1xuICAgIHByb2dyYW0ucHJvZ3JhbSA9IGk7XG4gICAgcHJvZ3JhbS5kZXB0aCA9IGFyZ3MubGVuZ3RoO1xuICAgIHJldHVybiBwcm9ncmFtO1xuICB9LFxuICBwcm9ncmFtOiBmdW5jdGlvbihpLCBmbiwgZGF0YSkge1xuICAgIHZhciBwcm9ncmFtID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCBvcHRpb25zLmRhdGEgfHwgZGF0YSk7XG4gICAgfTtcbiAgICBwcm9ncmFtLnByb2dyYW0gPSBpO1xuICAgIHByb2dyYW0uZGVwdGggPSAwO1xuICAgIHJldHVybiBwcm9ncmFtO1xuICB9LFxuICBub29wOiBmdW5jdGlvbigpIHsgcmV0dXJuIFwiXCI7IH0sXG4gIGludm9rZVBhcnRpYWw6IGZ1bmN0aW9uKHBhcnRpYWwsIG5hbWUsIGNvbnRleHQsIGhlbHBlcnMsIHBhcnRpYWxzLCBkYXRhKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7IGhlbHBlcnM6IGhlbHBlcnMsIHBhcnRpYWxzOiBwYXJ0aWFscywgZGF0YTogZGF0YSB9O1xuXG4gICAgaWYocGFydGlhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgSGFuZGxlYmFycy5FeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgZm91bmRcIik7XG4gICAgfSBlbHNlIGlmKHBhcnRpYWwgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHBhcnRpYWwoY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmICghSGFuZGxlYmFycy5jb21waWxlKSB7XG4gICAgICB0aHJvdyBuZXcgSGFuZGxlYmFycy5FeGNlcHRpb24oXCJUaGUgcGFydGlhbCBcIiArIG5hbWUgKyBcIiBjb3VsZCBub3QgYmUgY29tcGlsZWQgd2hlbiBydW5uaW5nIGluIHJ1bnRpbWUtb25seSBtb2RlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0aWFsc1tuYW1lXSA9IEhhbmRsZWJhcnMuY29tcGlsZShwYXJ0aWFsLCB7ZGF0YTogZGF0YSAhPT0gdW5kZWZpbmVkfSk7XG4gICAgICByZXR1cm4gcGFydGlhbHNbbmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG59O1xuXG5IYW5kbGViYXJzLnRlbXBsYXRlID0gSGFuZGxlYmFycy5WTS50ZW1wbGF0ZTtcbjtcbi8vIGxpYi9oYW5kbGViYXJzL2Jyb3dzZXItc3VmZml4LmpzXG59KShIYW5kbGViYXJzKTtcbjtcbiIsIiQgPSByZXF1aXJlICcuLi9saWIvemVwdG8uanMnXG5cbnBhdHRlcm5zID0gW10gICMgYXJyYXkgb2YgcmVnZXhlcyB0aGF0IGlzIHRyYXZlcnNlZCB3aGVuIHNlYXJjaGluZyBmb3IgYSBtYXRjaGluZyByb3V0ZVxuXG4jIGhhbmRsZXIgY2FuIGJlIHJlY3Vyc2l2ZTogaWYgb2JqZWN0IHRoZW4gZGlzcGF0Y2gsIGVsc2Ugc2F2ZSB0aGUgZnVuY3Rpb25cbmV4cG9ydHMudXJscGF0dGVybiA9IChwYXR0ZXJuLCBoYW5kbGVyKSAtPlxuICAgIHsgcGF0dGVybiwgaGFuZGxlciB9XG5cbm9wdGlvbnMgPVxuICAgIGFkZF9jaGFuZ2VfbGlzdGVuZXI6IChmbikgLT4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ2hhc2hjaGFuZ2UnLCAtPiBmbigpXG4gICAgZ2V0X2FkZHJlc3M6ICAgICAgICAgLT4gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyIDFcbiAgICByZWRpcmVjdDogICAgICAgICAgICAoYWRkcmVzcykgLT4gd2luZG93LmxvY2F0aW9uLmhhc2ggPSBhZGRyZXNzXG5cbiMgdXJsczogYXJyYXkgb2YgdXJscGF0dGVybnNcbmV4cG9ydHMucm91dGUgPSAoX3VybHMsIF9vcHRpb25zPXt9KSAtPlxuICAgICQuZXh0ZW5kIG9wdGlvbnMsIF9vcHRpb25zXG5cbiAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkICdyb3V0aW5nIHJlYWR5J1xuICAgIGNvbnNvbGUubG9nICctIHVybHM6JywgX3VybHNcbiAgICBjb25zb2xlLmxvZyAnLSBvcHRpb25zOicsIG9wdGlvbnNcbiAgICBjb25zb2xlLmdyb3VwRW5kKClcblxuICAgIG5hdmlnYXRlID0gKGFkZHJlc3M9b3B0aW9ucy5nZXRfYWRkcmVzcygpLCB1cmxzPV91cmxzKSAtPlxuICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIFwibmF2aWdhdGUgdG86ICN7YWRkcmVzc31cIlxuXG4gICAgICAgIGhhbmRsZXIgPSBudWxsXG4gICAgICAgIGZvciBwIGluIHVybHNcbiAgICAgICAgICAgIHJlID0gbmV3IFJlZ0V4cCBwLnBhdHRlcm5cbiAgICAgICAgICAgIGlmIHJlLnRlc3QgYWRkcmVzc1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nICdtYXRjaGVkIHBhdHRlcm46JywgcmVcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0gcC5oYW5kbGVyXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgaWYgaGFuZGxlcj9cbiAgICAgICAgICAgIGlmIHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicgdGhlbiBoYW5kbGVyIGFkZHJlc3NcbiAgICAgICAgICAgIGVsc2UgbmF2aWdhdGUgKGFkZHJlc3Muc3Vic3RyaW5nIChyZS5leGVjIGFkZHJlc3MpWzBdLmxlbmd0aCksIGhhbmRsZXJcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lclRleHQgPSAnTm90IEZvdW5kJ1xuXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuXG4gICAgb3B0aW9ucy5hZGRfY2hhbmdlX2xpc3RlbmVyIG5hdmlnYXRlXG4gICAgbmF2aWdhdGUoKSAgIyBleHBsaWNpdGx5IGNoZWNrIGFkZHJlc3Mgb24gaW5pdGlhbGl6YXRpb25cblxuZXhwb3J0cy5yZWRpcmVjdCA9IChhZGRyZXNzKSAtPlxuICAgIGNvbnNvbGUubG9nIFwiLS0+IHJlZGlyZWN0aW5nIHRvOiAje2FkZHJlc3N9XCJcbiAgICBvcHRpb25zLnJlZGlyZWN0IGFkZHJlc3NcbiIsInUydSA9IHJlcXVpcmUgJy4uL2hlbHBlcnMvdTJ1LmNvZmZlZSdcbiQgICA9IHJlcXVpcmUgJy4uL2xpYi96ZXB0by5qcydcbmxvY2Fsc3RvcmFnZSA9IHJlcXVpcmUgJy4uL2hlbHBlcnMvbG9jYWxzdG9yYWdlLmNvZmZlZSdcblxuIyB0aGlzLCBsaWtlIGFsbCBvdGhlciBjb2RlIHNvIGZhciwgaXMgb2YgY291cnNlIGEgc3R1YiwgYnV0IHRoZSBiYXNpY1xuIyBpZGVhIG1pZ2h0IGFjdHVhbGx5IHN0YXkgYXJvdW5kIGZvciBhIHdoaWxlIHNpbmNlIEluZGV4ZWREQiBzdWNrc1xuZGIgPVxuICAgIFNDT1JFX0JFR0lOU1dJVEg6IDVcbiAgICBTQ09SRV9DT05UQUlOUzogICAxXG5cbiAgICBnZXQ6IChxdWVyeSkgLT4gbG9jYWxzdG9yYWdlLmdldCAnc29uZy4nICsgdTJ1IHF1ZXJ5XG5cbiAgICBmaW5kOiAocXVlcnkpIC0+XG4gICAgICAgIHF1ZXJ5ID0gdTJ1IHF1ZXJ5XG4gICAgICAgIHdvcmRzID0gcXVlcnkuc3BsaXQgJ18nXG4gICAgICAgIHJlZ2V4ZXNfYmVnaW5zd2l0aCA9IChuZXcgUmVnRXhwICcoXnwvfF8pJyt3IGZvciB3IGluIHdvcmRzKVxuICAgICAgICByZWdleGVzX2NvbnRhaW5zID0gKG5ldyBSZWdFeHAgdyBmb3IgdyBpbiB3b3JkcylcbiAgICAgICAgbWF0Y2hlcyA9IFtdXG4gICAgICAgIGZvciBrIGluIGxvY2Fsc3RvcmFnZS5rZXlzICdzb25nJ1xuICAgICAgICAgICAga2V5ID0gay5zdWJzdHIgJ3NvbmcuJy5sZW5ndGhcbiAgICAgICAgICAgIHNjb3JlID0gMFxuICAgICAgICAgICAgc2NvcmUgKz0gZGIuU0NPUkVfQkVHSU5TV0lUSCBmb3IgciBpbiByZWdleGVzX2JlZ2luc3dpdGggd2hlbiByLnRlc3Qga2V5XG4gICAgICAgICAgICBzY29yZSArPSBkYi5TQ09SRV9DT05UQUlOUyBmb3IgciBpbiByZWdleGVzX2NvbnRhaW5zIHdoZW4gci50ZXN0IGtleSB1bmxlc3Mgc2NvcmVcbiAgICAgICAgICAgIGlmIHNjb3JlIHRoZW4gbWF0Y2hlcy5wdXNoIHsga2V5LCBzY29yZSB9XG5cbiAgICAgICAgJC5leHRlbmQgbSwgZGIuZ2V0IG0ua2V5IGZvciBtIGluIG1hdGNoZXMuc29ydCAoYSwgYikgLT4gYi5zY29yZSAtIGEuc2NvcmUgICMgc29ydHMgYnkgc2NvcmUgaW4gZGVzY2VuZGluZyBvcmRlclxuXG4gICAgZ2V0X29yX2ZpbmQ6IChxdWVyeSkgLT5cbiAgICAgICAgcmV0dXJuIChpZiBkYi5nZXQgcXVlcnkgdGhlbiBbZGIuZ2V0IHF1ZXJ5XSBlbHNlIGRiLmZpbmQgcXVlcnkpXG5cbiAgICBzYXZlOiAoc29uZykgLT5cbiAgICAgICAgY29uc29sZS5kZWJ1ZyAnc2F2aW5nIHNvbmc6Jywgc29uZ1xuICAgICAgICBrZXkgPSB1MnUgXCIje3NvbmcubWV0YS5hdXRob3J9LyN7c29uZy5tZXRhLnRpdGxlfVwiXG4gICAgICAgIGxvY2Fsc3RvcmFnZS5zZXQgJ3NvbmcuJytrZXksIHNvbmdcbiAgICAgICAgcmV0dXJuIGtleVxuXG4gICAgc2l6ZTogLT4gbG9jYWxzdG9yYWdlLmtleXMoJ3NvbmcnKS5sZW5ndGhcblxuXG5leHBvcnRzLnBhcnNlX3NvbmcgPSBwYXJzZV9zb25nID0gKGNvbnRlbnQpIC0+XG4gICAgIyByZW1vdmUgY29tbWVudHMgKG1hcmtlZCBieSBgLy9gKSBhbmQgZXhjZXNzIHdoaXRlc3BhY2VcbiAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKC9cXC9cXC8uKlxcbi9nbSwgJycpLnRyaW0oKS5yZXBsYWNlKC9bXFx0IF1bXFx0IF0qJC9nbSwgJycpLnJlcGxhY2UgL1xccj9cXG4oXFxyP1xcbikrL2dtLCAnXFxuXFxuJ1xuICAgICMgcmVhZCBtZXRhZGF0YSBzZWN0aW9uXG4gICAgbWV0YV9tYXRjaCA9IGNvbnRlbnQuc3BsaXQoJ1xcblxcbicsIDEpWzBdLm1hdGNoIC9eXFx3K1xccyo6XFxzKi4qJC9nbVxuICAgIG1ldGEgPSB7fVxuICAgIGlmIG1ldGFfbWF0Y2hcbiAgICAgICAgZm9yIG0gaW4gbWV0YV9tYXRjaFxuICAgICAgICAgICAgW2ssIHZdID0gbS5zcGxpdCAnOidcbiAgICAgICAgICAgIG1ldGFbdTJ1IGtdID0gdi50cmltKClcbiAgICAgICAgdGV4dCA9IGNvbnRlbnQuc3Vic3RyKGNvbnRlbnQuc3BsaXQoJ1xcblxcbicsIDEpWzBdLmxlbmd0aCkudHJpbSgpXG4gICAgZWxzZVxuICAgICAgICB0ZXh0ID0gY29udGVudFxuXG4gICAgcmV0dXJuIHsgbWV0YSwgZGF0YToge3RleHR9IH1cblxuZXhwb3J0cy50ZXh0X3RvX2h0bWwgPSB0ZXh0X3RvX2h0bWwgPSAodGV4dCkgLT5cbiAgICAjIFRPRE8gaHRtbCBoZXJlIGlzIGV2aWwuLi4gdGhpcyBzaG91bGQgYmUgY2FsbGVkIHNvbWV0aGluZyBvdGhlciB0aGFuIHRvX2h0bWwgYW5kIHByb2R1Y2Ugc29tZXRoaW5nIGRpZmZlcmVudCBwcmVzdW1hYmx5XG4gICAgKCc8ZGl2IGNsYXNzPVwic3RhbnphXCI+JytzdGFuemErJzwvZGl2PicgZm9yIHN0YW56YSBpbiB0ZXh0LnNwbGl0ICdcXG5cXG4nKS5qb2luKCcnKS5yZXBsYWNlIC88PFtcXHcjK1xcL10rPj4vZywgKG0pIC0+IFwiPHNwYW4gY2xhc3M9J2Nob3JkJz4je20uc3Vic3RyIDIsIG0ubGVuZ3RoLTR9PC9zcGFuPlwiXG5cbmNsYXNzIFNvbmdcblx0Y29uc3RydWN0b3I6IChmcm9tKSAtPlxuXHRcdEBtZXRhID0ge307IEBkYXRhID0ge31cblx0XHRpZiBmcm9tLnR4dCB0aGVuIHtAbWV0YSwgQGRhdGF9ID0gcGFyc2Vfc29uZyBmcm9tLnR4dFxuXHRcdCQuZXh0ZW5kIEBtZXRhLCBmcm9tLm1ldGFcblx0XHQkLmV4dGVuZCBAZGF0YSwgZnJvbS5kYXRhXG5cdFx0QGtleSA9IGZyb20ua2V5XG5cblx0c2F2ZTogLT4gZGIuc2F2ZSB0aGlzXG5cdHRvX2h0bWw6ID0+IHRleHRfdG9faHRtbCBAZGF0YS50ZXh0XG5cblxuZXhwb3J0cy5Tb25nID0gU29uZ1xuXG5leHBvcnRzLmZpbmQgPSAocXVlcnkpIC0+XG5cdG5ldyBTb25nIGkgZm9yIGkgaW4gZGIuZ2V0X29yX2ZpbmQgcXVlcnlcblxuZXhwb3J0cy5zaXplID0gZGIuc2l6ZVxuIiwie3JlbmRlcn0gPSByZXF1aXJlICcuLi8uLi9oZWxwZXJzL3NuaXBwZXRzLmNvZmZlZSdcbiQgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vbGliL3plcHRvLmpzJ1xucm91dGVyICAgPSByZXF1aXJlICcuLi8uLi9yb3V0ZXIvcm91dGVyLmNvZmZlZSdcbnNvbmdzICAgID0gcmVxdWlyZSAnLi4vc29uZ3MuY29mZmVlJ1xuXG5leHBvcnRzLmhhbmRsZXIgPSAtPlxuICAgIHJlbmRlciAnI2NvbnRlbnQnLCAocmVxdWlyZSAnLi9hZGRfc29uZy5oYnMnKVxuXG4gICAgJCgnI3RleHQnKS5vbiBmb2N1czogLT4gJCgnI3RleHQtY29udGFpbmVyJykuYWRkQ2xhc3MgJ2ZvY3VzJ1xuICAgICQoJyN0ZXh0Jykub24gYmx1cjogLT4gJCgnI3RleHQtY29udGFpbmVyJykucmVtb3ZlQ2xhc3MgJ2ZvY3VzJ1xuICAgICQoJyN0ZXh0Jykub24gXCJpbnB1dFwiLCAoZSkgLT5cbiAgICAgICAgJCgnI3ByZXZpZXcnKS5odG1sIHNvbmdzLnRleHRfdG9faHRtbCBzb25ncy5wYXJzZV9zb25nKCQoJyN0ZXh0JykudmFsKCkpLmRhdGEudGV4dFxuXG4gICAgJCgnI3NvbmctZmlsZScpLm9uIGNoYW5nZTogKGUpIC0+XG4gICAgICAgIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChlKSAtPlxuICAgICAgICAgICAgcmVzID0gc29uZ3MucGFyc2Vfc29uZyBlLnRhcmdldC5yZXN1bHRcbiAgICAgICAgICAgICQoJyNhdXRob3InKS52YWwgcmVzLm1ldGEuYXV0aG9yXG4gICAgICAgICAgICAkKCcjdGl0bGUnKS52YWwgcmVzLm1ldGEudGl0bGVcbiAgICAgICAgICAgICQoJyN0ZXh0JykudGV4dCByZXMuZGF0YS50ZXh0OyAkKCcjdGV4dCcpLnRyaWdnZXIgJ2lucHV0J1xuICAgICAgICAgICAgJCgnbGVnZW5kLmRpdmlkZSBzcGFuJykudGV4dCAnZWRpdCdcbiAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQgKGUudGFyZ2V0LmZpbGVzID8gZS5kYXRhVHJhbnNmZXIuZmlsZXMpWzBdXG5cbiAgICAkKCcjYWRkLXNvbmctZm9ybScpLnN1Ym1pdCAoZSkgLT5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgcyA9IG5ldyBzb25ncy5Tb25nIG1ldGE6IHsgYXV0aG9yOiAkKCcjYXV0aG9yJykudmFsKCksIHRpdGxlOiAkKCcjdGl0bGUnKS52YWwoKSB9LCB0eHQ6ICQoJyN0ZXh0JykudmFsKClcbiAgICAgICAgICAgIHJvdXRlci5yZWRpcmVjdCBzLnNhdmUoKVxuIiwidmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLXJ1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgXG5cblxuICByZXR1cm4gXCI8aDE+QWRkIGEgTmV3IFNvbmc8L2gxPlxcblxcbjxmb3JtIGlkPVxcXCJhZGQtc29uZy1mb3JtXFxcIj5cXG5cdDxmaWVsZHNldD5cXG5cdFx0PGxhYmVsIGZvcj1cXFwic29uZy1maWxlXFxcIj5DaG9vc2UgRmlsZTwvbGFiZWw+XFxuXHRcdDxpbnB1dCBpZD1cXFwic29uZy1maWxlXFxcIiB0eXBlPVxcXCJmaWxlXFxcIiAvPlxcblx0PC9maWVsZHNldD5cXG5cdDxsZWdlbmQgY2xhc3M9XFxcImRpdmlkZVxcXCI+PHNwYW4+b3I8L3NwYW4+PC9sZWdlbmQ+XFxuXHQ8ZmllbGRzZXQ+XFxuXHRcdDxpbnB1dCBpZD1cXFwiYXV0aG9yXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiYXV0aG9yXFxcIiAvPlxcblx0XHQ8aW5wdXQgaWQ9XFxcInRpdGxlXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwidGl0bGVcXFwiIC8+XFxuXHRcdDxkaXYgaWQ9XFxcInRleHQtY29udGFpbmVyXFxcIj5cXG5cdFx0XHQ8dGV4dGFyZWEgaWQ9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJ0ZXh0IChtYXJrIGNob3JkcyBsaWtlIHRoaXM6IDw8QW1pPj47IHNlcGFyYXRlIHN0YW56YXMgYnkgYmxhbmsgbGluZXM7IG1vcmUgZGV0YWlscyBjb21taW5nIHNvb24uLi4pXFxcIj48L3RleHRhcmVhPlxcblx0XHRcdDxkaXYgaWQ9XFxcInByZXZpZXdcXFwiIGNsYXNzPVxcXCJzb25nLXRleHRcXFwiPjwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvZmllbGRzZXQ+XFxuXHQ8aW5wdXQgaWQ9XFxcInNhdmUtYnV0dG9uXFxcIiB0eXBlPVxcXCJzdWJtaXRcXFwiIHZhbHVlPVxcXCJTYXZlXFxcIiAvPlxcbjwvZm9ybT5cXG5cIjtcbiAgfSk7XG4iLCIjIGhhbmRsZXMgdGhlIHNlYXJjaCBiYXJcbiQgXHQgICA9IHJlcXVpcmUgJy4uLy4uL2xpYi96ZXB0by5qcydcbnJvdXRlciA9IHJlcXVpcmUgJy4uLy4uL3JvdXRlci9yb3V0ZXIuY29mZmVlJ1xuXG5OQVZCQVJfSElERV9USU1FT1VUID0gNDAwMFxuXG53aW5kb3cuJCA9ICRcblxuZXhwb3J0cy5pbml0ID0gLT5cblxuXHQjIG1haW4gbmF2XG5cblx0IyAtIHNlYXJjaCBiYXJcblx0cyA9ICQoJyNzZWFyY2gnKVxuXHRzX2NvbXB1dGVfd2lkdGggPSAtPlxuXHRcdG4gPSAkKCcjbWFpbm5hdi1pbnNpZGUnKVxuXHRcdHMud2lkdGggbi53aWR0aCgpIC0gcGFyc2VJbnQobi5jc3MgJ3BhZGRpbmctbGVmdCcpIC0gcGFyc2VJbnQobi5jc3MgJ3BhZGRpbmctcmlnaHQnKSAtICQoJyNtZW51LWJ1dHRvbi13cmFwcGVyJykud2lkdGgoKSAtIDIwXG5cdCQod2luZG93KS5vbiByZXNpemU6IHNfY29tcHV0ZV93aWR0aFxuXHQjIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdoYXNoY2hhbmdlJywgLT4gc2V0VGltZW91dCBzX2NvbXB1dGVfd2lkdGgsIDFcblx0JChzX2NvbXB1dGVfd2lkdGgpXG5cdHMub24gc2VhcmNoOiAtPiByb3V0ZXIucmVkaXJlY3Qgcy52YWwoKVxuXG5cdCMgLSBhZGQgYnV0dG9uXG5cdCQoJyNtZW51LWJ1dHRvbicpLm9uICdjbGljaycsIC0+IHJvdXRlci5yZWRpcmVjdCAnX2FkZCdcblxuXHQjIGhpZGUgbmF2YmFyIHdoZW4gZGlzcGxheWluZyBseXJpY3MgYW5kIHRoZXJlIGlzIG5vIG1vdXNlIGFjdGl2aXR5ICgrIHdvcmthcm91bmQ6IHNjcm9sbGluZyBkb2Vzbid0IGNvdW50IGFzIG1vdXNlIGFjdGl2aXR5KVxuXHRoaWRlX3RpbWVyID0gbnVsbDsgbGFzdF9tb3VzZV9wb3MgPSBbLTEsLTFdXG5cdG5hdmJhcl9oaWRpbmdfb24gPSAtPlxuXHRcdGhpZGVfbmF2YmFyID0gLT4gJCgnI21haW5uYXYnKS5jc3Mgb3BhY2l0eTogMFxuXHRcdHNob3dfbmF2YmFyID0gLT4gJCgnI21haW5uYXYnKS5jc3Mgb3BhY2l0eTogMTsgaGlkZV90aW1lciA9IHNldFRpbWVvdXQgaGlkZV9uYXZiYXIsIE5BVkJBUl9ISURFX1RJTUVPVVRcblx0XHRyZXNldF9uYXZiYXJfaGlkaW5nID0gLT4gY2xlYXJUaW1lb3V0IGhpZGVfdGltZXI7IHNob3dfbmF2YmFyKClcblx0XHQkKHJlc2V0X25hdmJhcl9oaWRpbmcpXG5cdFx0JCgnI3dyYXBwZXInKS5vbiAnbW91c2Vtb3ZlIGNsaWNrJywgKGUpIC0+XG5cdFx0XHRpZiBsYXN0X21vdXNlX3Bvc1swXSAhPSBlLnNjcmVlblggb3IgbGFzdF9tb3VzZV9wb3NbMV0gIT0gZS5zY3JlZW5ZIHRoZW4gcmVzZXRfbmF2YmFyX2hpZGluZygpXG5cdFx0XHRsYXN0X21vdXNlX3BvcyA9IFtlLnNjcmVlblgsIGUuc2NyZWVuWV1cblx0bmF2YmFyX2hpZGluZ19vZmYgPSAtPlxuXHRcdCQoJyN3cmFwcGVyJykub2ZmICdtb3VzZW1vdmUgY2xpY2snXG5cdFx0JCgnI21haW5uYXYnKS5jc3Mgb3BhY2l0eTogMVxuXHRcdGNsZWFyVGltZW91dCBoaWRlX3RpbWVyXG5cdCQoZG9jdW1lbnQpLm9uICdET01Ob2RlSW5zZXJ0ZWQnLCAnLnNvbmctdGV4dCcsIG5hdmJhcl9oaWRpbmdfb25cblx0JChkb2N1bWVudCkub24gJ0RPTU5vZGVSZW1vdmVkJywgJy5zb25nLXRleHQnLCBuYXZiYXJfaGlkaW5nX29mZlxuIiwidmFyIEhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzLXJ1bnRpbWUnKTtcbm1vZHVsZS5leHBvcnRzID0gSGFuZGxlYmFycy50ZW1wbGF0ZShmdW5jdGlvbiAoSGFuZGxlYmFycyxkZXB0aDAsaGVscGVycyxwYXJ0aWFscyxkYXRhKSB7XG4gIHRoaXMuY29tcGlsZXJJbmZvID0gWzQsJz49IDEuMC4wJ107XG5oZWxwZXJzID0gdGhpcy5tZXJnZShoZWxwZXJzLCBIYW5kbGViYXJzLmhlbHBlcnMpOyBkYXRhID0gZGF0YSB8fCB7fTtcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb24sIHNlbGY9dGhpcywgYmxvY2tIZWxwZXJNaXNzaW5nPWhlbHBlcnMuYmxvY2tIZWxwZXJNaXNzaW5nO1xuXG5mdW5jdGlvbiBwcm9ncmFtMShkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMSwgb3B0aW9ucztcbiAgYnVmZmVyICs9IFwiXFxuXHQ8dWwgY2xhc3M9XFxcInNvbmdzLWxpc3RcXFwiPlxcblx0XCI7XG4gIG9wdGlvbnMgPSB7aGFzaDp7fSxpbnZlcnNlOnNlbGYubm9vcCxmbjpzZWxmLnByb2dyYW0oMiwgcHJvZ3JhbTIsIGRhdGEpLGRhdGE6ZGF0YX07XG4gIGlmIChzdGFjazEgPSBoZWxwZXJzLnNvbmdzX2xpc3QpIHsgc3RhY2sxID0gc3RhY2sxLmNhbGwoZGVwdGgwLCBvcHRpb25zKTsgfVxuICBlbHNlIHsgc3RhY2sxID0gZGVwdGgwLnNvbmdzX2xpc3Q7IHN0YWNrMSA9IHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxOyB9XG4gIGlmICghaGVscGVycy5zb25nc19saXN0KSB7IHN0YWNrMSA9IGJsb2NrSGVscGVyTWlzc2luZy5jYWxsKGRlcHRoMCwgc3RhY2sxLCBvcHRpb25zKTsgfVxuICBpZihzdGFjazEgfHwgc3RhY2sxID09PSAwKSB7IGJ1ZmZlciArPSBzdGFjazE7IH1cbiAgYnVmZmVyICs9IFwiXFxuXHQ8L3VsPlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5mdW5jdGlvbiBwcm9ncmFtMihkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMTtcbiAgYnVmZmVyICs9IFwiXFxuXHRcdDxsaSBkYXRhLXNjb3JlPVxcXCJcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IGRlcHRoMC5zY29yZSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCJcXFwiPjxhIGhyZWY9XFxcIiNcIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9IGRlcHRoMC5rZXkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiXFxcIj5cIlxuICAgICsgZXNjYXBlRXhwcmVzc2lvbigoKHN0YWNrMSA9ICgoc3RhY2sxID0gZGVwdGgwLm1ldGEpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEuYXV0aG9yKSksdHlwZW9mIHN0YWNrMSA9PT0gZnVuY3Rpb25UeXBlID8gc3RhY2sxLmFwcGx5KGRlcHRoMCkgOiBzdGFjazEpKVxuICAgICsgXCI6IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKChzdGFjazEgPSBkZXB0aDAubWV0YSksc3RhY2sxID09IG51bGwgfHwgc3RhY2sxID09PSBmYWxzZSA/IHN0YWNrMSA6IHN0YWNrMS50aXRsZSkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiPC9hPjwvbGk+XFxuXHRcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG5mdW5jdGlvbiBwcm9ncmFtNChkZXB0aDAsZGF0YSkge1xuICBcbiAgdmFyIGJ1ZmZlciA9IFwiXCIsIHN0YWNrMTtcbiAgYnVmZmVyICs9IFwiXFxuXHRcIjtcbiAgc3RhY2sxID0gaGVscGVyc1snaWYnXS5jYWxsKGRlcHRoMCwgZGVwdGgwLm5vX3NvbmdzLCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYucHJvZ3JhbSg3LCBwcm9ncmFtNywgZGF0YSksZm46c2VsZi5wcm9ncmFtKDUsIHByb2dyYW01LCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9XG5mdW5jdGlvbiBwcm9ncmFtNShkZXB0aDAsZGF0YSkge1xuICBcbiAgXG4gIHJldHVybiBcIlxcblx0XHRUaGUgc29uZyBkYXRhYmFzZSBpcyBlbXB0eS4gPGEgaHJlZj1cXFwiI19hZGRcXFwiPkFkZCBzb21lIHNvbmdzITwvYT5cXG5cdFwiO1xuICB9XG5cbmZ1bmN0aW9uIHByb2dyYW03KGRlcHRoMCxkYXRhKSB7XG4gIFxuICB2YXIgYnVmZmVyID0gXCJcIiwgc3RhY2sxO1xuICBidWZmZXIgKz0gXCJcXG5cdFx0Tm8gbWF0Y2ggZm9yIGBcIjtcbiAgaWYgKHN0YWNrMSA9IGhlbHBlcnMucXVlcnkpIHsgc3RhY2sxID0gc3RhY2sxLmNhbGwoZGVwdGgwLCB7aGFzaDp7fSxkYXRhOmRhdGF9KTsgfVxuICBlbHNlIHsgc3RhY2sxID0gZGVwdGgwLnF1ZXJ5OyBzdGFjazEgPSB0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMTsgfVxuICBidWZmZXIgKz0gZXNjYXBlRXhwcmVzc2lvbihzdGFjazEpXG4gICAgKyBcIicuXFxuXHRcIjtcbiAgcmV0dXJuIGJ1ZmZlcjtcbiAgfVxuXG4gIHN0YWNrMSA9IGhlbHBlcnNbJ2lmJ10uY2FsbChkZXB0aDAsIGRlcHRoMC5zb25nc19saXN0LCB7aGFzaDp7fSxpbnZlcnNlOnNlbGYucHJvZ3JhbSg0LCBwcm9ncmFtNCwgZGF0YSksZm46c2VsZi5wcm9ncmFtKDEsIHByb2dyYW0xLCBkYXRhKSxkYXRhOmRhdGF9KTtcbiAgaWYoc3RhY2sxIHx8IHN0YWNrMSA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2sxOyB9XG4gIGJ1ZmZlciArPSBcIlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsInZhciBIYW5kbGViYXJzID0gcmVxdWlyZSgnaGFuZGxlYmFycy1ydW50aW1lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEhhbmRsZWJhcnMudGVtcGxhdGUoZnVuY3Rpb24gKEhhbmRsZWJhcnMsZGVwdGgwLGhlbHBlcnMscGFydGlhbHMsZGF0YSkge1xuICB0aGlzLmNvbXBpbGVySW5mbyA9IFs0LCc+PSAxLjAuMCddO1xuaGVscGVycyA9IHRoaXMubWVyZ2UoaGVscGVycywgSGFuZGxlYmFycy5oZWxwZXJzKTsgZGF0YSA9IGRhdGEgfHwge307XG4gIHZhciBidWZmZXIgPSBcIlwiLCBzdGFjazEsIHN0YWNrMiwgZnVuY3Rpb25UeXBlPVwiZnVuY3Rpb25cIiwgZXNjYXBlRXhwcmVzc2lvbj10aGlzLmVzY2FwZUV4cHJlc3Npb247XG5cblxuICBidWZmZXIgKz0gXCI8aDE+XCJcbiAgICArIGVzY2FwZUV4cHJlc3Npb24oKChzdGFjazEgPSAoKHN0YWNrMSA9ICgoc3RhY2sxID0gZGVwdGgwLnNvbmcpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEubWV0YSkpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEudGl0bGUpKSx0eXBlb2Ygc3RhY2sxID09PSBmdW5jdGlvblR5cGUgPyBzdGFjazEuYXBwbHkoZGVwdGgwKSA6IHN0YWNrMSkpXG4gICAgKyBcIjwvaDE+XFxuPGgyPmJ5IFwiXG4gICAgKyBlc2NhcGVFeHByZXNzaW9uKCgoc3RhY2sxID0gKChzdGFjazEgPSAoKHN0YWNrMSA9IGRlcHRoMC5zb25nKSxzdGFjazEgPT0gbnVsbCB8fCBzdGFjazEgPT09IGZhbHNlID8gc3RhY2sxIDogc3RhY2sxLm1ldGEpKSxzdGFjazEgPT0gbnVsbCB8fCBzdGFjazEgPT09IGZhbHNlID8gc3RhY2sxIDogc3RhY2sxLmF1dGhvcikpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKSlcbiAgICArIFwiPC9oMj5cXG48ZGl2IGNsYXNzPVxcXCJzb25nLXRleHQgbXVsdGljb2x1bW5cXFwiPlwiO1xuICBzdGFjazIgPSAoKHN0YWNrMSA9ICgoc3RhY2sxID0gZGVwdGgwLnNvbmcpLHN0YWNrMSA9PSBudWxsIHx8IHN0YWNrMSA9PT0gZmFsc2UgPyBzdGFjazEgOiBzdGFjazEudG9faHRtbCkpLHR5cGVvZiBzdGFjazEgPT09IGZ1bmN0aW9uVHlwZSA/IHN0YWNrMS5hcHBseShkZXB0aDApIDogc3RhY2sxKTtcbiAgaWYoc3RhY2syIHx8IHN0YWNrMiA9PT0gMCkgeyBidWZmZXIgKz0gc3RhY2syOyB9XG4gIGJ1ZmZlciArPSBcIjwvZGl2PlxcblwiO1xuICByZXR1cm4gYnVmZmVyO1xuICB9KTtcbiIsInNvbmdzICAgICA9IHJlcXVpcmUgJy4uL3NvbmdzLmNvZmZlZSdcbnUydSAgICAgID0gcmVxdWlyZSAnLi4vLi4vaGVscGVycy91MnUuY29mZmVlJ1xue3JlbmRlcn0gPSByZXF1aXJlICcuLi8uLi9oZWxwZXJzL3NuaXBwZXRzLmNvZmZlZSdcbnJvdXRlciAgID0gcmVxdWlyZSAnLi4vLi4vcm91dGVyL3JvdXRlci5jb2ZmZWUnXG5cbiMgVE9ETyBwYXJzaW5nIHNvbmdzIHNob3VsZCBwcm9iYWJseSBiZSBzb21ld2hlcmUgZWxzZSAtLSByZWZhY3RvciFcblxuZXhwb3J0cy5oYW5kbGVyID0gKHVybCkgLT5cbiAgICBpZiBzb25ncy5zaXplKCkgPT0gMCB0aGVuIHJlbmRlciAnI2NvbnRlbnQnLCAocmVxdWlyZSAnLi9zaG93LWxpc3QuaGJzJyksIHtub19zb25nczogdHJ1ZX07IHJldHVyblxuICAgIHVybCA9IGRlY29kZVVSSUNvbXBvbmVudCB1cmxcbiAgICBjX3VybCA9IHUydSB1cmwucmVwbGFjZSgvXFwvKy9nLCAnLycpLnJlcGxhY2UgL15cXC8rLywgJycgICMgY2Fub25pY2FsaXplIHVybCAoKyBtYWtlIGl0IGxvb2sgbGlrZSBvdXIgZGIga2V5IDpEKVxuICAgIGlmIGNfdXJsICE9IHVybFxuICAgICAgICByb3V0ZXIucmVkaXJlY3QgY191cmxcbiAgICBlbHNlXG4gICAgICAgIHF1ZXJ5ID0gdXJsLnJlcGxhY2UgL1xcLyskLywgJycgICMgdHJpbSAnLydcbiAgICAgICAgc29uZ3NfbGlzdCA9IHNvbmdzLmZpbmQgcXVlcnlcbiAgICAgICAgY29uc29sZS5kZWJ1ZyAncXVlcnkgcmVzdWx0czonLCBzb25nc19saXN0XG4gICAgICAgIGlmIHNvbmdzX2xpc3QubGVuZ3RoID09IDFcbiAgICAgICAgICAgIGNfdXJsID0gc29uZ3NfbGlzdFswXS5rZXlcbiAgICAgICAgICAgIGlmIGNfdXJsPyBhbmQgdXJsICE9IGNfdXJsXG4gICAgICAgICAgICAgICAgcm91dGVyLnJlZGlyZWN0IGNfdXJsXG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICBzb25nID0gc29uZ3NfbGlzdFswXVxuICAgICAgICAgICAgdGVtcGxhdGUgPSByZXF1aXJlICcuL3Nob3ctc2luZ2xlLmhicydcbiAgICAgICAgICAgIGNvbnRleHQgPSB7IHF1ZXJ5LCBzb25nIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGVtcGxhdGUgPSByZXF1aXJlICcuL3Nob3ctbGlzdC5oYnMnXG4gICAgICAgICAgICBjb250ZXh0ID0geyBxdWVyeSwgc29uZ3NfbGlzdCB9XG4gICAgICAgIHJlbmRlciAnI2NvbnRlbnQnLCB0ZW1wbGF0ZSwgY29udGV4dFxuXG4iLCJ2YXIgSGFuZGxlYmFycyA9IHJlcXVpcmUoJ2hhbmRsZWJhcnMtcnVudGltZScpO1xubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGViYXJzLnRlbXBsYXRlKGZ1bmN0aW9uIChIYW5kbGViYXJzLGRlcHRoMCxoZWxwZXJzLHBhcnRpYWxzLGRhdGEpIHtcbiAgdGhpcy5jb21waWxlckluZm8gPSBbNCwnPj0gMS4wLjAnXTtcbmhlbHBlcnMgPSB0aGlzLm1lcmdlKGhlbHBlcnMsIEhhbmRsZWJhcnMuaGVscGVycyk7IGRhdGEgPSBkYXRhIHx8IHt9O1xuICBcblxuXG4gIHJldHVybiBcIjxkaXYgaWQ9XFxcIndyYXBwZXJcXFwiPlxcblx0PG5hdiBpZD1cXFwibWFpbm5hdlxcXCI+XFxuXHRcdDxkaXYgaWQ9XFxcIm1haW5uYXYtaW5zaWRlXFxcIj5cXG5cdFx0XHQ8ZGl2IGlkPVxcXCJtZW51LWJ1dHRvbi13cmFwcGVyXFxcIj48YnV0dG9uIGlkPVxcXCJtZW51LWJ1dHRvblxcXCI+YWRkPC9idXR0b24+PC9kaXY+XFxuXHRcdFx0PGRpdiBpZD1cXFwic2VhcmNoLXdyYXBwZXJcXFwiPjxpbnB1dCBpZD1cXFwic2VhcmNoXFxcIiB0eXBlPVxcXCJzZWFyY2hcXFwiIHBsYWNlaG9sZGVyPVxcXCJzZWFyY2hcXFwiIGluY3JlbWVudGFsIC8+PC9kaXY+XFxuXHRcdDwvZGl2Plxcblx0PC9uYXY+XFxuXFxuXHQ8ZGl2IGlkPVxcXCJjb250ZW50XFxcIj48L2Rpdj5cXG48L2Rpdj5cXG5cIjtcbiAgfSk7XG4iLCJleHBvcnRzLmluaXQgPSAtPlxuXHRkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IChyZXF1aXJlICcuL2Nocm9tZS5oYnMnKSgpXG5cdChyZXF1aXJlICcuLi9zb25ncy91aS9zZWFyY2guY29mZmVlJykuaW5pdCgpXG4iLCJ7dXJscGF0dGVybn0gPSByZXF1aXJlICcuL3JvdXRlci9yb3V0ZXIuY29mZmVlJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgICB1cmxwYXR0ZXJuICdfYWRkJywgKHJlcXVpcmUgJy4vc29uZ3MvdWkvYWRkX3NvbmcuY29mZmVlJykuaGFuZGxlclxuICAgIHVybHBhdHRlcm4gJy4qJywgICAocmVxdWlyZSAnLi9zb25ncy91aS9zaG93LmNvZmZlZScpLmhhbmRsZXJcbl1cbiJdfQ==
;