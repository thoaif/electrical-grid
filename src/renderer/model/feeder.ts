import Connectable from './connectable'
import Switch from './switch'
import { ConnectableWithError, ConnectionError } from './errors'

class Feeder extends Connectable {
  constructor(ref: string) {
    super(ref, 1, true)
  }

  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    if (!(connectable instanceof Switch)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }
}

export default Feeder
