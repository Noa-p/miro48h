'use strict';

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

const EventRegister = () => {
  return setInterval(async () => {
    return;
  }, 800);
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

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = ".btn {\n    width: 100px;\n}\n\n.app {\n    display: flex;\n    align-items: center;\n    align-content: center;\n    flex-direction: column;\n    gap: 18px;\n}\n\n.tags {\n    color: #fff;\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    align-items: center;\n    align-content: center;\n}\n\n.tag {\n    margin: 8px;\n    text-align: center;\n    width: 260px;\n    height: 40px;\n    border-radius: 5px;\n    cursor: pointer;\n}\n.tag p {\n    line-height: 1em;\n    font-weight: bold;\n}\n\n.diver {\n    border-top: 1px solid rgb(196, 196, 196);\n    width: 90%;\n    margin: 30 10 10 20;\n}\n\n.tracker {\n    text-align: center;\n    width: 260px;\n    border-radius: 5px;\n    cursor: pointer;\n}\n.tracker p {\n    line-height: 1em;\n    font-weight: bold;\n    font-size: 20px;\n    color: #888;\n}";
n(css,{});

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

const tags = [//{name: 'assign', bgColor: '#000'},
{
  name: 'todo',
  title: 'TO DO',
  bgColor: '#BDBDBD'
}, {
  name: 'inprocess',
  title: 'IN PROCESS',
  bgColor: '#FAC710'
}, {
  name: 'done',
  title: 'DONE',
  bgColor: '#2D9BF0'
}, {
  name: 'undermodified',
  title: 'MODIFYING',
  bgColor: '#F24726'
}];

const App = () => {
  const handleTrackerVisible = async () => {
    await miro.board.ui.closePanel();
    await miro.board.ui.openPanel({
      pageUrl: 'tracker.html',
      maxHeight: 800
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tags"
  }, /*#__PURE__*/React.createElement("input", {
    id: "assign_name",
    name: "assign_name",
    type: "text"
  }), /*#__PURE__*/React.createElement("div", {
    key: "assign",
    className: "tag",
    style: {
      backgroundColor: '#000'
    },
    onClick: async () => {
      const name = document.getElementById('assign_name').value;
      console.log(name);
      const frames = await API.GetSelectionFrames();

      for (const frame of frames) {
        Action.UpdateOwnerForAFrame({
          height: 30,
          width: 130,
          x: frame.x + frame.width / 2 - 130 / 2 - 130,
          y: frame.y - frame.height / 2 + 30 / 2,
          style: {
            fillColor: '#ccc'
          }
        }, frame, '', name);
      }
    }
  }, /*#__PURE__*/React.createElement("p", null, "ASSIGN")), tags.map(i => {
    return /*#__PURE__*/React.createElement("div", {
      key: i.name,
      className: "tag",
      style: {
        backgroundColor: i.bgColor
      },
      onClick: async () => {
        const frames = await API.GetSelectionFrames();
        console.log(frames);

        for (const frame of frames) {
          Action.UpdateStateForAFrame({
            height: 30,
            width: 130,
            x: frame.x + frame.width / 2 - 130 / 2,
            y: frame.y - frame.height / 2 + 30 / 2,
            style: {
              fillColor: i.bgColor
            }
          }, frame, i.name);
        }
      }
    }, /*#__PURE__*/React.createElement("p", null, i.title));
  })), /*#__PURE__*/React.createElement("div", {
    className: "diver"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tracker",
    style: {
      backgroundColor: '#fff'
    },
    onClick: handleTrackerVisible
  }, /*#__PURE__*/React.createElement("p", null, "Process Tracker")));
};

const domContainer = document.querySelector('#container');
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), domContainer);
