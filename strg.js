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
