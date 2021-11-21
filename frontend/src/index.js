import State from './state'
import Event from './event'
import Action from './action'
import Tags from './tag.def'
import Store from './store'


const handleButtonClick = async () => {
  miro.board.ui.openLeftSidebar('sidebar.html')
}

const initPlugin = async () => {

  State.frameTagsOn = true
  Event.init()

  await miro.board.ui.openPanel({
    pageUrl: '/public/panel.html',
    maxHeight: 430,
  })
  Event.sub(Event.type.CreateFrame, async (items) => {
    for (const frame of items) {
      Action.CreateATagForACleanFrame(
        {
          height: 30,
          width: 130,
          x: frame.x + frame.width/2 - 130 / 2,
          y: frame.y - frame.height / 2 + 30 / 2,
          style: {
            fillColor: '#ccc'
          }
        },
        frame, Tags.State, 'todo'
      )
    }
  })
  Event.sub(Event.type.DeleteFrame, async (m) => {
    for (const frame of m) {
      await Action.DeleteATagFromAFrame(frame, Tags.State)
      await Action.DeleteATagFromAFrame(frame, Tags.Owner)
    }
  })

  //调试用
  /*
  Event.sub(Event.type.SelectFrames, async (items) => {
    for (const frame of items) {
      console.log(frame.id)
      // console.log(await miro.board.getAppData(frame.id))
      await Action.CreateATagForAFrame(
        {
          height: 50
        },
        frame, Tags.State, 'todo'
      )
      await Action.CreateATagForAFrame(
        {
          height: 50,
          style: {
            fillColor: '#b22222',
          },
        },
        frame, Tags.Owner, '<userId>', 'mengru'
      )
    }
  })
  */
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
