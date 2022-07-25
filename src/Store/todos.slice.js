import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const TODOS_FEATURE_KEY = "todos";

// 这是一个异步的 action creator 函数；要触发这个对应的anction，只需要 dispatch（此函数名）；
export const loadTodos = createAsyncThunk("todos/loadTodos", (payload) =>
  axios.get(payload).then((response) => response.data)
);

// 拿到reducer函数 和 action creator函数。
const { reducer: TodosReducer, actions } = createSlice({
  name: "TODOS_FEATURE_KEY",
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (todo) => {
        console.log(todo);
        return {
          payload: { ...todo, id: Math.random() },
        };
      },
    },
    setTodos: (state, action) => {
      action.payload.forEach((todo) => state.push(todo));
    },
  },
  extraReducers: {
    [loadTodos.pending]: (state, action) => {
      console.log("pending");
      return state;
    },
    [loadTodos.fulfilled]: (state, action) => {
      console.log("fulfilled");
      action.payload.forEach((todo) => state.push(todo));
    },
  },
});

export const { addTodo, setTodos } = actions;
export default TodosReducer;
