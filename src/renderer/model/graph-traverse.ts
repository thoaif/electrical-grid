import Connectable from './connectable'
import Feeder from './feeder'

const isFeeder = (connectable: Connectable | null) =>
  connectable instanceof Feeder

const getFilteredConnections = (
  conncetion: Connectable,
  visited: Connectable[],
  closed: boolean
): Connectable[] =>
  conncetion
    .getConnections()
    .filter(c => !visited.includes(c) && ((closed && c.isClosed()) || !closed))

export const graphTraverse = (
  start: Connectable,
  stopCondition: Function,
  defaultValue: Connectable | null,
  closed = false
) => {
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

export const getFeeder = (start: Connectable) => {
  if (isFeeder(start)) {
    return start
  }
  const connectable = graphTraverse(start, isFeeder, null, true)
  return isFeeder(connectable) ? connectable : null
}
