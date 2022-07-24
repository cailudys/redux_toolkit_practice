function Main() {
  return (
    <section className="main">
      <button>添加任务</button>
      <ul className="todo-list">
        <li className="completed">
          <div className="view">
            <input className="toggle" type="checkbox" />
            <label>Taste JavaScript</label>
            <button className="destory" />
          </div>
          <input className="edit" />
        </li>
        <li className="view">
          <div className="view">
            <input className="toggle" type="checkbox" />
            <label>Buy a unicorn</label>
            <button className="destory" />
          </div>
          <input className="edit" />
        </li>
        <li></li>
      </ul>
    </section>
  );
}
