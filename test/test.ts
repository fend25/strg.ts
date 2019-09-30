import * as strg from '../strg'

;(window as any).mainTest = function mainTest() {
  const storages = [
    {store: strg.localStore, tests: [] as any[]},
    {store: strg.sessionStore, tests: [] as any[]},
    {store: strg.cookieStore, tests: [] as any[]}
  ];
  for (const storage of storages) {
    const tests = storage.tests;
    const store = storage.store;
    store.removeAll();
    store.set('a', '1');
    tests.push({ok: equals(store.get('a'), '1'), name: "simple set and get"});
    store.set('b', {a:1, b:[1,'2',{c:3}], d:{e:{g:{h:[5,6,7]}}}} );
    tests.push({ok: equals(store.get('b'), {a:1, b:[1,'2',{c:3}], d:{e:{g:{h:[5,6,7]}}}}), name: "complex object set and get"});
    tests.push({ok: equals(store.getAll(), {"a":"1","b":{"a":1,"b":[1,"2",{"c":3}],"d":{"e":{"g":{"h":[5,6,7]}}}}}), name: "getAll()"});
    store.remove('b');
    tests.push({ok: equals(store.getAll(), {'a': '1'}), name: "remove()"});
    store.set('c', 'abc');
    tests.push({ok: equals(store.getAll(), {'a': '1', 'c': 'abc'}), name: "simple set, again"});
    store.removeAll();
    tests.push({ok: equals(store.getAll(), {}), name: "removeAll();"});
  }
  return storages
}

function equals(x: any, y: any) {
  if (x === y) return true;
  // if both x and y are null or undefined and exactly the same
  if (!( x instanceof Object ) || !( y instanceof Object )) return false;
  // if they are not strictly equal, they both need to be Objects
  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.
  for (var p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor
    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined
    if (x[p] === y[p]) continue;
    // if they have the same strict value or identity then they are equal
    if (typeof( [p]) !== "object") return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal
    if (!equals(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }
  for (p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
    // allows x[ p ] to be set to undefined
  }
  return true;
}
