
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

var Tags = {
  State: {
    name: 'State',
    values: {
      todo: 'Todo',
      inprocess: 'InProcess',
      done: 'Done',
      undermodified: 'Undermodified'
    }
  },
  Owner: {
    name: 'Owner'
  }
};

var Config = {
  ClientID: '3074457367848344047',
  dataStoreKey: '6199a73b83ad7a74a1c3ef05'
};

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

const API$1 = 'https://xxantash.lc-cn-n1-shared.com';
const AppID = 'xxANTAShS739RtzLBQywDMMu-gzGzoHsz';
const AppKey = 'MaxXf4hdaoRRBQFxJenariKt';
const headers = {
  'X-LC-Id': AppID,
  'X-LC-Key': AppKey,
  'Content-Type': 'application/json'
};

const SetAppData = async (key, val) => {
  const url = API$1 + '/1.1/classes/appData/' + Config.dataStoreKey;
  const allData = await GetAllAppData();
  allData[key] = val;
  return fetch(url, {
    body: `{"data": ${JSON.stringify(allData)}}`,
    headers,
    method: 'PUT'
  }).then(res => res.json());
};

const UpdateAppData = async (key, val) => {
  const data = await GetAppData(key);

  if (typeof data === 'object' && typeof val === 'object') {
    Object.assign(data, val);
    return SetAppData(key, data);
  }

  return SetAppData(key, val);
};

const GetAppData = async key => {
  const allData = await GetAllAppData();
  return allData[key];
};

const GetAllAppData = async () => {
  const url = API$1 + '/1.1/classes/appData/' + Config.dataStoreKey;
  return fetch(url, {
    headers,
    method: 'GET'
  }).then(res => res.json()).then(res => res.data);
};

var Store = {
  set: SetAppData,
  update: UpdateAppData,
  get: GetAppData,
  getall: GetAllAppData
};

const ContainerKey = tagName => {
  return `${tagName}_container`;
};

const TagTextKey = tagName => {
  return `_${tagName}`;
};

const UpdateTag = (frameId, tag, containerWidgetId, valueKey, value) => {
  return Store.update(frameId, Metadata(tag, containerWidgetId, valueKey, value)).then(data => {
    Event.$emit(Event.type.TagsUpdated, data);
    return data;
  });
};

const GetFrameIdsByATag = () => {};

const GetTagsByFrameId = frameId => {
  return Store.get(frameId);
};

const GetFrameByFrameId = async frameId => {
  // const frameData = await miro.board.widgets.get({id: frameId})
  // return frameData[0]
  const frameData = await fetch('/');
  return frameData;
};

const GetSelectionFrames = () => {
  const filter = (items, type) => items.filter(e => e.type === type);

  return miro.board.getSelection().then(items => {
    return filter(items, 'frame');
  });
};

const Metadata = (tag, containerWidgetId, valueKey, value) => {
  return {
    [tag.name]: valueKey,
    [ContainerKey(tag.name)]: containerWidgetId,
    [TagTextKey(tag.name)]: value === undefined ? tag.values[valueKey] : value
  };
};

const GetAllData = () => {
  return Store.getall();
};

var API = {
  ContainerKey,
  TagTextKey,
  UpdateTag,
  GetFrameIdsByATag,
  GetTagsByFrameId,
  GetFrameByFrameId,
  Metadata,
  GetAllData,
  GetSelectionFrames
};

var MiroWrapper = {
  createFrame(props) {
    return miro.board.createFrame(props).then(frame => {
      Event.$emit(Event.type.createFrame, frame);
      return frame;
    });
  },

  createShapeContainer(props) {
    return miro.board.createShape(props).then(shape => {
      Event.$emit(Event.type.ContainerUpdated, shape);
      return shape;
    });
  },

  createTextContainer(props) {
    return miro.board.createText(props).then(text => {
      Event.$emit(Event.type.ContainerUpdated, text);
      return text;
    });
  }

};

