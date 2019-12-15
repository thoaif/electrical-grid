import Connectable from './connectable'
import {
  ConnectableWithError,
  ConnectionAlreadyExists,
  ConnectionError,
  MaxConnectionError,
  MultipleConnectionErrors,
  SelfConnectionError,
} from './erros'

class SubClassedConnectableNegative extends Connectable {
  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    return [new ConnectableWithError(this, connectable)]
  }
}

class SubClassedConnectablePositive extends Connectable {
  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    return []
  }
}

describe('constructor', () => {
  it('defaults', () => {
    const model = new SubClassedConnectablePositive('model', 3)
    expect(model.ref).toBe('model')
    expect(model.maxConnections).toBe(3)
    expect(model.connections).toStrictEqual([])
  })

  // MaxConnectionError is raised first
  it('max connection exceeded', () => {
    const model = new SubClassedConnectablePositive('model', 1)
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    expect(
      () => new SubClassedConnectablePositive('ref', 1, true, model, otherModel)
    ).toThrowError(new MaxConnectionError('ref', 1, 0, 2))
  })

  it('multiple errors', () => {
    const model = new SubClassedConnectablePositive('model', 10)
    const error = new SelfConnectionError(model)
    expect(
      () =>
        new SubClassedConnectablePositive(
          'model',
          10,
          true,
          model,
          model,
          model,
          model
        )
    ).toThrowError(
      new MultipleConnectionErrors(model, [error, error, error, error])
    )
  })
})

describe('isConnectableErrors', () => {
  it('no errors', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 1)
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const errors = baseModel.isConnectableErrors(otherModel)
    expect(errors).toStrictEqual([])
    expect(errors.length).toBe(0)
  })

  it('only self connection - with same object', () => {
    const model = new SubClassedConnectablePositive('model', 10)
    const errors = model.isConnectableErrors(model)
    expect(errors).toStrictEqual([new SelfConnectionError(model)])
    expect(errors.length).toBe(1)
  })

  it('connection already exists - with same object', () => {
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const baseModel = new SubClassedConnectablePositive(
      'baseModel',
      2,
      true,
      otherModel
    )
    const errors = baseModel.isConnectableErrors(otherModel)
    expect(errors).toStrictEqual([
      new ConnectionAlreadyExists(baseModel, otherModel),
    ])
    expect(errors.length).toBe(1)
  })

  it('connection already exists - with different object', () => {
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const anotherModel = new SubClassedConnectablePositive('otherModel', 1)
    const baseModel = new SubClassedConnectablePositive(
      'baseModel',
      2,
      true,
      otherModel
    )
    const errors = baseModel.isConnectableErrors(anotherModel)
    expect(errors).toStrictEqual([
      new ConnectionAlreadyExists(baseModel, anotherModel),
    ])
    expect(errors.length).toBe(1)
  })

  it('only self connection - with different object', () => {
    const model = new SubClassedConnectablePositive('model', 10)
    const modelWithSameRef = new SubClassedConnectablePositive('model', 10)
    const errors = model.isConnectableErrors(modelWithSameRef)
    expect(errors).toStrictEqual([new SelfConnectionError(model)])
    expect(errors.length).toBe(1)
  })

  it('max connection exceeded', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 0)
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const errors = baseModel.isConnectableErrors(otherModel)
    expect(errors).toStrictEqual([new MaxConnectionError(baseModel, 0, 0, 1)])
    expect(errors.length).toBe(1)
  })

  it('max connection and self', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 0)
    const errors = baseModel.isConnectableErrors(baseModel)
    expect(errors).toStrictEqual([
      new SelfConnectionError(baseModel),
      new MaxConnectionError(baseModel, 0, 0, 1),
    ])
    expect(errors.length).toBe(2)
  })

  it('sub classed', () => {
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const baseModel = new SubClassedConnectableNegative('baseModel', 1)
    const errors = baseModel.isConnectableErrors(otherModel)
    expect(errors[0]).toStrictEqual(
      new ConnectableWithError(baseModel, otherModel)
    )
    expect(errors.length).toBe(1)
  })
})

describe('isConnectable', () => {
  it('errored', () => {
    const model = new SubClassedConnectablePositive('ref', 10)
    const canConnect = model.isConnectable(model)
    expect(canConnect).toBe(false)
  })

  it('no errors', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 10)
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const canConnect = baseModel.isConnectable(otherModel)
    expect(canConnect).toBe(true)
  })
})

describe('connect', () => {
  it('no errors', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 2)
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const anotherModel = new SubClassedConnectablePositive('anotherModel', 1)
    expect(() => baseModel.connect(otherModel)).not.toThrow()
    expect(baseModel.connections[0]).toBe(otherModel)
    expect(baseModel.connections.length).toBe(1)

    expect(() => baseModel.connect(anotherModel)).not.toThrow()
    expect(baseModel.connections[1]).toBe(anotherModel)
    expect(baseModel.connections.length).toBe(2)
  })

  it('1 error', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 1)
    expect(() => baseModel.connect(baseModel)).toThrow(
      new SelfConnectionError(baseModel)
    )
  })

  it('multiple error', () => {
    const baseModel = new SubClassedConnectablePositive('baseModel', 0)
    const errors = [
      new SelfConnectionError(baseModel),
      new MaxConnectionError(baseModel, 0, 0, 1),
    ]
    expect(() => baseModel.connect(baseModel)).toThrow(
      new MultipleConnectionErrors(baseModel, errors)
    )
  })
})

describe('isConnectableWith', () => {
  it('sub classed', () => {
    const otherModel = new SubClassedConnectablePositive('otherModel', 1)
    const baseModel = new SubClassedConnectableNegative('baseModel', 2)
    expect(baseModel.isConnectableWith(otherModel)).toBe(false)
  })
})
