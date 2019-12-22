import Connectable from '@/renderer/model/connectable'
import SubStation from '@/renderer/model/sub-station'
import Switch from '@/renderer/model/switch'
import { ConnectableWithError } from '@/renderer/model/errors'

class Bus extends Connectable {
  private _parent: SubStation | null

  constructor(ref: string, maxConnections = 3) {
    super(ref, maxConnections, true)
    this._parent = null
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (!(connectable instanceof Switch)) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }

  connect(connectable: Switch, connected = false): void {
    return super.connect(connectable, connected)
  }

  removeParent(): void {
    if (this._parent !== null) {
      this._parent.removeChild(this)
    }
  }

  set maxConnections(maxConnections: number) {
    this._maxConnections = maxConnections
  }

  get maxConnections(): number {
    return super.maxConnections
  }

  set parent(parent: SubStation | null) {
    this._parent = parent
  }

  get parent(): SubStation | null {
    return this._parent
  }
}

export default Bus
