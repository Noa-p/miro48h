import State from './state'

const EventType = {
  None: 0,
  CreateFrame: 1,
  UpdateFrameTitle: 2,
  SeletAFrame: 3,
  TagUpdated: 4,
}

class Manager {
  constructor () {
    this._event = EventType.None
    this.subs = {}
    this.type = EventType
  }
  init () {
    EventRegister()
  }
  get event () {
    return this._event
  }
  set event (eventName) {
    this._event = eventName
  }
  sub (eventName, handler) {
    if (this.subs[eventName] === undefined) {
      this.subs[eventName] = []
    }
    this.subs[eventName].push(handler)
  }
  async $emit (eventName, param) {
    if (!this.subs[eventName]) {
      return
    }
    for (const fn of this.subs[eventName]) {
      await fn(param)
    }
    // this.subs[eventName].forEach(fn => fn(param))
  }
}

const Event = new Manager()

const filter = (m, type) => m.data.filter(e => e.type === type)

const EventRegister = () => {
  miro.addListener('SELECTION_UPDATED', m => {
    const frameList = filter(m, 'FRAME')
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.SeletAFrame, frameList)
    }
  })
  miro.addListener('WIDGETS_CREATED', m => {
    const frameList = filter(m, 'FRAME')
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.CreateFrame, frameList)
    }
  })
  miro.addListener('METADATA_CHANGED', m => {
    const frameList = filter(m, 'FRAME')
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.TagUpdated, frameList)
    }
  })
  miro.addListener('CANVAS_CLICKED', m => {
  })
  miro.addListener('WIDGETS_TRANSFORMATION_UPDATED', m => {
  })
  miro.addListener('WIDGETS_DELETED', m => {
  })
}

export default Event
