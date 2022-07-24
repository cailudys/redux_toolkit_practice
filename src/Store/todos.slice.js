import { createSlice } from "@reduxjs/toolkit";

export const TODOS_FEATURE_KEY = "todos";

// 拿到reducer函数 和 action creator函数。
const { reducer: TodosReducer, actions } = createSlice({
  name: "TODOS_FEATURE_KEY",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { addTodo } = actions;
export default TodosReducer;
