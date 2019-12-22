import Connectable from '@/renderer/model/connectable'
import Feeder from '@/renderer/model/feeder'
import Switch from '@/renderer/model/switch'

export interface GridObjectClass {
  name: string
  prototype: Connectable
}

export interface SSConnection {
  connection: {
    parent: Connectable
    child: Connectable
    switches: Switch[]
  }
}

export interface SSConnectionTree {
  feeders: Feeder[]
  connection: {
    parent: Connectable
    child: Connectable
    switches: Switch[]
  }[]
}
