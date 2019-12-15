import GridModel from './grid-model'
import {
  ConnectableWithError,
  ConnectionAlreadyExists,
  ConnectionError,
  MaxConnectionError,
  MultipleConnectionErrors,
  SelfConnectionError,
} from './erros'

class Connectable extends GridModel {
  connections: Connectable[]
  maxConnections: number
  closed: boolean

  constructor(
    ref: string,
    maxConnections: number,
    closed = true,
    ...connections: Connectable[]
  ) {
    super(ref)
    if (connections.length > maxConnections) {
      throw new MaxConnectionError(ref, maxConnections, 0, connections.length)
    }

    this.closed = closed
    this.maxConnections = maxConnections
    this.connections = []

    this.raiseConnectionErrors(this.isConnectableWithMultiple(connections))
    this.connections = connections
  }

  isConnectableWithMultiple(
    connections: Connectable[],
    existingErrors: ConnectionError[] = []
  ): ConnectionError[] {
    const errors = existingErrors
    for (const connection of connections) {
      const err = this.isConnectableErrors(connection)
      errors.push(...err)
    }
    return errors
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
    if (connectable.connections.length === this.maxConnections)
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

  connect(connectable: Connectable): void {
    const errors = this.isConnectableErrors(connectable)
    this.raiseConnectionErrors(errors)
    this.connections.push(connectable)
  }

  raiseConnectionErrors(errors: ConnectionError[]): void {
    if (errors.length === 1) {
      throw errors[0]
    } else if (errors.length > 1) {
      throw new MultipleConnectionErrors(this, errors)
    }
  }
}

export default Connectable
