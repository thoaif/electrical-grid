import GridModel from '@/renderer/model/grid-model'
import Bus from '@/renderer/model/bus'

// TODO: Write tests for parent - child
class SubStation extends GridModel {
  private _buses: Bus[]

  constructor(ref: string) {
    super(ref)
    this._buses = []
  }

  get buses(): Bus[] {
    return this._buses
  }

  addBus(bus: Bus): void {
    if (!this._buses.includes(bus)) {
      this._buses.push(bus)
    }
  }

  removeChild(bus: Bus): void {
    const index = this._buses.indexOf(bus)
    if (index !== -1) {
      this._buses.splice(index, 1)
    }
  }
}

export default SubStation
