import Config from './config'

const { ClientID } = Config

const ContainerKey = (tagName) => {
  return `${tagName}\$container`
}

const TagTextKey = (tagName) => {
  return `\$${tagName}`
}

const UpdateTag = () => {}

const GetFrameIdsByATag = () => {}

const GetTagsByFrameId = async (frameId) => {
  const frameData = await miro.board.widgets.get({id: frameId})
  return frameData[0].metadata[ClientID]
}

const Metadata = (tag, containerWidgetId, valueKey, value) => {
  return {
    [ClientID]: {
      [tag.name]: valueKey,
      [ContainerKey(tag.name)]: containerWidgetId,
      [TagTextKey(tag.name)]: value === undefined ? tag.values[valueKey] : value
    }
  }
}
export default {
  ContainerKey,
  TagTextKey,
  UpdateTag,
  GetFrameIdsByATag,
  GetTagsByFrameId,
  Metadata
}
