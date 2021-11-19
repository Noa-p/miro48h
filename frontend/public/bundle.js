
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

var appIcon = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>';

const initPlugin = async () => {
  const icon24 = appIcon;

  await miro.initialize({
    extensionPoints: {
      bottomBar: {
        title: 'smart frame',
        svgIcon: icon24,
        onClick: () => {
          alert('Bottom bar item has been clicked');
        }
      },
    }
  });
};

miro.onReady(async () => {
  const authorized = await miro.isAuthorized();
	if (authorized) {
		initPlugin();
	} else {
		const res = await miro.board.ui.openModal('not-authorized.html');
		if (res === 'success') {
			initPlugin();
		}
	}
});
