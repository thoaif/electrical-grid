import Connectable from '@/renderer/model/connectable'
import { ConnectableWithError } from '@/renderer/model/errors'
import Switch from '@/renderer/model/switch'
import Feeder from '@/renderer/model/feeder'

class Cable extends Connectable {
  constructor(ref: string) {
    super(ref, 2, true)
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (
      !(
        connectable instanceof Switch ||
        connectable instanceof Feeder ||
        connectable instanceof Cable
      )
    ) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  connect(connectable: Switch | Feeder | Cable, connected = false): void {
    return super.connect(connectable, connected)
  }
}

export default Cable
