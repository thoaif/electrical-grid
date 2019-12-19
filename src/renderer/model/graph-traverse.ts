import Connectable from './connectable'

export const graphTraverse = (
  start: Connectable,
  stopCondition: Function,
  defaultValue: Connectable | null,
  closed = false
) => {
  const connections = start.connections as Connectable[]
  const connectionTree = [...connections]
  const visited = [start]
  let con = defaultValue
  while (connections.length > 0 && !stopCondition(con)) {
    con = connections.shift() as Connectable
    visited.push(con)
    const filteredCons = con.connections.filter(
      c => !visited.includes(c) && ((closed && c.isClosed()) || !closed)
    )
    connections.push(...filteredCons)
    connectionTree.push(...filteredCons)
  }
  return [con, connectionTree]
}
