import Tags from './tag.def'
import API from './api'
import MiroWrapper from './MiroSDKWrapper'

const CreateATagForACleanFrame = async (containerStyle, frame, tag, valueKey, value) => {
  const container = await MiroWrapper.createShapeContainer({
    shape: 'rectangle',
    content: value || tag.values[valueKey],
    width: 200,
    height: frame.height,
    x: frame.x - frame.width/2 + 100,
    y: frame.y,
    style: {
      fillColor: '#000',
    },
    ...containerStyle
  })
  await frame.add(container)
  return API.UpdateTag(frame.id, tag, container.id, valueKey, value)
}

const CreateATagForAFrame = async (containerStyle, frame, tag, initValueKey, initValue) => {
  const tags = await API.GetTagsByFrameId(frame.id)
  console.log(tags)
  if (!tags || !tags[tag.name]) {
    return CreateATagForACleanFrame(containerStyle, frame, tag, initValueKey, initValue)
  }
  const containerId = tags[API.ContainerKey(tag.name)]
  console.log('containerId', containerId)
  // 如果 container 被删除，创建一个新的 container
  const container = await miro.board.get({id: containerId})
  if (container.length === 0) {
    return CreateATagForACleanFrame(containerStyle, frame, tag, tags[tag.name], tags[API.TagTextKey(tag.name)])
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

const UpdateOwnerForAFrame = async (containerStyle, frame, ownerId, ownerName) => {
  await DeleteATagFromAFrame(frame, Tags.Owner)
  await CreateATagForAFrame(containerStyle, frame, Tags.Owner, ownerId, ownerName)
}

const UpdateStateForAFrame = async (containerStyle, frame, state) => {
  await DeleteATagFromAFrame(frame, Tags.State)
  await CreateATagForAFrame(containerStyle, frame, Tags.State, state)
}

const GenTrackerData = async () => {
  const data = await API.GetAllData()
  const res = []
  const allFramesId = Object.keys(data)
  const validFramesId = allFramesId.filter(
    frameId =>
      data[frameId][Tags.State.name]
      && data[frameId][Tags.Owner.name]
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
