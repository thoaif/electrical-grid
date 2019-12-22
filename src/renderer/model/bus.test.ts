import Bus from '@/renderer/model/bus'

describe('constructor', () => {
  it('defaults', () => {
    const bus = new Bus('bus')
    expect(bus.name).toBe('bus')
    expect(bus.maxConnections).toBe(3)
    expect(bus.connections).toStrictEqual([])
    expect(bus.closed).toBe(true)
  })

  it('non defaults', () => {
    const bus = new Bus('bus', 4)
    expect(bus.name).toBe('bus')
    expect(bus.connections).toStrictEqual([])
    expect(bus.maxConnections).toBe(4)
    expect(bus.closed).toBe(true)
  })
})
