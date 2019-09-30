declare module 'strg.ts' {
  export interface Strg {
    store: Storage

    set<T = any>(key: string, val: T): T

    get<T = any>(key: string): T | string | null

    remove(key: string): void

    removeAll(): void

    getAll(): any
  }

  type Expires = Date | number
  
  export interface CookiestoreSetConfig {
    expires?: Expires
    path?: string
    secure?: boolean
  }


  export const localStore: Strg
  export const sessionStore: Strg
  export const cookieStore: Strg & {
    set<T = any>(name: string, value: T, config?: CookiestoreSetConfig): T
  }
  export const storage: Strg
  export const available: {
    local: boolean,
    session: boolean,
    cookie: boolean
  }
}