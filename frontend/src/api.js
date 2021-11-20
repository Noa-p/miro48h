import Store from './store'

const ContainerKey = (tagName) => {
  return `${tagName}\$container`
}

const TagTextKey = (tagName) => {
  return `\$${tagName}`
}

const SetTag = (frameId, tag, containerWidgetId, valueKey, value) => {
  return Store.set(frameId, Metadata(tag, containerWidgetId, valueKey, value))
}
const UpdateTag = (frameId, tag, updatedData) => {
  // return Store.update(frameId, )
}

const GetFrameIdsByATag = () => {}

const GetTagsByFrameId = async (frameId) => {
  return Store.get(frameId)
}

const GetFrameByFrameId = async (frameId) => {
  // const frameData = await miro.board.widgets.get({id: frameId})
  // return frameData[0]
  const frameData = await fetch('/')
  return frameData
}

const Metadata = (tag, containerWidgetId, valueKey, value) => {
  return {
    [tag.name]: valueKey,
    [ContainerKey(tag.name)]: containerWidgetId,
    [TagTextKey(tag.name)]: value === undefined ? tag.values[valueKey] : value
  }
}
export default {
  ContainerKey,
  TagTextKey,
  SetTag,
  UpdateTag,
  GetFrameIdsByATag,
  GetTagsByFrameId,
  GetFrameByFrameId,
  Metadata
}
