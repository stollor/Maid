让女仆来帮助你吧!

通过maid来获取快捷的工具手脚架

---

# 原则

精悍优雅,快速健壮
模块统一,享受乐趣

---


# 目录说明

- **const**  `常量,接口,枚举类型定义处`
- **corekit** `核心内容`
    - **data**  `数据驱动`
- **plugs** `插件功能,启用即可生效`
    - **editor_preview_spine.ts** `可以在编辑器内预览spine动画`
    - **input** `自定义输入法组件`
- **shader** `shader效果`
- **utils**  `便捷方法封装`
- **index.ts** `封装出口`
- **temp**  `实验中的功能`
---

# core
## asset
资源管理器
```ts
maid.load<Prefab>("a/b/c").then((prefab) =>{
    ...
})

let prefab=await maid.load<Prefab>("a/b/c");
```

---
# 说明

# 功能说明

## 事件系统
EventManger
支持on,once,emit,off,offTarget.offEvent
常规的使用方式

## 数据绑定
DataListen

## UI管理

## 状态机

## 资源管理

## 网络管理

## 本地存储

## 语言管理

## 声音管理

## 红点系统

## 通用工具

## 通用组件
