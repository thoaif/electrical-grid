import Connectable from '@/renderer/model/connectable'

export class ConnectionError extends Error {
  baseConnectable: Connectable | string

  constructor(
    baseConnectable: Connectable | string,
    message: string,
    name: string
  ) {
    super(message)
    this.name = name
    this.baseConnectable = baseConnectable
  }
}

export class MaxConnectionError extends ConnectionError {
  constructor(
    connectable: Connectable | string,
    maxConnections: number,
    currentConnections: number,
    noOfConnections: number
  ) {
    const message = `${connectable} has maxConnection of ${maxConnections} - currently has ${currentConnections} cannot add ${noOfConnections} more`
    super(connectable, message, 'MaxConnectionError')
  }
}

export class SelfConnectionError extends ConnectionError {
  constructor(connectable: Connectable | string) {
    const message = `${connectable} is trying to connect with self`
    super(connectable, message, 'SelfConnectionError')
  }
}

export class ConnectableWithError extends ConnectionError {
  otherConnectable: Connectable

  constructor(
    baseConnectable: Connectable,
    otherConnectable: Connectable,
    message: string | null = null,
    name = 'ConnectableWithError'
  ) {
    if (message === null) {
      message = `${baseConnectable} (${baseConnectable.constructor.name}) is not connectable with ${otherConnectable} (${otherConnectable.constructor.name})`
    }

    super(baseConnectable, message, name)
    this.otherConnectable = otherConnectable
  }
}

export class ConnectionAlreadyExists extends ConnectionError {
  otherConnectable: Connectable
  constructor(baseConnectable: Connectable, otherConnectable: Connectable) {
    const message = `${baseConnectable} is already connected with ${otherConnectable}`
    super(baseConnectable, message, 'ConnectionAlreadyExists')
    this.otherConnectable = otherConnectable
  }
}

export class ConnectionDoesntExist extends ConnectionError {
  otherConnectable: Connectable
  constructor(baseConnectable: Connectable, otherConnectable: Connectable) {
    const message = `${baseConnectable} doesn't exit in ${otherConnectable}`
    super(baseConnectable, message, 'ConnectionDoesntExist')
    this.otherConnectable = otherConnectable
  }
}

export class MultipleConnectionErrors extends ConnectionError {
  errors: ConnectionError[]
  constructor(baseConnectable: Connectable, errors: ConnectionError[] = []) {
    let message = `multiple errors found in ${baseConnectable}:`
    message += errors.map(e => e.message).join('- \n\t')
    super(baseConnectable, message, 'ConnectableWithError')
    this.errors = errors
  }
}

export class ClosableLockedError extends ConnectionError {
  constructor(baseConnectable: Connectable) {
    const message = `${baseConnectable} is locked - cannot change closed state`
    super(baseConnectable, message, 'ClosableLockedError')
  }
}
