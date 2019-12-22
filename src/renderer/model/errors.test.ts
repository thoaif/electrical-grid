import * as errors from '@/renderer/model/errors'

describe('name match test', () => {
  it('name', () => {
    Object.entries(errors).forEach(([name, error]) => {
      expect(name).toBe(error.name)
    })
  })
})
