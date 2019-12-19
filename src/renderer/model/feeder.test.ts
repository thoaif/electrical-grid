import Feeder from './feeder'
import Switch from './switch'
import { ConnectableWithError } from './errors'

describe('constructor', () => {
  it('defaults', () => {
    const feeder = new Feeder('feeder')
    expect(feeder.ref).toBe('feeder')
    expect(feeder.getMaxConnections()).toBe(1)
    expect(feeder.connections).toStrictEqual([])
    expect(feeder.isClosed()).toBe(true)
  })
})

describe('isConnectableWithErrors', () => {
  it('no errors', () => {
    const sw1 = new Switch('sw1')
    const feeder = new Feeder('feeder')
    expect(feeder.isConnectableWithErrors(sw1)).toStrictEqual([])
  })

  it('with error', () => {
    const feeder = new Feeder('feeder')
    const otherFeeder = new Feeder('otherFeeder')
    expect(feeder.isConnectableWithErrors(otherFeeder)).toStrictEqual([
      new ConnectableWithError(feeder, otherFeeder),
    ])
  })
})
