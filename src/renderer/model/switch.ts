import Connectable from '@/renderer/model/connectable'
import Bus from '@/renderer/model/bus'
import Cable from '@/renderer/model/cable'
import { ConnectableWithError } from '@/renderer/model/errors'
import Closeable from '@/renderer/model/closeable'

class Switch extends Closeable {
  constructor(ref: string, closed = true, locked = false) {
    super(ref, 2, closed, locked)
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (!(connectable instanceof Bus || connectable instanceof Cable)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  connect(connectable: Bus | Cable, connected = false): void {
    return super.connect(connectable, connected)
  }
}

export default Switch
