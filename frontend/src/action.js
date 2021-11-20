import Tags from './tag.def'
import API from './api'
import MiroWrapper from './MiroSDKWrapper'

const CreateATagForACleanFrame = async (frame, tag, valueKey) => {
  const container = await MiroWrapper.createShapeContainer({
    shape: 'rectangle',
    content: Tags.State.values.todo,
    width: 200,
    height: frame.height,
    x: frame.x - frame.width/2 + 100,
    y: frame.y,
    style: {
      fillColor: '#000',
    },
  })
  await frame.add(container)
  return API.SetTag(frame.id, tag, container.id, valueKey)
}

const CreateATagForAFrame = async (frame, tag, initValueKey) => {
  console.log(frame.id)
  const tags = await miro.board.getAppData(frame.id) //await API.GetTagsByFrameId(frame.id)
  if (!tags || !tags[tag.name]) {
    console.log(tags[tag.name])
    return CreateATagForACleanFrame(frame, tag, initValueKey)
  }
  const containerId = tags[API.ContainerKey(tag.name)]
  console.log('containerId', containerId)
  // 如果 container 被删除，创建一个新的 container
  const container = await miro.board.get({id: containerId})
  if (container.length === 0) {
    return CreateATagForACleanFrame(frame, tag, tags[tag.name])
  }
}

const DeleteFrame = async (frame) => {
  const tags = await API.GetFrameByFrameId(frame.id)
  for (const tag of tags) {
    await miro.board.widgets.deleteById(frame.metadata[CLIENT_ID][`${tag}\$container`])
  }
}

export default {
  CreateATagForACleanFrame,
  CreateATagForAFrame,
  DeleteFrame
}
