import Tags from './tag.def'
import API from './api'

const CreateATagForACleanFrame = async (frame, tag, valueKey) => {
  const frameData = await miro.board.widgets.get({id: frame.id})
  const widget = await miro.board.widgets.create({
    type: 'card', title: Tags.State.values.todo,
    x: frameData[0].x, y: frameData[0].y
  })
  frame.metadata = API.Metadata(tag, widget[0].id, valueKey)
  await miro.board.widgets.update(frame)
}

const CreateATagForAFrame = async (frame, tag, initValueKey) => {
  const tags = await API.GetTagsByFrameId(frame.id)
  if (!tags || !tags[tag.name]) {
    CreateATagForACleanFrame(frame, tag, initValueKey)
    return
  }
  const containerId = tags[API.ContainerKey(tag.name)]
  console.log('containerId', containerId)
  // 如果 container 被删除，创建一个新的 container
  const container = await miro.board.widgets.get({id: containerId})
  if (container.length === 0) {
    CreateATagForACleanFrame(frame, tag, tags[tag.name])
  }
}

export default {
  CreateATagForACleanFrame,
  CreateATagForAFrame
}
