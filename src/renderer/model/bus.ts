import Connectable from './connectable'
import SubStation from './sub-station'
import Switch from './switch'
import { ConnectableWithError } from './errors'

class Bus extends Connectable {
  private _parent: SubStation

  constructor(ref: string, parent: SubStation, maxConnections = 3) {
    super(ref, maxConnections, true)
    this._parent = parent
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (!(connectable instanceof Switch)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  set maxConnections(maxConnections: number) {
    this._maxConnections = maxConnections
  }

  get maxConnections(): number {
    return super.maxConnections
  }

  set parent(parent: SubStation) {
    this._parent = parent
  }

  get parent(): SubStation {
    return this._parent
  }
}

export default Bus
