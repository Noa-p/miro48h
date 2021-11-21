import Config from './config'
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
/*
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
*/

// use lencloude
const API = 'https://xxantash.lc-cn-n1-shared.com'
const AppID = 'xxANTAShS739RtzLBQywDMMu-gzGzoHsz'
const AppKey = 'MaxXf4hdaoRRBQFxJenariKt'
const headers = {
  'X-LC-Id': AppID,
  'X-LC-Key': AppKey,
  'Content-Type': 'application/json'
}

const SetAppData = async (key, val) => {
  const url = API + '/1.1/classes/appData/' + Config.dataStoreKey
  const allData = await GetAllAppData()
  allData[key] = val
  return fetch(url, {
    body: `{"data": ${JSON.stringify(allData)}}`,
    headers,
    method: 'PUT'
  }).then(res => res.json())
}

const UpdateAppData = async (key, val) => {
  const data = await GetAppData(key)
  if (typeof data === 'object' && typeof val === 'object') {
    Object.assign(data, val)
    return SetAppData(key, data)
  }
  return SetAppData(key, val)
}

const GetAppData = async (key) => {
  const allData = await GetAllAppData()
  return allData[key]
}

const GetAllAppData = async () => {
  const url = API + '/1.1/classes/appData/' + Config.dataStoreKey
  return fetch(url, {
    headers,
    method: 'GET'
  }).then(res => res.json())
  .then(res => res.data)
}

export default {
  set: SetAppData,
  update: UpdateAppData,
  get: GetAppData,
  getall: GetAllAppData
}
