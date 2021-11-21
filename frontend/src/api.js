import Store from './store'
import Event from './event'

const ContainerKey = (tagName) => {
  return `${tagName}_container`
}

const TagTextKey = (tagName) => {
  return `_${tagName}`
}

const UpdateTag = (frameId, tag, containerWidgetId, valueKey, value) => {
  return Store.update(frameId, Metadata(tag, containerWidgetId, valueKey, value))
    .then((data) => {
      Event.$emit(Event.type.TagsUpdated, data)
      return data
    })
}

const GetFrameIdsByATag = () => {}

const GetTagsByFrameId = (frameId) => {
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

const GetAllData = () => {
  return Store.getall()
}

export default {
  ContainerKey,
  TagTextKey,
  UpdateTag,
  GetFrameIdsByATag,
  GetTagsByFrameId,
  GetFrameByFrameId,
  Metadata,
  GetAllData
}
