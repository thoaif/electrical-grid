import Feeder from '@/renderer/model/feeder'
import Switch from '@/renderer/model/switch'
import Cable from '@/renderer/model/cable'
import Bus from '@/renderer/model/bus'
import {
  getFeeder,
  graphTraverse,
  multiConnect,
} from '@/renderer/model/graph-traverse'
import Connectable from '@/renderer/model/connectable'

describe('.multiConnect', () => {
  test('.multiConnect(feeder, cable, switch)', () => {
    const feeder = new Feeder('feeder')
    const cable = new Cable('cable')
    const sw = new Switch('sw')
    multiConnect(feeder, cable, sw)
    expect(feeder.connections).toStrictEqual([cable])
    expect(cable.connections).toStrictEqual([feeder, sw])
    expect(sw.connections).toStrictEqual([cable])
  })
})

describe('graphTraverse', () => {
  const feeder1 = new Feeder('feeder1')
  const feeder2 = new Feeder('feeder2')
  const cable1 = new Cable('cable1')
  const cable2 = new Cable('cable2')
  const cable3 = new Cable('cable3')
  const cable4 = new Cable('cable4')
  const cable5 = new Cable('cable5')
  const sw1 = new Switch('sw1')
  const sw2 = new Switch('sw2')
  const sw3 = new Switch('sw3')
  const sw4 = new Switch('sw4')
  const sw5 = new Switch('sw5')
  const sw6 = new Switch('sw6')
  const sw7 = new Switch('sw7')
  const sw8 = new Switch('sw8')
  const bus1 = new Bus('bus1')
  const bus2 = new Bus('bus2')
  const bus3 = new Bus('bus3')

  beforeEach(() => {
    const switches = [sw1, sw2, sw3, sw4, sw5, sw6, sw7, sw8]
    const feeders = [feeder1, feeder2]
    feeders.forEach(f => f.open())
    switches.forEach(sw => sw.close())
  })

  feeder1.open()
  feeder2.open()
  multiConnect(
    feeder1,
    cable1,
    sw1,
    bus1,
    sw2,
    cable2,
    sw6,
    bus3,
    sw8,
    cable5,
    feeder2
  )
  multiConnect(bus1, sw3, cable3, sw4, bus2, sw5, cable4, sw7, bus3)

  describe('no stop condition: stopCondition = () => false', () => {
    const stopCondition = () => false
    it(
      'open connection traverse: ' +
        '.graphTraverse(feeder1, stopCondition, null, false)',
      () => {
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          null,
          false
        )
        expect(connectable).toBeNull()
        expect(connections.length).toBe(18)
      }
    )

    it(
      'closed connection traverse, open connection start: ' +
        '.graphTraverse(feeder1, stopCondition, null, true)',
      () => {
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          null,
          true
        )
        expect(connectable).toBeNull()
        expect(connections.length).toBe(1)
        expect(connections).toStrictEqual([feeder1])
      }
    )

    it(
      'closed connection traverse, open connection start, ' +
        'defaultValue given: .graphTraverse(feeder1, stopCondition, feeder1, true)',
      () => {
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          feeder1,
          true
        )
        expect(connectable).toBe(feeder1)
        expect(connections.length).toBe(1)
        expect(connections).toStrictEqual([feeder1])
      }
    )
  })

  describe('target stop condition: stopCondition = (connectable) => connectable === bus1', () => {
    const stopCondition = (connectable: Connectable) => connectable === bus1
    it(
      'open connection traverse: ' +
        '.graphTraverse(feeder1, stopCondition, null, false)',
      () => {
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          null,
          false
        )
        expect(connectable).toBe(bus1)
        expect(connections.length).toBe(4)
      }
    )

    it(
      'open connection traverse, switch between closed: ' +
        '.graphTraverse(feeder1, stopCondition, null, false)',
      () => {
        feeder1.close()
        sw1.open()
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          null,
          true
        )
        expect(connectable).toBeNull()
        expect(connections.length).toBe(3)
      }
    )
  })

  describe('target closeable stop condition: stopCondition = (connectable) => connectable === sw1', () => {
    const stopCondition = (connectable: Connectable) => connectable === sw1
    it(
      'closed connection traverse - target open: ' +
        '.graphTraverse(feeder1, stopCondition, null, false)',
      () => {
        feeder1.close()
        sw1.open()
        const [connectable, connections] = graphTraverse(
          feeder1,
          stopCondition,
          null,
          true
        )
        expect(connectable).toBeNull()
        expect(connections.length).toBe(3)
      }
    )
  })
})

describe('getFeeder', () => {
  describe('feeder to 1 substation', () => {
    const feeder = new Feeder('feeder')
    const cable1 = new Cable('cable1')
    const sw2 = new Switch('sw2')
    const bus1 = new Bus('bus1')
    feeder.connect(cable1)
    cable1.connect(sw2)
    sw2.connect(bus1)

    it('full closed path', () => {
      expect(getFeeder(bus1)).toBe(feeder)
      expect(getFeeder(sw2)).toBe(feeder)
      expect(getFeeder(cable1)).toBe(feeder)
      expect(getFeeder(feeder)).toBe(feeder)
    })

    it('feeder switch open', () => {
      feeder.open()
      expect(getFeeder(bus1)).toBeNull()
      expect(getFeeder(sw2)).toBeNull()
      expect(getFeeder(cable1)).toBeNull()
      expect(getFeeder(feeder)).toBe(feeder)

      feeder.close()
    })

    it('substation switch sw2 open', () => {
      sw2.open()
      expect(getFeeder(bus1)).toBeNull()
      expect(getFeeder(sw2)).toBeNull()
      expect(getFeeder(cable1)).toBe(feeder)
      expect(getFeeder(feeder)).toBe(feeder)
    })
  })

  describe('2 feeders - straight connection', () => {
    const feeder1 = new Feeder('feeder1')
    const feeder2 = new Feeder('feeder2')
    const cable1 = new Cable('cable1')
    const cable2 = new Cable('cable2')
    const sw2 = new Switch('sw2')
    sw2.open()

    feeder1.connect(cable1)
    cable1.connect(sw2)
    sw2.connect(cable2)
    cable2.connect(feeder2)

    it('feeder switch open', () => {
      // feeder1 side
      expect(getFeeder(cable1)).toBe(feeder1)

      // boundary
      expect(getFeeder(sw2)).toBeNull()

      // feeder2 side
      expect(getFeeder(cable2)).toBe(feeder2)
    })

    it('feeder1 gets all connections', () => {
      feeder2.open()
      sw2.close()
      // feeder1 side
      expect(getFeeder(cable1)).toBe(feeder1)
      expect(getFeeder(sw2)).toBe(feeder1)
      expect(getFeeder(cable2)).toBe(feeder1)

      // boundary
    })
  })
})
