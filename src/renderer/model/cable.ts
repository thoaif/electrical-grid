import Connectable from './connectable'
import { ConnectableWithError } from './errors'
import Switch from './switch'

class Cable extends Connectable {
  constructor(ref: string) {
    super(ref, 2, true)
  }

  isConnectableErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (!(connectable instanceof Switch)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }
}

export default Cable
