import Connectable from './connectable'
import Bus from './bus'
import Cable from './cable'
import {
  ConnectableWithError,
  ConnectionError,
  SwitchCanHaveOneBusError,
  SwitchCanHaveOneCableError,
  SwitchLockedError,
} from './errors'
import Feeder from './feeder'

class Switch extends Connectable {
  private locked: boolean

  constructor(ref: string, closed = true, locked = false) {
    super(ref, 2, closed)
    this.locked = locked
  }

  setClosed(status: boolean, override = false): void {
    if (override || !this.locked) {
      this.closed = status
    } else {
      throw new SwitchLockedError(this)
    }
  }

  setLocked(status: boolean): void {
    this.locked = status
  }

  isLocked(): boolean {
    return this.locked
  }

  // TODO: Implement logic for getting feeder and stuff
  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    const hasBus = this.connections.filter(con => con instanceof Bus).length
    const hasCable = this.connections.filter(con => con instanceof Cable).length
    if (
      !(
        connectable instanceof Bus ||
        connectable instanceof Cable ||
        connectable instanceof Feeder
      )
    ) {
      errors.push(new ConnectableWithError(this, connectable))
    }
    if (hasBus && connectable instanceof Bus) {
      errors.push(new SwitchCanHaveOneBusError(this, connectable))
    }
    if (hasCable && connectable instanceof Cable) {
      errors.push(new SwitchCanHaveOneCableError(this, connectable))
    }
    return errors
  }

  getBus(): Bus | null {
    for (const con of this.connections) {
      if (con instanceof Bus) return con
    }
    return null
  }
}

export default Switch
