import Connectable from '@/renderer/model/connectable'
import { ConnectableWithError } from '@/renderer/model/errors'
import Closeable from '@/renderer/model/closeable'
import Cable from '@/renderer/model/cable'

class Feeder extends Closeable {
  constructor(ref: string, closed = true, locked = false) {
    super(ref, 1, closed, locked)
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (!(connectable instanceof Cable)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  connect(connectable: Cable, connected = false): void {
    return super.connect(connectable, connected)
  }
}

export default Feeder
