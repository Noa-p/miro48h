# miro48h

## How to run

Clone this repo and enter `frontend/`, run commands:
```
npm i && npm run dev
```
you can run a server listening port `8082` in your local.

Then go to [this url](https://miro.com/oauth/authorize/?response_type=code&client_id=3074457367848344047&redirect_uri=%2Fconfirm-app-install%2F) to install the plugin.

## Code Structure

api：提炼抽象后的最简业务逻辑

event：根据业务所抽象的来自board的事件

action: 业务逻辑

state: 插件的全局状态（比如是否被开启）

config: 放ClientID
```
export default {
  ClientID: ''
}
```

tag: 

一个tag在metadata中的表示：
```
{
  <tagName>: valueKey 或其它,
  $<tagName>: tag.values[valueKey] 或其它,
  <tagName>$container: 显示$<tagName>的值的widget的id
}
```

model:

```
Event.sub(事件名, async (m) => {
  action调用
})

// 比如：
Event.sub(Event.type.CreateFrame, async (m) => {
  for (const frame of m) {
    Action.CreateATagForACleanFrame(
      frame, Tags.State, 'todo'
    )
  }
})
```

# Thanks

Our team work record:

![截图留念](https://user-images.githubusercontent.com/80361883/142756765-75ee32e7-57f8-4a30-8d84-84ade4fd867c.PNG)

Thanks for everyone!
