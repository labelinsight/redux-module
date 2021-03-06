export default class ReduxModule {
  constructor(name) {
    this.name = name
    this.types = {}
    this.creators = {}
    this.handlers = {}
  }

  module(name) {
    return new ReduxModule(`${this.name}/${name}`)
  }

  create(type, ...rest) {
    const first = rest[0]
    const last = rest[rest.length - 1]
    const prefixedType = `${this.name}/${type}`
    let paths

    this.types[type] = prefixedType

    if (Array.isArray(first)) {
      paths = first
      this.handlers[prefixedType] = createSetter(first)
    } else if (typeof last === 'function') {
      this.handlers[prefixedType] = last
      paths = rest.length > 1 ? rest.slice(0, -1) : []
    } else {
      paths = rest.length ? rest : []
    }

    const creator = makeActionCreator(prefixedType, paths)
    this.creators[type] = creator

    return creator
  }

  reducer(initialState = {}) {
    return (state = initialState, action) =>
      this.handlers[action.type]
        ? this.handlers[action.type](state, action)
        : state
  }
}

function createSetter(paths) {
  return (state, action) =>
    paths.reduce(
      (nextState, path) => ({
        ...nextState,
        [path]: action[path],
      }),
      state
    )
}

function makeActionCreator(type, paths) {
  return (...values) => ({
    type,
    ...paths.reduce((acc, path, index) => {
      acc[path] = values[index]

      return acc
    }, {}),
  })
}
