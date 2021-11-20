import Tags from './tag.def'
import API from './api'
import MiroWrapper from './MiroSDKWrapper'

const CreateATagForACleanFrame = async (frame, tag, valueKey, value) => {
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
  return API.UpdateTag(frame.id, tag, container.id, valueKey, value)
}

const CreateATagForAFrame = async (frame, tag, initValueKey, initValue) => {
  const tags = await API.GetTagsByFrameId(frame.id)
  console.log(tags)
  if (!tags || !tags[tag.name]) {
    return CreateATagForACleanFrame(frame, tag, initValueKey, initValue)
  }
  const containerId = tags[API.ContainerKey(tag.name)]
  console.log('containerId', containerId)
  // 如果 container 被删除，创建一个新的 container
  const container = await miro.board.get({id: containerId})
  if (container.length === 0) {
    return CreateATagForACleanFrame(frame, tag, tags[tag.name], tags[API.TagTextKey(tag.name)])
  }
}

const DeleteATagFromAFrame = async (frame, tag) => {
  const tags = await API.GetTagsByFrameId(frame.id)
  const containerId = tags[API.ContainerKey(tag.name)]
  const container = await miro.board.get({id: containerId})
  if (container.length !== 0) {
    await miro.board.remove(container)
  }
  return API.UpdateTag(frame.id, tag, null, null, null)
}

const UpdateOwnerForAFrame = async (frame, ownerId, ownerName) => {
  await DeleteATagFromAFrame(frame, Tags.Owner)
  await CreateATagForAFrame(frame, Tags.Owner, ownerId, ownerName)
}

const UpdateStateForAFrame = async (frame, state) => {
  await DeleteATagFromAFrame(frame, Tags.State)
  await CreateATagForAFrame(frame, Tags.State, state)
}

const GenTrackerData = () => {
  const data = API.GetAllData()
  const res = []
  const allFramesId = Object.keys(data)
  const validFramesId = allFramesId.map(
    frameId =>
      data[frameId][Tags.State.name]
      && data[frameId][Tags.Owner]
  )
  let framesData = await miro.board.get({id: validFramesId})
  framesData = framesData.reduce((pre, cur) => {
    pre[cur.id] = cur
    return pre
  }, {})
  validFramesId.forEach(frameId => {
    res.push({
      frameData: framesData[frameId],
      state: {
        type: data[frameId][Tags.State.name],
        text: data[frameId][API.TagTextKey(Tags.State.name)]
      },
      owner: {
        id: data[frameId][Tags.Owner.name],
        name: data[frameId][API.TagTextKey(Tags.Owner.name)]
      }
    })
  })
  return res
}

export default {
  CreateATagForACleanFrame,
  CreateATagForAFrame,
  DeleteATagFromAFrame,
  GenTrackerData,
  UpdateOwnerForAFrame,
  UpdateStateForAFrame,
}