const CreateATagForACleanFrame = async (containerStyle, frame, tag, valueKey, value) => {
  const container = await MiroWrapper.createShapeContainer({
    content: value || tag.values[valueKey],
    width: 200,
    height: frame.height,
    x: frame.x - frame.width / 2 + 100,
    y: frame.y,
    style: {
      fillColor: '#000'
    },
    ...containerStyle
  });
  await frame.add(container).catch(e => console.log(e));
  return API.UpdateTag(frame.id, tag, container.id, valueKey, value);
};

const CreateATagForAFrame = async (containerStyle, frame, tag, initValueKey, initValue) => {
  const tags = await API.GetTagsByFrameId(frame.id);
  console.log(tags);

  if (!tags || !tags[tag.name]) {
    return CreateATagForACleanFrame(containerStyle, frame, tag, initValueKey, initValue);
  }

  const containerId = tags[API.ContainerKey(tag.name)];
  console.log('containerId', containerId); // 如果 container 被删除，创建一个新的 container

  const container = await miro.board.get({
    id: containerId
  }).catch(() => []);

  if (container.length === 0) {
    return CreateATagForACleanFrame(containerStyle, frame, tag, tags[tag.name], tags[API.TagTextKey(tag.name)]);
  }
};

const DeleteATagFromAFrame = async (frame, tag) => {
  const tags = await API.GetTagsByFrameId(frame.id);
  console.log('tags: ', tags);
  if (!tags) return;
  const containerId = tags[API.ContainerKey(tag.name)];
  console.log('containerId', containerId);
  const container = await miro.board.get({
    id: containerId
  }).catch(() => []);
  console.log(container);

  if (container.length !== 0) {
    await miro.board.remove(container[0]).catch(e => console.log(e));
  }

  return API.UpdateTag(frame.id, tag, null, null, null);
};

const UpdateOwnerForAFrame = async (containerStyle, frame, ownerId, ownerName) => {
  await DeleteATagFromAFrame(frame, Tags.Owner);
  await CreateATagForAFrame(containerStyle, frame, Tags.Owner, ownerId, ownerName);
};

const UpdateStateForAFrame = async (containerStyle, frame, state) => {
  await DeleteATagFromAFrame(frame, Tags.State);
  await CreateATagForAFrame(containerStyle, frame, Tags.State, state);
};

const GenTrackerData = async () => {
  const data = await API.GetAllData();
  const res = [];
  const allFramesId = Object.keys(data);
  const validFramesId = allFramesId.filter(frameId => data[frameId][Tags.State.name] && data[frameId][Tags.Owner.name]);
  let framesData = await miro.board.get({
    id: validFramesId
  });
  framesData = framesData.reduce((pre, cur) => {
    pre[cur.id] = cur;
    return pre;
  }, {});
  validFramesId.forEach(frameId => {
    res.push({
      frameData: framesData[frameId],
      state: {
        type: data[frameId][Tags.State.name],
        text: data[frameId][API.TagTextKey(Tags.State.name)]
      },
      owner: {
        id: data[frameId][Tags.Owner.name],
        name: data[frameId][API.TagTextKey(Tags.Owner.name)]
      }
    });
  });
  return res;
};

var Action = {
  CreateATagForACleanFrame,
  CreateATagForAFrame,
  DeleteATagFromAFrame,
  GenTrackerData,
  UpdateOwnerForAFrame,
  UpdateStateForAFrame
};

const initPlugin = async () => {
  State.frameTagsOn = true;
  Event.init();
  await miro.board.ui.openPanel({
    pageUrl: 'panel.html',
    maxHeight: 420
  });
  Event.sub(Event.type.CreateFrame, async items => {
    for (const frame of items) {
      Action.CreateATagForACleanFrame({
        height: 30,
        width: 130,
        x: frame.x + frame.width / 2 - 130 / 2,
        y: frame.y - frame.height / 2 + 30 / 2,
        style: {
          fillColor: '#ccc'
        }
      }, frame, Tags.State, 'todo');
    }
  });
  Event.sub(Event.type.DeleteFrame, async m => {
    for (const frame of m) {
      await Action.DeleteATagFromAFrame(frame, Tags.State);
      await Action.DeleteATagFromAFrame(frame, Tags.Owner);
    }
  }); //调试用

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
