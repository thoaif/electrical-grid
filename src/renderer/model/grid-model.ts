class GridModel {
  ref: string

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

  // TODO: implement feeder function
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  feeder(): {}
}

export default GridModel
