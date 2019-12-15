import GridModel from './grid-model'

describe('constructor', () => {
  it('constructor defaults', () => {
    const model = new GridModel('ref')
    expect(model.ref).toBe('ref')
  })
})

describe('toJSON', () => {
  it('default', () => {
    const model = new GridModel('ref')
    expect(model.toJSON()).toStrictEqual({ ref: 'ref' })
  })

  it('subclassed', () => {
    class GridModelSubClass extends GridModel {
      other: boolean

      constructor(ref: string, other = false) {
        super(ref)
        this.other = other
      }
    }

    const modelSubClass = new GridModelSubClass('modelSubClass', true)
    expect(modelSubClass.toJSON()).toStrictEqual({
      ref: 'modelSubClass',
      other: true,
    })
  })
})

describe('toString', () => {
  it('checking refs', () => {
    const model = new GridModel('ref')
    expect(model.toString()).toBe('ref')
  })
})
