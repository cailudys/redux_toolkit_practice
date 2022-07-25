import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

// 3. 创建一个数据适配器
const todosAdapter = createEntityAdapter({
  selectId: (data) => data.cid,
});

const { selectAll } = todosAdapter.getSelectors();

// console.log(todosAdapter.getInitialState());

export const TODOS_FEATURE_KEY = "todos";

// 2.创建一个异步的 action creator 函数；要触发这个对应的anction，只需要 dispatch（此函数名）；
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) =>
  axios.get(payload).then((response) => response.data)
);

// 1.创建 切片  拿到reducer函数 和 action creator函数。
const { reducer: TodosReducer, actions } = createSlice({
  name: "TODOS_FEATURE_KEY",
  initialState: todosAdapter.getInitialState(),
  reducers: {
    addTodo: {
      reducer: todosAdapter.addOne,
      prepare: (todo) => {
        console.log(todo);
        return {
          payload: { ...todo, cid: Math.random() },
        };
      },
    },
    setTodos: (state, action) => {
      todosAdapter.addMany(state, action.payload);
      // action.payload.forEach((todo) => state.push(todo));
    },
  },
  extraReducers: {
    [loadTodos.pending]: (state, action) => {
      console.log("pending");
      // return state;
    },
    [loadTodos.fulfilled]: (state, action) => {
      console.log("fulfilled");
      todosAdapter.addMany(state, action.payload);
      // action.payload.forEach((todo) => state.push(todo));
    },
  },
});

// 4. 创建状态选择器，用于选取我们需要的数据
export const selectTodos = createSelector(
  (state) => state[TODOS_FEATURE_KEY],
  selectAll
);

export const { addTodo, setTodos } = actions;
export default TodosReducer;
