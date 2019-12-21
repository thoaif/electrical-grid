import Bus from './bus'
import SubStation from './sub-station'
import Switch from './switch'
import { ConnectableWithError } from './errors'

describe('constructor', () => {
  it('defaults', () => {
    const parent = new SubStation('parent')
    const bus = new Bus('bus', parent)
    expect(bus.name).toBe('bus')
    expect(bus.parent).toBe(parent)
    expect(bus.maxConnections).toBe(3)
    expect(bus.connections).toStrictEqual([])
    expect(bus.closed).toBe(true)
  })

  it('non defaults', () => {
    const parent = new SubStation('parent')
    const bus = new Bus('bus', parent, 4)
    expect(bus.name).toBe('bus')
    expect(bus.parent).toBe(parent)
    expect(bus.connections).toStrictEqual([])
    expect(bus.maxConnections).toBe(4)
    expect(bus.closed).toBe(true)
  })
})

describe('isConnectableWithErrors', () => {
  it('no errors', () => {
    const parent = new SubStation('parent')
    const sw1 = new Switch('sw1')
    const bus = new Bus('bus', parent, 4)
    expect(bus.isConnectableWithErrors(sw1)).toStrictEqual([])
  })

  it('with error', () => {
    const parent = new SubStation('parent')
    const bus = new Bus('bus', parent, 4)
    const otherBus = new Bus('otherBus', parent, 4)
    expect(bus.isConnectableWithErrors(otherBus)).toStrictEqual([
      new ConnectableWithError(bus, otherBus),
    ])
  })
})
