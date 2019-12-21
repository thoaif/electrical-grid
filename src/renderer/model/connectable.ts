import GridModel from './grid-model'
import {
  ConnectableWithError,
  ConnectionAlreadyExists,
  ConnectionDoesntExist,
  ConnectionError,
  MaxConnectionError,
  MultipleConnectionErrors,
  SelfConnectionError,
} from './errors'

abstract class Connectable extends GridModel {
  protected _connections: Connectable[]
  protected _maxConnections: number
  protected _closed: boolean

  constructor(ref: string, maxConnections: number, closed = true) {
    super(ref)
    this._closed = closed
    this._maxConnections = maxConnections
    this._connections = []
  }

  isConnectableWith(connectable: Connectable): boolean {
    const errors = this.isConnectableWithErrors(connectable)
    return !errors.length
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isConnectableWithErrors(connectable: Connectable): ConnectableWithError[] {
    console.warn('isConnectableWithErrors has to be implemented')
    return [new ConnectableWithError(this, connectable)]
  }

  isConnectable(connectable: Connectable): boolean {
    const errors = this.isConnectableErrors(connectable)
    return !errors.length
  }

  isConnectableErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    const connectableStrings = this._connections.map(con => con.toString())
    if (connectable.toString() === this.toString())
      errors.push(new SelfConnectionError(this))
    else if (connectableStrings.includes(connectable.toString())) {
      errors.push(new ConnectionAlreadyExists(this, connectable))
    }
    if (this._connections.length === this._maxConnections)
      errors.push(
        new MaxConnectionError(
          this,
          this._maxConnections,
          this._connections.length,
          1
        )
      )
    errors.push(...this.isConnectableWithErrors(connectable))
    return errors
  }

  connect(connectable: Connectable, connected = false): void {
    const errors = this.isConnectableErrors(connectable)
    this.raiseConnectionErrors(errors)
    this._connections.push(connectable)
    try {
      if (!connected) {
        connectable.connect(this, true)
      }
    } catch (e) {
      // console.error(e)
      this.disconnect(connectable, true)
      throw e
    }
  }

  disconnect(connectable: Connectable, disconnected = false): void {
    const index = this._connections.indexOf(connectable)

    if (index !== -1) {
      this._connections.splice(index, 1)
      if (!disconnected) {
        connectable.disconnect(this, true)
      }
    } else {
      throw new ConnectionDoesntExist(this, connectable)
    }
  }

  raiseConnectionErrors(errors: ConnectionError[]): void {
    if (errors.length === 1) {
      throw errors[0]
    } else if (errors.length > 1) {
      throw new MultipleConnectionErrors(this, errors)
    }
  }

  get maxConnections(): number {
    return this._maxConnections
  }

  get connections(): Connectable[] {
    return this._connections
  }

  get closed(): boolean {
    return this._closed
  }
}

export default Connectable
