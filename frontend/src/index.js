import State from './state'
import Event from './event'
import Action from './action'
import Tags from './tag.def'


const handleButtonClick = async () => {
  miro.board.ui.openLeftSidebar('sidebar.html')
}

const initPlugin = async () => {

  State.frameTagsOn = true
  Event.init()

  /*
  Event.sub(Event.type.CreateFrame, async (items) => {
    for (const frame of items) {
      Action.CreateATagForACleanFrame(
        frame, Tags.State, 'todo'
      )
    }
  })
  */
  /*
  Event.sub(Event.type.DeleteFrame, async (m) => {
    for (const frame of m) {
      Action.DeleteFrame(
        frame
      )
    }
  })
  */

  //调试用
  Event.sub(Event.type.SelectFrames, async (items) => {
    for (const frame of items) {
      console.log(frame.id)
      console.log(await miro.board.getAppData(frame.id))
      await Action.CreateATagForAFrame(
        frame, Tags.State, 'todo'
      )
      console.log(await miro.board.getAppData(frame.id))
    }
  })
}

console.log('hello plugin loaded')
miro.board.ui.on("icon:click", async () => {
  console.log('icon clicked')
  initPlugin()
})
/*
miro.onReady(async () => {
  const authorized = await miro.isAuthorized()
  if (authorized) {
    initPlugin()
  } else {
    const res = await miro.board.ui.openModal('not-authorized.html')
    if (res === 'success') {
      initPlugin()
    }
  }
})
*/
