import { createSlice } from "@reduxjs/toolkit";

export const TODOS_FEATURE_KEY = "todos";

// 拿到reducer函数 和 action creator函数。
const { reducer: TodosReducer, actions } = createSlice({
  name: "TODOS_FEATURE_KEY",
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        console.log(action);
        state.push(action.payload);
      },
      prepare: (todo) => {
        console.log(todo);
        return {
          payload: { ...todo, id: Math.random() },
        };
      },
    },
  },
});

export const { addTodo } = actions;
export default TodosReducer;
