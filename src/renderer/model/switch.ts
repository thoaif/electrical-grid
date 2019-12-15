import Connectable from './connectable'
import { Bus } from './bus'
import { Cable } from './cable'
import {
  ConnectionError,
  SwitchCanHaveOneBusError,
  SwitchCanHaveOneCableError,
  SwitchLockedError,
} from './erros'

class Switch extends Connectable {
  locked: boolean

  constructor(
    ref: string,
    closed = true,
    locked = false,
    ...connections: (Bus | Cable)[]
  ) {
    super(ref, 2, closed, ...connections)
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

  isConnectableWithMultiple(connections: Connectable[]): ConnectionError[] {
    const buses = connections.filter(con => con instanceof Bus)
    const cables = connections.filter(con => con instanceof Cable)
    const errors = []
    if (buses.length > 1) {
      errors.push(new SwitchCanHaveOneBusError(this, buses[1]))
    }
    if (cables.length > 1) {
      errors.push(new SwitchCanHaveOneCableError(this, cables[1]))
    }

    return super.isConnectableWithMultiple(connections, errors)
  }

  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    const hasBus = this.connections.filter(con => con instanceof Bus).length
    const hasCable = this.connections.filter(con => con instanceof Cable).length
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
