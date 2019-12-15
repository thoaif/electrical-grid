import { SwitchLockedError } from './erros'
import Switch from './switch'

describe('constructor', () => {
  it('defaults', () => {
    const sw = new Switch('sw')
    expect(sw.ref).toBe('sw')
    expect(sw.maxConnections).toBe(2)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toStrictEqual(true)
    expect(sw.locked).toStrictEqual(false)
  })

  it('non defaults', () => {
    const sw = new Switch('sw', false, true)
    expect(sw.ref).toBe('sw')
    expect(sw.maxConnections).toBe(2)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toStrictEqual(false)
    expect(sw.locked).toStrictEqual(true)
  })
})

describe('setClosed', () => {
  it('non locked', () => {
    const sw = new Switch('sw')
    sw.setClosed(false)
    expect(sw.closed).toStrictEqual(false)
  })

  it('locked', () => {
    const sw = new Switch('sw', true, true)
    expect(() => sw.setClosed(false)).toThrowError(new SwitchLockedError(sw))
  })

  it('override locked', () => {
    const sw = new Switch('sw', true, true)
    sw.setClosed(false, true)
    expect(sw.closed).toStrictEqual(false)
  })
})

describe('setLocked', () => {
  it('basic change', () => {
    const sw = new Switch('sw')
    sw.setLocked(true)
    expect(sw.locked).toStrictEqual(true)
  })
})
