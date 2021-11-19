# miro48h

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

## 基本结构

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

## 发现的问题

metadata好像不能持久化？我这边一刷新widget的metadata就没了

如果确认 metadata 确实无法持久化，就需要上后端
