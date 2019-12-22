import Cable from '@/renderer/model/cable'
import Feeder from '@/renderer/model/feeder'
import Switch from '@/renderer/model/switch'
import Bus from '@/renderer/model/bus'
import { ConnectableWithError } from '@/renderer/model/errors'

const cable = new Cable('cable')
const feeder = new Feeder('feeder')
const sw = new Switch('sw')
const bus = new Bus('bus')
const allModels = [cable, feeder, sw, bus]

const models = [
  {
    model: cable,
    allowed: [cable, feeder, sw],
  },
  {
    model: feeder,
    allowed: [cable],
  },
  {
    model: sw,
    allowed: [cable, bus],
  },
  {
    model: bus,
    allowed: [sw],
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testCases: any[] = []

models.forEach(obj => {
  const cases = allModels.map(model =>
    obj.allowed.includes(model)
      ? [obj.model, model, []]
      : [obj.model, model, [new ConnectableWithError(obj.model, model)]]
  )
  testCases.push(...cases)
})

describe('.isConnectableWithErrors', () => {
  test.each(testCases)(
    '%o.isConnectableWithErrors(%o)',
    (model, otherModel, expected) => {
      // console.log(model, othermodel, expected)
      expect(model.isConnectableWithErrors(otherModel)).toStrictEqual(expected)
    }
  )
})
