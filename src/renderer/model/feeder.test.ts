import Feeder from '@/renderer/model/feeder'

describe('constructor', () => {
  it('defaults', () => {
    const feeder = new Feeder('feeder')
    expect(feeder.name).toBe('feeder')
    expect(feeder.maxConnections).toBe(1)
    expect(feeder.connections).toStrictEqual([])
    expect(feeder.closed).toBe(true)
  })
})
