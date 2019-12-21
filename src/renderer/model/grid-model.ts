abstract class GridModel {
  private ref: string

  constructor(ref: string) {
    this.ref = ref
  }

  toJSON(): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialized: Record<string, any> = {}
    for (const [key, val] of Object.entries(this)) {
      if (val instanceof GridModel) {
        serialized[key] = val.toString()
      } else {
        serialized[key] = val
      }
    }

    return serialized
  }

  toString(): string {
    return this.ref
  }

  set name(ref: string) {
    this.ref = ref
  }

  get name(): string {
    return this.ref
  }
}

export default GridModel
