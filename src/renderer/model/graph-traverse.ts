import { Connectable } from '@/renderer/model/grid-model'

export const graphTraverse = (
  start: Connectable,
  stopCondition: Function,
  defaultValue: Connectable | null,
  closed = false
) => {
  const connections = start.connections
  const connectionTree = [...connections]
  const visited = [start]
  let con = defaultValue
  while (connections.length > 0 && !stopCondition(con)) {
    con = connections.shift()
    visited.push(con)
    const filteredCons = con.connections.filter(
      c => !visited.includes(c) && ((closed && con.closed) || !closed)
    )
    connections.push(...filteredCons)
    connectionTree.push(...filteredCons)
  }
}
