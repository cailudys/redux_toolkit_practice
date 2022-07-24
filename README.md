# 状态切片

## 1. 创建状态切片，并导出 reudcer 函数和 actions creator 函数（调用 createSlice）

```js
// 1. 导入创建切片的函数
import { createSlice } from "@reduxjs/toolkit";

export const TODOS_FEATURE_KEY = "todos";

// 2. 创建切片对象
// creteSlice方法的返回值是一个对象
// 这个reducer是一个函数
// 一个应用中有可能会有很多状态切片，所以我们要给reducer一个别名防止冲突。
// actions是一个对象，里面会存储一个到多个action creator函数
// 当我们在reducers中创建了一个属性，那么插件会帮助我们自动创建一个同名的actioncreator函数，并保存在切片对象中。也就是说在组件中我们可以把addTodo传递给dispatch触发action.
const { reudcer: TodosReducer, actions } = createSlice({
  // name是状态切片的唯一标识，是个字符串；在好几个地方用到，所以定义成常量。
  name: TODOS_FEATURE_KEY,
  // initialState 是指初始状态
  initialState: [],
  // reducers的值是一个 普通对象，对象中的属性名是我们自己定义的，其实就是action.type 的值。
  // 单纯的rudex或者redux-saga中，都是返回state；切片中而是直接操作state才行。
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
  },
});

// 3. 从创建的切片中导出我们需要用到的对象。
// 创建store的时候需要用到 reducer，所以我们需要导出 TodosReducer
// 触发action是需要用到对应的action所以我们需要导出 action creator
export const { addTodo } = actions;
export default TodosReducer;

// 总结： 也就是只需要调用createSlice方法并配置好参数，方法就会自动返回reducer函数和action creator函数，不需要我们自己去实现了（其实配置中写的reducers也基本就是reducer函数了。）
```
