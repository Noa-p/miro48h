const SetAppData = (key, val) => {
  return miro.board.setAppData(key, val)
}

const UpdateAppData = async (key, val) => {
  const data = await GetAppData(key)
  if (typeof data === 'object' && typeof val === 'object') {
    Object.assign(data, val)
    return SetAppData(key, data)
  }
  return SetAppData(key, val)
}

const GetAppData = (key) => {
  return miro.board.getAppData(key)
}

export default {
  set: SetAppData,
  update: UpdateAppData,
  get: GetAppData
}
