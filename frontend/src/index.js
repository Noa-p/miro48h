import appIcon from './icon'
import State from './state'
import Event from './event'
import Action from './action'
import Tags from './tag.def'

const initPlugin = async () => {

  State.frameTagsOn = true
  Event.init()

  const icon24 = appIcon

  await miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'smart frame',
        svgIcon: icon24,
        onClick: () => {
          alert('Bottom bar item has been clicked')
        }
      },
    }
  })

  Event.sub(Event.type.CreateFrame, async (m) => {
    for (const frame of m) {
      Action.CreateATagForACleanFrame(
        frame, Tags.State, 'todo'
      )
    }
  })
  // 调试用
  Event.sub(Event.type.SeletAFrame, async (m) => {
    for (const frame of m) {
      console.log(await miro.board.widgets.get({id: frame.id}))
      Action.CreateATagForAFrame(
        frame, Tags.State, 'todo'
      )
      console.log(await miro.board.widgets.get({id: frame.id}))
    }
  })
}

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

