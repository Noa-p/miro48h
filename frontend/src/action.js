import Tags from './tag.def'
import API from './api'
import { ClientID } from './config'

const CreateATagForACleanFrame = async (frame, tag, valueKey) => {
  const frameData = await miro.board.widgets.get({id: frame.id})
  const widget = await miro.board.widgets.create({
    type: 'SHAPE', 
    title: Tags.State.values.todo,
    width: 200,
    height: frameData[0].height,
    x: frameData[0].x - frameData[0].width/2 + 100,
    y: frameData[0].y,
    style: {
      backgroundColor: '#000',
    },
    // metadata: {
    //   [ClientID]: {
    //     frameId: frame.id
    //   }
    // }
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
