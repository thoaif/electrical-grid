import Cable from '@/renderer/model/cable'

describe('constructor', () => {
  it('defaults', () => {
    const cable = new Cable('cable')
    expect(cable.name).toBe('cable')
    expect(cable.maxConnections).toBe(2)
    expect(cable.connections).toStrictEqual([])
    expect(cable.closed).toBe(true)
  })
})
