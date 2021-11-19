
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
'use strict';

var appIcon = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>';

var State = {
  frameTagsOn: false
};

const EventType = {
  None: 0,
  CreateFrame: 1,
  UpdateFrameTitle: 2,
  SeletAFrame: 3,
  TagUpdated: 4,
};

class Manager {
  constructor () {
    this._event = EventType.None;
    this.subs = {};
    this.type = EventType;
  }
  init () {
    EventRegister();
  }
  get event () {
    return this._event
  }
  set event (eventName) {
    this._event = eventName;
  }
  sub (eventName, handler) {
    if (this.subs[eventName] === undefined) {
      this.subs[eventName] = [];
    }
    this.subs[eventName].push(handler);
  }
  async $emit (eventName, param) {
    if (!this.subs[eventName]) {
      return
    }
    for (const fn of this.subs[eventName]) {
      await fn(param);
    }
    // this.subs[eventName].forEach(fn => fn(param))
  }
}

const Event = new Manager();

const filter = (m, type) => m.data.filter(e => e.type === type);

const EventRegister = () => {
  miro.addListener('SELECTION_UPDATED', m => {
    const frameList = filter(m, 'FRAME');
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.SeletAFrame, frameList);
    }
  });
  miro.addListener('WIDGETS_CREATED', m => {
    const frameList = filter(m, 'FRAME');
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.CreateFrame, frameList);
    }
  });
  miro.addListener('METADATA_CHANGED', m => {
    const frameList = filter(m, 'FRAME');
    if (frameList.length && State.frameTagsOn) {
      Event.$emit(Event.type.TagUpdated, frameList);
    }
  });
  miro.addListener('CANVAS_CLICKED', m => {
  });
  miro.addListener('WIDGETS_TRANSFORMATION_UPDATED', m => {
  });
  miro.addListener('WIDGETS_DELETED', m => {
  });
};

var Tags = {
  State: {
    name: 'State',
    values: {
      todo: 'todo',
      doing: 'doing',
      done: 'done'
    }
  },
  Owner: {
    name: 'Owner'
  }
};

var Config = {
 ClientID: '3074457367848344047'
};

const { ClientID } = Config;

function ContainerKey (tagName) {
  return `${tagName}\$container`
}

function TagTextKey (tagName) {
  return `\$${tagName}`
}

function UpdateTag () {}

function GetFrameIdsByATag () {}

async function GetTagsByFrameId (frameId)  {
  const frameData = await miro.board.widgets.get({id: frameId});
  return frameData[0].metadata[ClientID]
}

function Metadata (tag, containerWidgetId, valueKey, value) {
  return {
    [ClientID]: {
      [tag.name]: valueKey,
      [ContainerKey(tag.name)]: containerWidgetId,
      [TagTextKey(tag.name)]: value === undefined ? tag.values[valueKey] : value
    }
  }
}
var API = {
  ContainerKey,
  TagTextKey,
  UpdateTag,
  GetFrameIdsByATag,
  GetTagsByFrameId,
  Metadata
};

const CreateATagForACleanFrame = async (frame, tag, valueKey) => {
  const frameData = await miro.board.widgets.get({id: frame.id});
  const widget = await miro.board.widgets.create({
    type: 'card', title: Tags.State.values.todo,
    x: frameData[0].x, y: frameData[0].y
  });
  frame.metadata = API.Metadata(tag, widget[0].id, valueKey);
  await miro.board.widgets.update(frame);
};

const CreateATagForAFrame = async (frame, tag, initValueKey) => {
  const tags = await API.GetTagsByFrameId(frame.id);
  if (!tags || !tags[tag.name]) {
    CreateATagForACleanFrame(frame, tag, initValueKey);
    return
  }
  const containerId = tags[API.ContainerKey(tag.name)];
  console.log('containerId', containerId);
  // 如果 container 被删除，创建一个新的 container
  const container = await miro.board.widgets.get({id: containerId});
  if (container.length === 0) {
    CreateATagForACleanFrame(frame, tag, tags[tag.name]);
  }
};

var Action = {
  CreateATagForACleanFrame,
  CreateATagForAFrame
};

const initPlugin = async () => {

  State.frameTagsOn = true;
  Event.init();

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

  Event.sub(Event.type.CreateFrame, async (m) => {
    for (const frame of m) {
      Action.CreateATagForACleanFrame(
        frame, Tags.State, 'todo'
      );
    }
  });
  // 调试用
  Event.sub(Event.type.SeletAFrame, async (m) => {
    for (const frame of m) {
      console.log(await miro.board.widgets.get({id: frame.id}));
      Action.CreateATagForAFrame(
        frame, Tags.State, 'todo'
      );
      console.log(await miro.board.widgets.get({id: frame.id}));
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
