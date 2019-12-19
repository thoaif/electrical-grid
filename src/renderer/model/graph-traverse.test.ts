import Feeder from './feeder'
import Switch from './switch'
import Cable from './cable'
import Bus from './bus'
import SubStation from './sub-station'
import { getFeeder } from './graph-traverse'

describe('getFeeder', () => {
  it('case 1:', () => {
    const feeder = new Feeder('feeder')
    const sw1 = new Switch('sw1')
    const cable1 = new Cable('cable1')
    const sw2 = new Switch('sw2')
    const subStation = new SubStation('subStation')
    const bus1 = new Bus('bus1', subStation)

    feeder.connect(sw1)
    sw1.connect(cable1)
    cable1.connect(sw2)
    sw2.connect(bus1)

    expect(getFeeder(bus1)).toBe(feeder)
    expect(getFeeder(sw2)).toBe(feeder)
    expect(getFeeder(cable1)).toBe(feeder)
    expect(getFeeder(sw1)).toBe(feeder)
    expect(getFeeder(feeder)).toBe(feeder)
  })

  it('path open:', () => {
    const feeder = new Feeder('feeder')
    const sw1 = new Switch('sw1')
    const cable1 = new Cable('cable1')
    const sw2 = new Switch('sw2')
    const subStation = new SubStation('subStation')
    const bus1 = new Bus('bus1', subStation)

    feeder.connect(sw1)
    sw1.connect(cable1)
    cable1.connect(sw2)
    sw2.connect(bus1)
    sw1.setClosed(false)

    expect(getFeeder(bus1)).toBeNull()
    expect(getFeeder(sw2)).toBeNull()
    expect(getFeeder(cable1)).toBeNull()
    expect(getFeeder(sw1)).toBe(feeder)
    expect(getFeeder(feeder)).toBe(feeder)
  })
})
