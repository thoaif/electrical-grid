import GridModel from './grid-model'

class GridModelSubClassed extends GridModel {}

class GridModelSubClassWithOther extends GridModel {
  other: boolean

  constructor(ref: string, other = false) {
    super(ref)
    this.other = other
  }
}

class GridModelGrandSon extends GridModelSubClassWithOther {
  another: string
  constructor(ref: string, other = false, another = 'string') {
    super(ref, other)
    this.another = another
  }
}

describe('constructor', () => {
  it('constructor defaults', () => {
    const model = new GridModelSubClassed('ref')
    expect(model.name).toBe('ref')
  })
})

describe('toJSON', () => {
  it('default', () => {
    const model = new GridModelSubClassed('ref')
    expect(model.toJSON()).toStrictEqual({ ref: 'ref' })
  })

  it('subclassed', () => {
    const modelSubClass = new GridModelSubClassWithOther('modelSubClass', true)
    expect(modelSubClass.toJSON()).toStrictEqual({
      ref: 'modelSubClass',
      other: true,
    })
  })

  it('grandsoned', () => {
    const grandson = new GridModelGrandSon('modelSubClass', true, 'grandios')
    expect(grandson.toJSON()).toStrictEqual({
      ref: 'modelSubClass',
      other: true,
      another: 'grandios',
    })
  })
})

describe('toString', () => {
  it('checking refs', () => {
    const model = new GridModelSubClassed('ref')
    expect(model.toString()).toBe('ref')
  })

  it('subclassed', () => {
    const modelSubClass = new GridModelSubClassWithOther('modelSubClass', true)
    expect(modelSubClass.toString()).toStrictEqual('modelSubClass')
  })

  it('grandsoned', () => {
    const grandson = new GridModelGrandSon('modelSubClass', true, 'grandios')
    expect(grandson.toString()).toStrictEqual('modelSubClass')
  })
})
