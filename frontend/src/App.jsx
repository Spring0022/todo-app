import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  // 1. 【Read】最初にデータを取ってくる
  useEffect(() => {
    fetch(`${API_BASE}/api/todos`)
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  // 2. 【Create】追加ボタン
  const addTodo = async () => {
    if (input.trim() === "") {
      setError("タスクを入力してください");
      return; // ← ここで処理を止める
    }
    setError(""); // エラーをリセット
    const res = await fetch(`${API_BASE}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setInput("");
  };

  // 3. 【Delete】削除ボタン
  const deleteTodo = async (id) => {
    await fetch(`${API_BASE}/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  // 編集
  const updateTodo = async (id) => {
    await fetch(`${API_BASE}/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editingText }),
    });
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText } : todo,
      ),
    );
    setEditingId(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Todo App</h1>
      </div>

      <div className="input-area">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力"
        />
        <button className="btn btn-add" onClick={addTodo}>
          追加
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-card">
            {editingId === todo.id ? (
              <div className="todo-edit">
                <input
                  className="input"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button
                  className="btn btn-save"
                  onClick={() => updateTodo(todo.id)}
                >
                  保存
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => setEditingId(null)}
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="todo-content">
                <span className="todo-text">{todo.text}</span>
                <div className="todo-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditingId(todo.id);
                      setEditingText(todo.text);
                    }}
                  >
                    編集
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
