import Connectable from './connectable'
import { ConnectableWithError, ConnectionError } from '@/renderer/model/errors'
import Switch from './switch'
import Feeder from './feeder'
import Bus from './bus'

class Cable extends Connectable {
  constructor(ref: string) {
    super(ref, 2, true)
  }
}

export default Cable
