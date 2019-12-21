import Connectable from './connectable'
import Bus from './bus'
import Cable from './cable'
import { ConnectableWithError, SwitchLockedError } from './errors'
import Feeder from './feeder'

class Switch extends Connectable {
  private _locked: boolean

  constructor(ref: string, closed = true, locked = false) {
    super(ref, 2, closed)
    this._locked = locked
  }

  private setClosed(status: boolean, override = false): void {
    if (override || !this._locked) {
      this._closed = status
    } else {
      throw new SwitchLockedError(this)
    }
  }

  open(override = false): void {
    if (this._closed) {
      this.setClosed(false, override)
    }
  }

  close(override = false): void {
    if (!this._closed) {
      this.setClosed(true, override)
    }
  }

  toggle(override = false): void {
    this.setClosed(!this._closed, override)
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(status: boolean) {
    this._locked = status
  }

  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    const errors = []
    if (
      !(
        connectable instanceof Bus ||
        connectable instanceof Cable ||
        connectable instanceof Feeder
      )
    ) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    return errors
  }
}

export default Switch
