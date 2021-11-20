import State from './state'

const EventType = {
  None: 0,
  CreateFrame: 1, // 新创建了一个frame
  UpdateFrameTitle: 2, // 无法实现，废弃
  SeletAFrame: 3, // 选择了board上的一个frame
  TagUpdated: 4, // tag被更新（实际上是metadata产生变化）
  DeleteFrame: 5, // 删除frame
  // 继续添加
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
  miro.addListener('WIDGETS_DELETED', async m => {
    const frameList = []
    for (const delWidget of m.data) {
      const dw = await miro.board.widgets.get({id: delWidget.id})
      if (dw.type == "FRAME") frameList.push(dw)
    }
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.DeleteFrame, frameList)
    } 
  })
}

export default Event
