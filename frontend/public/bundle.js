
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

var State = {
  frameTagsOn: false
};

class Manager {
  constructor(eventType) {
    this._event = null;
    this.subs = {};
    this.type = eventType;
  }

  init() {
    EventRegister();
  }

  get event() {
    return this._event;
  }

  set event(eventName) {
    this._event = eventName;
  }

  sub(eventName, handler) {
    if (this.subs[eventName] === undefined) {
      this.subs[eventName] = [];
    }

    this.subs[eventName].push(handler);
  }

  async $emit(eventName, param) {
    if (!this.subs[eventName]) {
      return;
    }

    for (const fn of this.subs[eventName]) {
      await fn(param);
    } // this.subs[eventName].forEach(fn => fn(param))

  }

}

const EventType = {
  None: 0,
  CreateFrame: 1,
  // 新创建了一个frame
  SelectFrames: 3,
  // 选择了board上的若干frame
  ContainerUpdated: 4,
  // tag container被更新
  DeleteFrame: 5,
  // 删除frame
  TagsUpdated: 6
};
const Event = new Manager(EventType);

const filter = (items, type) => items.filter(e => e.type === type);

const diff = (a, b, type) => {
  const createKVFromObjectArray = arr => arr.reduce((pre, cur) => {
    pre[cur.id] = cur;
    return pre;
  }, {});

  const mapA = createKVFromObjectArray(a);
  const mapB = createKVFromObjectArray(b);
  const complementA = [];
  const complementB = [];

  for (const elemOfA of a) {
    if (mapB[elemOfA.id] == undefined) {
      complementA.push(elemOfA);
    }
  }

  for (const elemOfB of b) {
    if (mapA[elemOfB.id] === undefined) {
      complementB.push(elemOfB);
      break;
    }
  }

  return {
    a: filter(complementA, type),
    b: filter(complementB, type)
  };
};

let LastBoardNodes = null;
let LastSelectedItems = null;

const EventRegister = () => {
  return setInterval(async () => {
    if (!State.frameTagsOn) return;
    await miro.board.get().then(boardNodes => {
      if (!LastBoardNodes) {
        LastBoardNodes = boardNodes;
        return;
      }

      const complement = diff(LastBoardNodes, boardNodes, 'frame');

      if (complement.a.length > 0) {
        Event.$emit(EventType.DeleteFrame, complement.a);
      }

      if (complement.b.length > 0) {
        Event.$emit(EventType.CreateFrame, complement.b);
      }

      LastBoardNodes = boardNodes;
    });
    await miro.board.getSelection().then(items => {
      if (!LastSelectedItems) {
        LastSelectedItems = items;
        return;
      }

      const complement = diff(LastSelectedItems, items, 'frame');

      if (complement.b.length > 0) {
        Event.$emit(EventType.SelectFrames, complement.b);
      }

      LastSelectedItems = items;
    });
  }, 800);
};

const initPlugin = async () => {
  State.frameTagsOn = true;
  Event.init();
  await miro.board.ui.openPanel({
    pageUrl: 'panel.html',
    maxHeight: 430
  });
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
};

console.log('hello plugin loaded');
miro.board.ui.on("icon:click", async () => {
  console.log('icon clicked');
  initPlugin();
});
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
