import * as Cookies from 'js-cookie'

export interface Strg {
  store: Storage

  set<T = any>(key: string, val: T): T

  get<T = any>(key: string): T | string | null

  remove(key: string): void

  removeAll(): void

  getAll(): any
}

abstract class AbstractStore implements Strg {
  abstract store: Storage
  name: string

  constructor(name: string) {
    this.name = name
  }


  set<T>(key: string, val: T): T {
    this.store.setItem(key, JSON.stringify(val))
    return val
  }

  get<T = any>(key: string): T | string | null {
    const value = this.store.getItem(key)
    if (typeof value != 'string') {
      return null
    }
    try {
      return JSON.parse(value) as T
    } catch (e) {
      return value
    }
  }

  getWithDefault<T = any>(key: string, defaultValue: T): T {
    const value = this.get(key)

    if (value == null) return defaultValue
    else {
      if (typeof defaultValue === 'string') return value as T
      else {
        if (typeof value === 'string') return defaultValue
        else return value
      }
    }
  }

  remove(key: string): void {
    this.store.removeItem(key)
  }

  removeAll(): void {
    this.store.clear()
  }

  getAll(): any {
    const res: any = {}

    for (let i = 0; i < this.store.length; i++) {
      const _key = this.store.key(i)
      if (!_key) continue
      const key = _key.toString()
      res[key] = this.get(key)
    }

    return res
  }
}

class Localstore extends AbstractStore {
  store = window.localStorage
}

class Sessionstore extends AbstractStore {
  store = window.sessionStorage
}


type Expires = Date | number

interface CookiestoreSetConfig {
  expires?: Expires
  path?: string
  secure?: boolean
}

const expiresIsOk = (expires?: Expires): expires is Expires => {
  if (typeof expires === 'number' && !isNaN(expires)) return true
  else return !!expires
}

const processValue = <T>(value: string): T | string | null => {
  if (value.substring(0, 1) === '{') {
    try {
      return JSON.parse(value) as T
    } catch (e) {
      return value
    }
  }
  return (value !== 'undefined') ? decodeURIComponent(value) : null
}

class Cookiestore extends AbstractStore {
  store = null as any as Storage

  set<T = any>(name: string, value: T, config?: CookiestoreSetConfig): T {
    if (!config) config = {}

    const expires = config.expires || new Date(Date.now() + 20 * 365 * (24 * 60 * 60 * 1000))
    const path = config.path || '/'
    const secure = config.secure || false

    const _config = {expires, path, secure}

    const valueToUse = (value !== undefined && typeof (value) === "object")
      ? JSON.stringify(value)
      : value
    Cookies.set(name, valueToUse as string, _config)

    return value
  }

  get<T = any>(name: string): T | string | null {
    const result = Cookies.get(name)
    if (result) return processValue<T>(result)
    else return null
  }

  getAll() {
    const result: any = {}
    for (let name in Cookies.get()) {
      result[name] = this.get(name)
    }
    return result
  }

  remove(name: string, path?: string) {
    const config: CookiestoreSetConfig = {}
    if (path) config.path = path
    Cookies.remove(name, config)
    return null
  }

  removeAll() {
    for (let name in Cookies.get()) {
      Cookies.remove(name)
    }
  }
}

class DummyStore extends AbstractStore {
  store = null as any as Storage
}


const storageAvailable = (type: string) => {
  let storage: any
  try {
    storage = (window as any)[type]
    let x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    const errCodes = {nonFf: 22, ff: 1024}
    const errNames = {nonFf: 'QuotaExceededError', ff: 'NS_ERROR_DOM_QUOTA_REACHED'}

    // test name field too, because code might not be present
    const isProperException = e.code === errCodes.nonFf ||
      e.code === errCodes.ff ||
      e.name === errNames.nonFf ||
      e.name === errNames.ff

    // acknowledge QuotaExceededError only if there's something already stored
    return e instanceof DOMException && (isProperException) && storage.length !== 0
  }
}

const cookieAvailable = () => {
  // Quick test if browser has cookieEnabled host property
  if (!navigator.cookieEnabled) return false
  // Create cookie
  document.cookie = "cookietest=1"
  let res = document.cookie.indexOf("cookietest=") != -1
  // Delete cookie
  document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT"
  return res
}

const dummyStore = new DummyStore('dummy')

let localStore: Strg = dummyStore as AbstractStore
let sessionStore: Strg = dummyStore as AbstractStore
let cookieStore: Strg = dummyStore as AbstractStore
let storage: Strg = dummyStore as AbstractStore

const available = {
  local: false,
  session: false,
  cookie: false
}

if (typeof window !== 'undefined') {
  if (available.cookie = cookieAvailable()) {
    cookieStore = new Cookiestore('cookie')
    storage = cookieStore
  }

  if (available.local = storageAvailable('localStorage')) {
    localStore = new Localstore('localStorage')
    storage = localStore
  }

  if (available.session = storageAvailable('sessionStorage')) {
    sessionStore = new Sessionstore('sessionStorage')
  }

  if (!process.env.isProd) {
    (window as any).storage = storage
  }
}

export {localStore, sessionStore, cookieStore, storage, available}
