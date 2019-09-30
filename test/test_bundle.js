(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Cookies = require("js-cookie");
var AbstractStore = /** @class */ (function () {
    function AbstractStore(name) {
        this.name = name;
    }
    AbstractStore.prototype.set = function (key, val) {
        this.store.setItem(key, JSON.stringify(val));
        return val;
    };
    AbstractStore.prototype.get = function (key) {
        var value = this.store.getItem(key);
        if (typeof value != 'string') {
            return null;
        }
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    };
    AbstractStore.prototype.getWithDefault = function (key, defaultValue) {
        var value = this.get(key);
        if (value == null)
            return defaultValue;
        else {
            if (typeof defaultValue === 'string')
                return value;
            else {
                if (typeof value === 'string')
                    return defaultValue;
                else
                    return value;
            }
        }
    };
    AbstractStore.prototype.remove = function (key) {
        this.store.removeItem(key);
    };
    AbstractStore.prototype.removeAll = function () {
        this.store.clear();
    };
    AbstractStore.prototype.getAll = function () {
        var res = {};
        for (var i = 0; i < this.store.length; i++) {
            var _key = this.store.key(i);
            if (!_key)
                continue;
            var key = _key.toString();
            res[key] = this.get(key);
        }
        return res;
    };
    return AbstractStore;
}());
var Localstore = /** @class */ (function (_super) {
    __extends(Localstore, _super);
    function Localstore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = window.localStorage;
        return _this;
    }
    return Localstore;
}(AbstractStore));
var Sessionstore = /** @class */ (function (_super) {
    __extends(Sessionstore, _super);
    function Sessionstore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = window.sessionStorage;
        return _this;
    }
    return Sessionstore;
}(AbstractStore));
var expiresIsOk = function (expires) {
    if (typeof expires === 'number' && !isNaN(expires))
        return true;
    else
        return !!expires;
};
var processValue = function (value) {
    if (value.substring(0, 1) === '{') {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return value;
        }
    }
    return (value !== 'undefined') ? decodeURIComponent(value) : null;
};
var Cookiestore = /** @class */ (function (_super) {
    __extends(Cookiestore, _super);
    function Cookiestore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = null;
        return _this;
    }
    Cookiestore.prototype.set = function (name, value, config) {
        if (!config)
            config = {};
        var expires = config.expires || new Date(Date.now() + 20 * 365 * (24 * 60 * 60 * 1000));
        var path = config.path || '/';
        var secure = config.secure || false;
        var _config = { expires: expires, path: path, secure: secure };
        var valueToUse = (value !== undefined && typeof (value) === "object")
            ? JSON.stringify(value)
            : value;
        Cookies.set(name, valueToUse, _config);
        return value;
    };
    Cookiestore.prototype.get = function (name) {
        var result = Cookies.get(name);
        if (result)
            return processValue(result);
        else
            return null;
    };
    Cookiestore.prototype.getAll = function () {
        var result = {};
        for (var name_1 in Cookies.get()) {
            result[name_1] = this.get(name_1);
        }
        return result;
    };
    Cookiestore.prototype.remove = function (name, path) {
        var config = {};
        if (path)
            config.path = path;
        Cookies.remove(name, config);
        return null;
    };
    Cookiestore.prototype.removeAll = function () {
        for (var name_2 in Cookies.get()) {
            Cookies.remove(name_2);
        }
    };
    return Cookiestore;
}(AbstractStore));
var DummyStore = /** @class */ (function (_super) {
    __extends(DummyStore, _super);
    function DummyStore() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = null;
        return _this;
    }
    return DummyStore;
}(AbstractStore));
var storageAvailable = function (type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        var errCodes = { nonFf: 22, ff: 1024 };
        var errNames = { nonFf: 'QuotaExceededError', ff: 'NS_ERROR_DOM_QUOTA_REACHED' };
        // test name field too, because code might not be present
        var isProperException = e.code === errCodes.nonFf ||
            e.code === errCodes.ff ||
            e.name === errNames.nonFf ||
            e.name === errNames.ff;
        // acknowledge QuotaExceededError only if there's something already stored
        return e instanceof DOMException && (isProperException) && storage.length !== 0;
    }
};
var cookieAvailable = function () {
    // Quick test if browser has cookieEnabled host property
    if (!navigator.cookieEnabled)
        return false;
    // Create cookie
    document.cookie = "cookietest=1";
    var res = document.cookie.indexOf("cookietest=") != -1;
    // Delete cookie
    document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
    return res;
};
var dummyStore = new DummyStore('dummy');
var localStore = dummyStore;
exports.localStore = localStore;
var sessionStore = dummyStore;
exports.sessionStore = sessionStore;
var cookieStore = dummyStore;
exports.cookieStore = cookieStore;
var storage = dummyStore;
exports.storage = storage;
var available = {
    local: false,
    session: false,
    cookie: false
};
exports.available = available;
if (typeof window !== 'undefined') {
    if (available.cookie = cookieAvailable()) {
        exports.cookieStore = cookieStore = new Cookiestore('cookie');
        exports.storage = storage = cookieStore;
    }
    if (available.local = storageAvailable('localStorage')) {
        exports.localStore = localStore = new Localstore('localStorage');
        exports.storage = storage = localStore;
    }
    if (available.session = storageAvailable('sessionStorage')) {
        exports.sessionStore = sessionStore = new Sessionstore('sessionStorage');
    }
    if (!process.env.isProd) {
        window.storage = storage;
    }
}

}).call(this,require('_process'))
},{"_process":2,"js-cookie":1}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var strg = require("../strg");
window.mainTest = function mainTest() {
    var storages = [
        { store: strg.localStore, tests: [] },
        { store: strg.sessionStore, tests: [] },
        { store: strg.cookieStore, tests: [] }
    ];
    for (var _i = 0, storages_1 = storages; _i < storages_1.length; _i++) {
        var storage = storages_1[_i];
        var tests = storage.tests;
        var store = storage.store;
        store.removeAll();
        store.set('a', '1');
        tests.push({ ok: equals(store.get('a'), '1'), name: "simple set and get" });
        store.set('b', { a: 1, b: [1, '2', { c: 3 }], d: { e: { g: { h: [5, 6, 7] } } } });
        tests.push({ ok: equals(store.get('b'), { a: 1, b: [1, '2', { c: 3 }], d: { e: { g: { h: [5, 6, 7] } } } }), name: "complex object set and get" });
        tests.push({ ok: equals(store.getAll(), { "a": "1", "b": { "a": 1, "b": [1, "2", { "c": 3 }], "d": { "e": { "g": { "h": [5, 6, 7] } } } } }), name: "getAll()" });
        store.remove('b');
        tests.push({ ok: equals(store.getAll(), { 'a': '1' }), name: "remove()" });
        store.set('c', 'abc');
        tests.push({ ok: equals(store.getAll(), { 'a': '1', 'c': 'abc' }), name: "simple set, again" });
        store.removeAll();
        tests.push({ ok: equals(store.getAll(), {}), name: "removeAll();" });
    }
    return storages;
};
function equals(x, y) {
    if (x === y)
        return true;
    // if both x and y are null or undefined and exactly the same
    if (!(x instanceof Object) || !(y instanceof Object))
        return false;
    // if they are not strictly equal, they both need to be Objects
    if (x.constructor !== y.constructor)
        return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    for (var p in x) {
        if (!x.hasOwnProperty(p))
            continue;
        // other properties were tested using x.constructor === y.constructor
        if (!y.hasOwnProperty(p))
            return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined
        if (x[p] === y[p])
            continue;
        // if they have the same strict value or identity then they are equal
        if (typeof ([p]) !== "object")
            return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (!equals(x[p], y[p]))
            return false;
        // Objects and Arrays must be tested recursively
    }
    for (p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p))
            return false;
        // allows x[ p ] to be set to undefined
    }
    return true;
}

},{"../strg":3}]},{},[4]);
