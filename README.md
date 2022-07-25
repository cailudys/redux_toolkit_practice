# 1. 用工具集创建状态切片，并导出 reudcer 函数和 actions creator 函数（调用 createSlice）

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

# 2. 用工具集创建 store

```js
import { configureStore } from "@reduxjs/toolkit";
// 这里TodosRedcer 是整个todos切片里所有reudcer的合集。
import TodosReducer, { TODOS_FEATURE_KEY } from "./todos.slice";

export default configureStore({
  // 使用工具集之前，我们会定义许多reducer 最终用combinereducer合并所有reducer，并传入createStore函数。
  reducer: {
    // 意思是reducer中存储着 一个名为“todos”的状态，状态是由TodosReducer返回的。
    [TODOS_FEATURE_KEY]: TodosReducer,
  },
  // 只在非生产环境下启用devTools开发工具（没有工具集要使用这个工具需要复制代码，比较复杂）
  devTools: process.env.NODE_ENV !== "production",
});
```

# 3. 用工具集配置 Provider

```js
import { Provider } from "react-redux";
import store from "./Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

# 4. 使用工具集触发 Action，获取状态。

```js
// 2.拿到dispatch之后我们还需要具体的action creator函数，来触发action，所有要导入addTodo 这个action creator函数【这个函数是自动生产的，我们只一开始只需要配置reducer】
// 4.2 TODOS_FEATURE_KEY是用于确定拿哪个颗粒度更小的store数据用的。
import { addTodo, TODOS_FEATURE_KEY } from "../../Store/index";
// 1.不使用工具集的时候一般connect方法中能拿到dispatch；现在使用工具集用useDispatch来获取dispatch方法。
// 4. 我们需要使用useSelector这钩子函数，把存储到store中的状态获取过来。
import { useDispatch, useSelector } from "react-redux";

const dispatch = useDispatch()
// 4.1 useSelector函数接收一个回调函数，回调函数被调用时会传入完整的store，然后我们按需返回要用到的store。
const todos = useSelector((state)=>{ return state[TODOS_FEATURE_KEY] })

// 3. 触发action操作如下
// 3.1 当我们调用 action creator函数传递的参数，被工具集自动传递到了，action.payload这个属性中了。
// 3.2 也就是说在reducer函数当中我们可以通过action.payload来拿到这个对象。
<button onClick={() => dispatch(addTodo({ title: "测试任务" }))}>

```
