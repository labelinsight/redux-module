import ReduxModule from './index'

const inspect = (object) => JSON.parse(JSON.stringify(object))

describe('ReduxModule', () => {
  describe('constructor', () => {
    it('should create empty module instance', () => {
      const app = new ReduxModule('app')

      expect(inspect(app)).toEqual({
        creators: {},
        handlers: {},
        name: 'app',
        types: {},
      })
    })
  })

  describe('module', () => {
    const app = new ReduxModule('app')

    it('should create namespaced submodule', () => {
      expect(inspect(app.module('sub'))).toEqual({
        creators: {},
        handlers: {},
        name: 'app/sub',
        types: {},
      })
    })
  })

  describe('create', () => {
    let app

    beforeEach(() => {
      app = new ReduxModule('app')
    })

    it('should suply default payload', () => {
      const foo = app.create('foo')

      expect(foo()).toEqual({
        type: 'app/foo',
      })
    })

    it('should include only supplied args', () => {
      const foo = app.create('foo', 'a', 'b')

      expect(foo(1, 2, 3, 4, 5, 6)).toEqual({
        type: 'app/foo',
        a: 1,
        b: 2,
      })
    })

    it('should create reducer handle shorthand', () => {
      const foo = app.create('foo', ['a', 'b'])
      const action = foo(1, 2)

      expect(action).toEqual({
        type: 'app/foo',
        a: 1,
        b: 2,
      })

      expect(app.handlers['app/foo'](undefined, action)).toEqual({
        a: 1,
        b: 2,
      })
    })
  })

  describe('reducer', () => {
    let app
    let reducer

    beforeEach(() => {
      app = new ReduxModule('app')
      app.create('foo')
      app.create('bar', 'a')
      app.create('baz', ['b'])
      app.create('quux', () => 'NEW_STATE')
      reducer = app.reducer()
    })

    it('should call handler for type', () => {
      const state = { z: 0 }
      const action = app.creators.foo()
      const result = reducer(state, action)

      expect(result).toBe(state)
      expect(result).toEqual({ z: 0 })
    })

    it('should ignore creator arg that doesnt have handler', () => {
      const state = { a: 0 }
      const action = app.creators.bar(999)
      const result = reducer(state, action)

      expect(result).toBe(state)
      expect(result).toEqual({ a: 0 })
    })

    it('should set state from shorthand', () => {
      const state = { b: 0 }
      const action = app.creators.baz(999)
      const result = reducer(state, action)

      expect(result).not.toBe(state)
      expect(result).toEqual({ b: 999 })
    })

    it('should use reducer handle', () => {
      const state = { a: 0, b: 1, c: 2 }
      const action = app.creators.quux()
      const result = reducer(state, action)

      expect(result).not.toBe(state)
      expect(result).toEqual('NEW_STATE')
    })
  })
})
