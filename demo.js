# 11. 状态选择器 （提供从实体适配器中获取状态的快捷途径）
是解决下面
```js
// 用了实体适配器之后，要如下获取数据，获取的数据是一个对象
const todos = useSelector((state) => state[TODOS_FEATURE_KEY].entities);

// 遍历这个对象的方法如下
Object.values(todos).map(() => {});
```

import { createSelector } from "@reduxjs/toolkit";

const { selectAll } = todosAdapter.getSelectors();

export const sle
