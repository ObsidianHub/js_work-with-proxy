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
