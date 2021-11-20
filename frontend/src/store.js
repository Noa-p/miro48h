/*
const SetAppData = (key, val) => {
  console.log('set:', key, val)
  return miro.board.setAppData(key, val)
}

const UpdateAppData = async (key, val) => {
  const data = await GetAppData(key)
  console.log('update old:', data)
  if (typeof data === 'object' && typeof val === 'object') {
    Object.assign(data, val)
    return SetAppData(key, data)
  }
  return SetAppData(key, val)
}

const GetAppData = (key) => {
  return miro.board.getAppData(key)
    .then(data => {
      console.log('get:', key, data)
      return data
    })
}
*/

// In Memory for debug
const Memory = {}
const SetAppData = (key, val) => {
  Memory[key] = val
  return val
}

const UpdateAppData = (key, val) => {
  const data = GetAppData(key)
  if (typeof data === 'object' && typeof val === 'object') {
    Object.assign(data, val)
    return SetAppData(key, data)
  }
  return SetAppData(key, val)
}

const GetAppData = (key) => {
  return Memory[key]
}

const GetAllAppData = () => {
  return Memory
}


export default {
  set: SetAppData,
  update: UpdateAppData,
  get: GetAppData,
  getall: GetAllAppData
}
