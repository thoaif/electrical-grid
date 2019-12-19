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

class Connectable extends GridModel {
  protected connections: Connectable[]
  protected maxConnections: number
  protected closed: boolean

  constructor(ref: string, maxConnections: number, closed = true) {
    super(ref)
    this.closed = closed
    this.maxConnections = maxConnections
    this.connections = []
  }

  isConnectableWith(connectable: Connectable): boolean {
    const errors = this.isConnectableWithErrors(connectable)
    return !errors.length
  }

  isConnectableWithErrors(connectable: Connectable): ConnectionError[] {
    console.warn('isConnectableWithErrors has to be implemented')
    return []
  }

  isConnectable(connectable: Connectable): boolean {
    const errors = this.isConnectableErrors(connectable)
    return !errors.length
  }

  isConnectableErrors(connectable: Connectable): ConnectionError[] {
    const errors = []
    const connectableStrings = this.connections.map(con => con.toString())
    if (connectable.toString() === this.toString())
      errors.push(new SelfConnectionError(this))
    else if (connectableStrings.includes(connectable.toString())) {
      errors.push(new ConnectionAlreadyExists(this, connectable))
    }
    if (this.connections.length === this.maxConnections)
      errors.push(
        new MaxConnectionError(
          this,
          this.maxConnections,
          this.connections.length,
          1
        )
      )
    errors.push(...this.isConnectableWithErrors(connectable))
    return errors
  }

  connect(connectable: Connectable, connected = false): void {
    const errors = this.isConnectableErrors(connectable)
    this.raiseConnectionErrors(errors)
    this.connections.push(connectable)
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
    const index = this.connections.indexOf(connectable)

    if (index !== -1) {
      this.connections.splice(index, 1)
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

  getMaxConnections(): number {
    return this.maxConnections
  }

  getConnections(): Connectable[] {
    return this.connections
  }

  isClosed(): boolean {
    return this.closed
  }
}

export default Connectable
