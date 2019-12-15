import Connectable from './connectable'
import SubStation from './sub-station'
import Switch from './switch'

export class Bus extends Connectable {
  parent: SubStation

  constructor(
    ref: string,
    parent: SubStation,
    maxConnections = 3,
    ...connections: Switch[]
  ) {
    super(ref, maxConnections, true, ...connections)
    this.parent = parent
  }
}
