import { useEffect, useState } from "react";
import api from "../api";
import { clearToken, getName, clearName } from "../auth";
import { useNavigate } from "react-router-dom";
import { getToken, isTokenExpired } from "../auth";
export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);
  const navigate = useNavigate();

  const checkToken = () => {
    const token = getToken();
    if (token && isTokenExpired(token)) {
      localStorage.clear();
      navigate("/login");
    }
  };
  const fetchTodos = async () => {
    checkToken();
    try {
      const res = await api.get("/todos");
      setTodos(res.data.todos);
      setError(null);
    } catch (err) {
      setError("Failed to load todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    checkToken();
    if (!title.trim()) return;
    try {
      const res = await api.post("/todos", { title, is_completed: false });
      setTodos([res.data.todo, ...todos]);
      setTitle("");
    } catch (err) {
      setError("Failed to add todo.");
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditCompleted(todo.is_completed);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCompleted(false);
  };

  const saveEdit = async (id) => {
    checkToken();
    try {
      await api.put(`/todos/${id}`, {
        title: editTitle,
        is_completed: editCompleted,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                title: editTitle,
                is_completed: editCompleted,
              }
            : todo
        )
      );
      setEditingId(null);
      setEditTitle("");
      setEditCompleted(false);
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const toggleComplete = async (todo) => {
    checkToken();
    try {
      await api.put(`/todos/${todo.id}`, {
        title: todo.title,
        is_completed: !todo.is_completed,
      });
      setTodos(
        todos.map((t) =>
          t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
        )
      );
    } catch (err) {
      setError("Failed to update todo.");
    }
  };

  const deleteTodo = async (id) => {
    checkToken();
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo.");
    }
  };

  const logout = async () => {
    checkToken();
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearName();
      clearToken();
      navigate("/login");
    }
  };

  return (
    <div className="  flex flex-col">
      <header className=" flex mx-auto px-10 lg:px-[100px] py-4 items-center justify-between w-full">
        <div>
          <h3 className="text-2xl text-blue-500">
            {getName()[0].toUpperCase() + getName().slice(1)}
          </h3>
        </div>
        <div className=" flex justify-end">
          <button
            onClick={logout}
            className="text-gray-700 hover:text-blue-500 px-4 py-2 rounded-lg transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            My Todo List
          </h2>

          <div className="flex gap-3 mb-8">
            <input
              type="text"
              className="flex-1 p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg transition text-lg"
              onClick={addTodo}
            >
              Add Todo
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center py-3 text-lg">{error}</p>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Loading todos...</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {todos.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-lg">
                  Your todo list is empty. Add a task above!
                </p>
              ) : (
                todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="group flex items-center p-5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    {editingId === todo.id ? (
                      // Edit mode
                      <div className="flex-1 flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={editCompleted}
                          onChange={(e) => setEditCompleted(e.target.checked)}
                          className="h-6 w-6 rounded border-gray-300 text-blue-500 focus:ring-blue-400 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveEdit(todo.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          autoFocus
                          className="flex-1 p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded transition text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="checkbox"
                          checked={todo.is_completed}
                          onChange={() => toggleComplete(todo)}
                          className="h-6 w-6 rounded border-gray-300 text-blue-500 focus:ring-blue-400 mr-4 cursor-pointer"
                        />

                        <div
                          className={`flex-1 text-lg ${
                            todo.is_completed
                              ? "line-through text-gray-400"
                              : "text-gray-700"
                          }`}
                          onDoubleClick={() => startEditing(todo)}
                        >
                          {todo.title}
                        </div>

                        <div className="flex gap-4 ml-4">
                          <button
                            onClick={() => startEditing(todo)}
                            className="text-gray-500 hover:text-blue-500 transition p-2"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTodo(todo.id);
                            }}
                            className="text-gray-500 hover:text-red-500 transition p-2"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
