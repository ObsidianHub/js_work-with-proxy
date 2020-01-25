// Wrapper
const withDefaultValue = (target, defaultValue = 0) => {
  return new Proxy(target, {
    get: (obj, prop) => (prop in obj ? obj[prop] : defaultValue)
  });
};

const position = withDefaultValue(
  {
    x: 24,
    y: 42
  },
  0
);

// Hidden properties
const withHiddenProps = (target, prefix = "_") => {
  return new Proxy(target, {
    has: (obj, prop) => prop in obj && !prop.startsWith(prefix),
    ownKeys: obj => Reflect.ownKeys(obj).filter(p => !p.startsWith(prefix)),
    get: (obj, prop, receiver) => (prop in receiver ? obj[prop] : void 0)
  });
};

const data = withHiddenProps({
  name: "Denny",
  age: 26,
  _uid: "123123"
});

// Optimization
const IndexedArray = new Proxy(Array, {
  construct(target, [args]) {
    const index = {};
    args.forEach(item => (index[item.id] = item));

    return new Proxy(new target(...args), {
      get(arr, prop) {
        switch (prop) {
          case "push":
            return item => {
              index[item.id] = item;
              arr[prop].call(arr, item);
            };
          case "fingById":
            return id => index[id];
          default:
            return arr[prop];
        }
      }
    });
  }
});

const users = new IndexedArray([
  { id: 11, name: "Denny", job: "Fullstack", age: 26 },
  { id: 22, name: "Katya", job: "Artist", age: 23 },
  { id: 33, name: "Nazar", job: "Lawyer", age: 26 },
  { id: 44, name: "Misha", job: "Programmer", age: 26 }
]);
