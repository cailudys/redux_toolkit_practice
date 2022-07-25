// 2.拿到dispatch之后我们还需要具体的action creator函数，来触发action，所有要导入addTodo 这个action creator函数【这个函数是自动生产的，我们只一开始只需要配置reducer】
import { addTodo, loadTodos, selectTodos } from "../../Store/todos.slice";
// 1.不使用工具集的时候一般connect方法中能拿到dispatch；现在使用工具集用useDispatch来获取dispatch方法。
// 4. 我们需要使用useSelector这钩子函数，把存储到store中的状态获取过来。
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function Main() {
  const dispatch = useDispatch();
  // useSelector函数接收一个回调函数，回调函数被调用时会传入完整的store，然后我们按需返回要用到的store。
  const todos = useSelector(selectTodos);
  // 组件挂载完成的时候调用获取任务列表的操作。
  useEffect(() => {
    dispatch(loadTodos("http://localhost:3001/todos"));
    //effect
    return () => {
      // clear
    };
  }, []);
  return (
    <section className="main">
      <button onClick={() => dispatch(addTodo({ title: "测试任务" }))}>
        添加任务
      </button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="completed" key={todo.cid}>
            <div className="view">
              <input className="toggle" type="checkbox" />
              <label>{todo.title}</label>
              <button className="destory" />
            </div>
            <input className="edit" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Main;
