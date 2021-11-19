import appIcon from './icon'

const initPlugin = async () => {
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

