import {
  ConnectableWithError,
  ConnectionError,
  SwitchLockedError,
} from './errors'
import Switch from './switch'
import Bus from './bus'
import SubStation from './sub-station'
import Feeder from './feeder'
import Cable from './cable'
import Connectable from './connectable'

describe('constructor', () => {
  it('defaults', () => {
    const sw = new Switch('sw')
    expect(sw.name).toBe('sw')
    expect(sw.maxConnections).toBe(2)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toBe(true)
    expect(sw.locked).toBe(false)
  })

  it('non defaults', () => {
    const sw = new Switch('sw', false, true)
    expect(sw.name).toBe('sw')
    expect(sw.maxConnections).toBe(2)
    expect(sw.connections).toStrictEqual([])
    expect(sw.closed).toBe(false)
    expect(sw.locked).toBe(true)
  })
})

describe('close', () => {
  it('non locked - open-to-close', () => {
    const sw = new Switch('sw', false)
    sw.close()
    expect(sw.closed).toBe(true)
  })

  it('locked - open-to-close', () => {
    const sw = new Switch('sw', false, true)
    expect(() => sw.close()).toThrowError(new SwitchLockedError(sw))
  })

  it('locked - closed-to-close', () => {
    const sw = new Switch('sw', true, true)
    sw.close()
    expect(sw.closed).toBe(true)
  })

  it('override locked', () => {
    const sw = new Switch('sw', false, true)
    sw.close(true)
    expect(sw.closed).toBe(true)
  })
})

describe('open', () => {
  it('non locked - close-to-open', () => {
    const sw = new Switch('sw', true)
    sw.open()
    expect(sw.closed).toBe(false)
  })

  it('locked - close-to-open', () => {
    const sw = new Switch('sw', true, true)
    expect(() => sw.open()).toThrowError(new SwitchLockedError(sw))
  })

  it('locked - open-to-open', () => {
    const sw = new Switch('sw', false, true)
    sw.open()
    expect(sw.closed).toBe(false)
  })

  it('override locked', () => {
    const sw = new Switch('sw', true, true)
    sw.open(true)
    expect(sw.closed).toBe(false)
  })
})

describe('locked', () => {
  it('basic change', () => {
    const sw = new Switch('sw')
    sw.locked = true
    expect(sw.locked).toBe(true)
  })
})

describe('isConnectableWithErrors', () => {
  const sw = new Switch('sw')

  it('valid - bus', () => {
    const subStation = new SubStation('substation')
    const bus = new Bus('bus', subStation)
    expect(sw.isConnectableWithErrors(bus)).toStrictEqual([])
  })

  it('valid - feeder', () => {
    const feeder = new Feeder('feeder')
    expect(sw.isConnectableWithErrors(feeder)).toStrictEqual([])
  })

  it('valid - cable', () => {
    const cable = new Cable('cable')
    expect(sw.isConnectableWithErrors(cable)).toStrictEqual([])
  })

  it('invalid', () => {
    class InvalidConnectable extends Connectable {
      isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
        return super.isConnectableWithErrors(connectable)
      }
    }

    const invalidConnectable = new InvalidConnectable('ref', 2)
    expect(sw.isConnectableWithErrors(invalidConnectable)).toStrictEqual([
      new ConnectableWithError(sw, invalidConnectable),
    ])
  })
})
