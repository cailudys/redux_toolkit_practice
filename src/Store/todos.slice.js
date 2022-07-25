import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

const todosAdapter = createEntityAdapter({
  selectId: (data) => data.cid,
});

// console.log(todosAdapter.getInitialState());

export const TODOS_FEATURE_KEY = "todos";

// 这是一个异步的 action creator 函数；要触发这个对应的anction，只需要 dispatch（此函数名）；
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) =>
  axios.get(payload).then((response) => response.data)
);

// 拿到reducer函数 和 action creator函数。
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

export const { addTodo, setTodos } = actions;
export default TodosReducer;
