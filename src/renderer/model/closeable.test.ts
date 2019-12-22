import Closeable from '@/renderer/model/closeable'
import { ClosableLockedError } from '@/renderer/model/errors'

class CloseableSubClass extends Closeable {}

describe('constructor', () => {
  it('defaults', () => {
    const sw = new CloseableSubClass('sw')
    expect(sw.name).toBe('sw')
    expect(sw.maxConnections).toBe(2)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toBe(true)
    expect(sw.locked).toBe(false)
  })

  it('non defaults', () => {
    const sw = new CloseableSubClass('sw', 3, false, true)
    expect(sw.name).toBe('sw')
    expect(sw.maxConnections).toBe(3)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toBe(false)
    expect(sw.locked).toBe(true)
  })
})

describe('close', () => {
  it('non locked - open-to-close', () => {
    const sw = new CloseableSubClass('sw', 2, false)
    sw.close()
    expect(sw.closed).toBe(true)
  })

  it('locked - open-to-close', () => {
    const sw = new CloseableSubClass('sw', 2, false, true)
    expect(() => sw.close()).toThrowError(new ClosableLockedError(sw))
  })

  it('locked - closed-to-close', () => {
    const sw = new CloseableSubClass('sw', 2, true, true)
    sw.close()
    expect(sw.closed).toBe(true)
  })

  it('override locked', () => {
    const sw = new CloseableSubClass('sw', 2, false, true)
    sw.close(true)
    expect(sw.closed).toBe(true)
  })
})

describe('open', () => {
  it('non locked - close-to-open', () => {
    const sw = new CloseableSubClass('sw', 2, true)
    sw.open()
    expect(sw.closed).toBe(false)
  })

  it('locked - close-to-open', () => {
    const sw = new CloseableSubClass('sw', 2, true, true)
    expect(() => sw.open()).toThrowError(new ClosableLockedError(sw))
  })

  it('locked - open-to-open', () => {
    const sw = new CloseableSubClass('sw', 2, false, true)
    sw.open()
    expect(sw.closed).toBe(false)
  })

  it('override locked', () => {
    const sw = new CloseableSubClass('sw', 2, true, true)
    sw.open(true)
    expect(sw.closed).toBe(false)
  })
})

describe('locked', () => {
  it('basic change', () => {
    const sw = new CloseableSubClass('sw')
    sw.locked = true
    expect(sw.locked).toBe(true)
  })
})
