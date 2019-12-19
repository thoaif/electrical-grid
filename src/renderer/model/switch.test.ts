import { SwitchLockedError } from './errors'
import Switch from './switch'

describe('constructor', () => {
  it('defaults', () => {
    const sw = new Switch('sw')
    expect(sw.ref).toBe('sw')
    expect(sw.getMaxConnections()).toBe(2)
    expect(sw.getConnections()).toStrictEqual([])
    expect(sw.isClosed()).toStrictEqual(true)
    expect(sw.isLocked()).toStrictEqual(false)
  })

  it('non defaults', () => {
    const sw = new Switch('sw', false, true)
    expect(sw.ref).toBe('sw')
    expect(sw.getMaxConnections()).toBe(2)
    expect(sw.getConnections()).toStrictEqual([])
    expect(sw.isClosed()).toStrictEqual(false)
    expect(sw.isLocked()).toStrictEqual(true)
  })
})

describe('setClosed', () => {
  it('non locked', () => {
    const sw = new Switch('sw')
    sw.setClosed(false)
    expect(sw.isClosed()).toStrictEqual(false)
  })

  it('locked', () => {
    const sw = new Switch('sw', true, true)
    expect(() => sw.setClosed(false)).toThrowError(new SwitchLockedError(sw))
  })

  it('override locked', () => {
    const sw = new Switch('sw', true, true)
    sw.setClosed(false, true)
    expect(sw.isClosed()).toStrictEqual(false)
  })
})

describe('setLocked', () => {
  it('basic change', () => {
    const sw = new Switch('sw')
    sw.setLocked(true)
    expect(sw.isLocked()).toStrictEqual(true)
  })
})

describe('isConnectableWithErrors', () => {
  it('valid', () => {
    const sw = new Switch('sw')
  })

  it('non defaults', () => {
    const sw = new Switch('sw', false, true)
  })
})
