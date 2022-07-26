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

# 5. Action 预处理（允许我们在 reducer 接收到 action 对象之前，对 action 进行预处理。）

```js
const { reudcer: TodosReducer, actions } = createSlice({
  name: TODOS_FEATURE_KEY,
  initialState: [],
  reducers: {
    // 结构稍微改动了
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      // action 预处理，这里的todo是我们调用addTodo时传递的参数
      // prepare方法要求返回一个对象，对象里要有payload属性。redux会使用这个payload属性去覆盖action原有的payload属性。
      prepare: (todo) => {
        return { payload: { ...todo, title: "haha" } };
      },
    },
  },
});
```

# 6. 工具集中 执行异步操作 （方式一）

之前我们做异步操作，要借助 redux-thunk 或者 reudx-saga 这样的中间件。在 redux toolkit 中已经内置了 被进一步封装好的 thunk 中间件。

## 1. 创建执行异步操作的 Action creator 函数。

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loadTodos = createAsyncThunk(
  // createAsyncThunk第一个参数是action.type对应的标识，是一个字符串。dispatch触发的是函数名loadTodos，而不是这里的字符串。
  "todos/loadTodos",
  // 第二个参数是个回调函数，当触发当前这个Action是会调用这个函数。
  // 回调函数的第一个参数就是触发此action时传递的参数。
  // 回调函数的第二个参数是个对象，里面存放着thunk的一些API (如 dispatch)
  (payload, thunkAPI) => {
    axios.get(payload).then((response) => {
      thunkAPI.dispatch(setTodos(response.data));
    });
  }
);
```

## 2. 创建接收异步操作结果的 Reducer

```js
const { reducer: TodosReducer, actions } = createSlice({
  reducers: {
    setTodos: (state, action) => {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
});
```

# 7. 工具集中 执行异步操作 （方式二）

## 1. 创建执行异步操作的 Action creator 函数

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 第一种方式是在loadTodos里再触发一个同步action，来改变状态
// 当前方式二中是直接返回一个结构，让 另一个特殊的reducer去接收？
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) => {
  return axios.get(payload).then((response) => response.data);
});
```

## 2. 创建接收异步操作结构(promise)的 Reducer

```js
createSlice({
  // reducers中接收的是同步的action，extraReducers中接收的是异步action。
  extraReducers: {
    // 指的是当loadTodos异步anction执行完成的（fulfilled）时候，执行后面的函数
    [loadTodos.fulfilled]: (state, action) => {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
});
```

# 8. 工具集中 配置中间件

需要先安装 reudx-logger 插件

## 1. 配置 logger 中间件

```js
import logger from "redux-logger";

export default configureStore({
  reducer: {
    [TODOS_FEATURE_KEY]: TodosReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
```

# 9. 配置实体适配器

实体适配器：可以理解为一个容器， 是放入状态（数据）的容器。

问：为什么要把状态放到实体适配器中呢？  
答：因为实体适配器会给我们提供许多操作状态的方法，简化我们对状态的增删改查的操作。

```js
import { createEntityAdapter } from "@reduxjs/toolkit";

const todosAdapter = createEntityAdapter();
// 返回值是一个JavaScript对象  { ids:[], entities:{  } }
todosAdapter.getInitialState();
todosAdapter.addOne();
todosAdapter.addMany();
```

```js
// 用了实体适配器之后，要如下获取数据，获取的数据是一个对象
const todos = useSelector((state) => state[TODOS_FEATURE_KEY].entities);

// 遍历这个对象的方法如下
Object.values(todos).map(() => {});
```

# 10. 简化书写实体适配器的代码

```js
reducer: (state, action) => {
  // 向 state 中 添加一条数据，数据值是 action.payload
  todosAdapter.addOne(state, action.payload);
},
// ===> 简化
// 插件会自动把 state 和 action 给到 addOne这个函数；第二个方法会自动检查传递给它的第二个参数是否是action
// 如果是action它会直接把action.payload 防止到第一个state 参数中。
reducer: todosAdapter.addOne
```

# 11. 将实体的其他属性作为实体的唯一标识

实体适配器要求每一个实体(数据)，都要求每一个实体拥有 id 属性（默认要求，没有的话列表只渲染一个）作为唯一标识;如果实体中的唯一标识字段不叫做 id，则需要用 selectId 进行申明。

```js
// 创建实体适配器的时候可以传一个配置对象，来确定唯一标识的属性值, data 是一个形参，指的是实体。
const Adapter = createEntityAdapter({ selectId: (data) => data.id });
```

# 11. 状态选择器 （提供从实体适配器中获取状态的快捷途径）

是解决下面获取状态和使用状态，代码书写比较麻烦的问题。

```js
// 用了实体适配器之后，要如下获取数据，获取的数据是一个对象
const todos = useSelector((state) => state[TODOS_FEATURE_KEY].entities);

// 遍历这个对象的方法如下
Object.values(todos).map(() => {});
```

## 创建状态选择器

```js
// createSelector函数能 返回给我们一个状态选择器，把这个状态选择器传入useSelector就能拿到选择的数据
import { createSelector } from "@reduxjs/toolkit";

// 实体适配器会给我们返回一些获取状态的方法
const { selectAll } = todosAdapter.getSelectors();

// 当前createSelector函数返回的是一个 数组
export const selectTodosList = createSelector(
  // 回调函数的 state 形参指的就是store里的整个状态
  // 下面代码是从store里面拿到todos的状态
  (state) => state[TODOS_FEATURE_KEY],
  // 作用是从实体适配器中选择所有的实体，并放到一个数组中返回
  selectAll
);
```

## 使用状态选择器

```js
import { useSelector } from "react-redux";
import { selectTodos } from "./todos.slice";
```
