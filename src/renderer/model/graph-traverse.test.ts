import Feeder from './feeder'
import Switch from './switch'
import Cable from './cable'
import Bus from './bus'
import SubStation from './sub-station'
import { getFeeder } from './graph-traverse'

describe('getFeeder', () => {
  describe('feeder to 1 substation', () => {
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

    it('full closed path', () => {
      expect(getFeeder(bus1)).toBe(feeder)
      expect(getFeeder(sw2)).toBe(feeder)
      expect(getFeeder(cable1)).toBe(feeder)
      expect(getFeeder(sw1)).toBe(feeder)
      expect(getFeeder(feeder)).toBe(feeder)
    })

    it('feeder switch sw1 open', () => {
      sw1.open()
      expect(getFeeder(bus1)).toBeNull()
      expect(getFeeder(sw2)).toBeNull()
      expect(getFeeder(cable1)).toBeNull()
      expect(getFeeder(sw1)).toBeNull()
      expect(getFeeder(feeder)).toBe(feeder)

      sw1.close()
    })

    it('substation switch sw2 open', () => {
      sw2.open()
      expect(getFeeder(bus1)).toBeNull()
      expect(getFeeder(sw2)).toBeNull()
      expect(getFeeder(cable1)).toBe(feeder)
      expect(getFeeder(sw1)).toBe(feeder)
      expect(getFeeder(feeder)).toBe(feeder)
    })
  })

  describe('2 feeders - straight connection', () => {
    const feeder1 = new Feeder('feeder1')
    const feeder2 = new Feeder('feeder2')
    const cable1 = new Cable('cable1')
    const cable2 = new Cable('cable2')
    const sw1 = new Switch('sw1')
    const sw2 = new Switch('sw2')
    const sw3 = new Switch('sw3')
    sw2.open()

    feeder1.connect(sw1)
    sw1.connect(cable1)
    cable1.connect(sw2)
    sw2.connect(cable2)
    cable2.connect(sw3)
    sw3.connect(feeder2)

    it('feeder switch open', () => {
      // feeder1 side
      expect(getFeeder(cable1)).toBe(feeder1)
      expect(getFeeder(sw1)).toBe(feeder1)

      // boundary
      expect(getFeeder(sw2)).toBeNull()

      // feeder2 side
      expect(getFeeder(cable2)).toBe(feeder2)
      expect(getFeeder(sw3)).toBe(feeder2)
    })

    it('feeder1 gets all connections', () => {
      sw3.open()
      sw2.close()
      // feeder1 side
      expect(getFeeder(sw1)).toBe(feeder1)
      expect(getFeeder(cable1)).toBe(feeder1)
      expect(getFeeder(sw2)).toBe(feeder1)
      expect(getFeeder(cable2)).toBe(feeder1)

      // boundary
      expect(getFeeder(sw3)).toBeNull()
    })
  })
})
