import Config from './config'

const { ClientID } = Config

function ContainerKey (tagName) {
  return `${tagName}\$container`
}

function TagTextKey (tagName) {
  return `\$${tagName}`
}

function UpdateTag () {}

function GetFrameIdsByATag () {}

async function GetTagsByFrameId (frameId)  {
  const frameData = await miro.board.widgets.get({id: frameId})
  return frameData[0].metadata[ClientID]
}

function Metadata (tag, containerWidgetId, valueKey, value) {
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
