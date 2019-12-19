import Connectable from './connectable'
import SubStation from './sub-station'
import Switch from './switch'
import { ConnectableWithError, ConnectionError } from './errors'

class Bus extends Connectable {
  parent: SubStation

  constructor(ref: string, parent: SubStation, maxConnections = 3) {
    super(ref, maxConnections, true)
    this.parent = parent
  }

  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    if (!(connectable instanceof Switch)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  setMaxConnections(maxConnections: number) {
    this.maxConnections = maxConnections
  }
}

export default Bus
