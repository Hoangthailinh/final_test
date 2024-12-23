import React, { useState, useMemo } from "react";
import "./App.css";

const Task = React.memo(
  ({ task, toggleTaskStatus, deleteTask, currentTab }) => {
    return (
      <li className={task.active ? "" : "completed"} key={task.id}>
        <label>
          <input
            type="checkbox"
            checked={!task.active}
            onChange={() => toggleTaskStatus(task.id)}
          />
          {task.name}
        </label>
        {currentTab === "Completed" && (
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        )}
      </li>
    );
  }
);

const App = () => {
  const [tasks, setTasks] = useState([]); // Danh sách task
  const [currentTab, setCurrentTab] = useState("All"); // Tab hiện tại
  const [inputValue, setInputValue] = useState(""); // Giá trị input

  // Hàm thêm task
  const addTask = () => {
    if (inputValue.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), name: inputValue, active: true },
      ]);
      setInputValue(""); // Reset input
    }
  };

  // Hàm đổi trạng thái active <-> completed
  const toggleTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, active: !task.active } : task
      )
    );
  };

  // Hàm xóa 1 task
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Hàm xóa tất cả các task đã hoàn thành
  const deleteAllCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.active));
  };

  // Lọc task theo tab hiện tại (memoized để tối ưu hiệu suất)
  const filteredTasks = useMemo(() => {
    if (currentTab === "All") return tasks;
    if (currentTab === "Active") return tasks.filter((task) => task.active);
    return tasks.filter((task) => !task.active);
  }, [tasks, currentTab]);

  return (
    <div className="todo-app">
      <h1>#todo</h1>
      {/* Tabs */}
      <div className="tabs">
        <button
          className={currentTab === "All" ? "active-tab" : ""}
          onClick={() => setCurrentTab("All")}
        >
          All
        </button>
        <button
          className={currentTab === "Active" ? "active-tab" : ""}
          onClick={() => setCurrentTab("Active")}
        >
          Active
        </button>
        <button
          className={currentTab === "Completed" ? "active-tab" : ""}
          onClick={() => setCurrentTab("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Input để thêm task */}
      {(currentTab === "All" || currentTab === "Active") && (
        <div className="task-input">
          <input
            type="text"
            name="task"
            placeholder="Add details"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>
      )}

      {/* Danh sách task */}
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
            currentTab={currentTab}
          />
        ))}
      </ul>

      {/* Nút xóa tất cả trong Completed */}
      {currentTab === "Completed" && tasks.some((task) => !task.active) && (
        <button className="delete-all" onClick={deleteAllCompleted}>
          Delete All
        </button>
      )}
    </div>
  );
};

export default App;
