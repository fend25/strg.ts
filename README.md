### strg.ts
Simple localStorage, sssionStorage and cookie operating library with the single API.
It fully supports regular js.

Actually, it is a modern and well-typed version of [strg.js](https://github.com/fend25/strg.js)

#### Getting started
with yarn:
```bash
yarn add strg.ts
```             
or with npm:
```bash
npm i strg.ts
```

#### API
So, the `strg.ts` contains three objects with single API:<br>
`localstore` - localStorage wrapper<br>
`sessionstore` - sessionStorage wrapper<br>
`cookiestore` - cookie wrapper<br>
and the fourth object `storage`, that is `localstore` if localStorage is supported or `cookiestore` otherwise.
bonus: fifth object `available` with flags of available APIs: 
```typescript
interface Available {
  local: boolean,
  session: boolean,
  cookie: boolean
}
```

Each of APIs has 5 functions:<br>
`set(key, value)`: sets key-value pair. JSON is supported in values<br>
`get(key)`: returns just value for the key. returns `undefined` if no value found<br>
`getAll()`: returns object with all key-value pairs. JSON is parsed. returns `{}` on empty store<br>
`remove(key)`: removes key. returns `undefined`<br>
`removeAll()`: remove all key-value pairs, returns `undefined`<br>

In case of `cookiestore`, function `set` takes five params: key, value, expires, path, secure<br>
`expires`: Date, number or string, that can be used in `Date` constructor<br>
`path`: string, path for cookie<br>
`secure`: bool, secure flag for cookie<br>
Also, all objects contain two additional fields:<br>
`s`: _Storage_ object or _document.cookie_, for example: `window.localStorage`<br>
`type`: string, storage type, for example `'localStorage'`
#### Examples
```javascript
storage.set('a', 1); // 1
storage.set('b', {c: [1, '2', {d: 3}]})); // {"c":[1,"2",{"d":3}]}
storage.getAll(); // {"a":1,"b":{"c":[1,"2",{"d":3}]}}

storage.set('c', 'some string'); // "some string"
storage.remove('b'); // undefined
storage.getAll(); // {"a":1,"c":"some string"}

storage.removeAll(); // undefined
storage.getAll(); // {}
```          

#### Tests
```bash
yarn test                                   
# serve test  
```
And then just open test/test.html with browser (with serve it will be http://localhost:5000/test)

#### License
MIT
