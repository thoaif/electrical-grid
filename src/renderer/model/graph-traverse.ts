import Connectable from './connectable'
import Feeder from './feeder'

const isFeeder = (connectable: Connectable | null): boolean =>
  connectable instanceof Feeder

const pathClosed = (connection: Connectable, closed: boolean): boolean => {
  return (closed && connection.closed) || !closed
}

const getFilteredConnections = (
  connection: Connectable | null,
  visited: (Connectable | null)[],
  closed: boolean
): Connectable[] => {
  if (!(connection instanceof Connectable)) {
    return []
  } else {
    if (!pathClosed(connection, closed)) {
      return []
    } else {
      return connection.connections.filter(c => !visited.includes(c))
    }
  }
}

export const graphTraverse = (
  start: Connectable | null,
  stopCondition: Function,
  defaultValue: Connectable | null,
  closed = false
): Connectable | null => {
  const visited = [start]
  const connections = getFilteredConnections(start, visited, closed)
  // const connectionTree = [...connections]

  let con = defaultValue
  while (connections.length > 0 && !stopCondition(con)) {
    con = connections.shift() as Connectable
    visited.push(con)
    const filteredCons = getFilteredConnections(con, visited, closed)
    connections.push(...filteredCons)
    // connectionTree.push(...filteredCons)
  }
  return con
}

export const getFeeder = (start: Connectable): Feeder | null => {
  if (isFeeder(start)) {
    return start
  }
  const connectable = graphTraverse(start, isFeeder, null, true)
  return isFeeder(connectable) ? connectable : null
}
