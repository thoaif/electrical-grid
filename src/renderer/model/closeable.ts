import Connectable from './connectable'

import { ClosableLockedError } from './errors'

abstract class Closeable extends Connectable {
  private _locked: boolean

  constructor(ref: string, maxConnections = 2, closed = true, locked = false) {
    super(ref, maxConnections, closed)
    this._locked = locked
  }

  private setClosed(status: boolean, override = false): void {
    if (override || !this._locked) {
      this._closed = status
    } else {
      throw new ClosableLockedError(this)
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
}

export default Closeable
