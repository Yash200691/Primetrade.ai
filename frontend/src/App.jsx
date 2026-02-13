import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm.jsx";
import TaskDashboard from "./components/TaskDashboard.jsx";
import { request } from "./api/client.js";

// Empty message state
const initialMessage = { type: "", text: "" };

/**
 * Main App component
 * Manages authentication state, task data, and all API interactions
 * Shows AuthForm when logged out, TaskDashboard when logged in
 */
const App = () => {
  // Authentication state - persisted in localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Application data
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState([]); // Admin-only task summary
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialMessage); // Toast notifications

  /**
   * Display a temporary toast message
   * @param {string} type - 'success' or 'error'
   * @param {string} text - Message content
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(initialMessage), 4000);
  };

  /**
   * Load user's tasks from API
   * @param {string} activeToken - JWT token to use for request
   */
  const loadTasks = async (activeToken = token) => {
    if (!activeToken) return;
    const data = await request("/tasks", { token: activeToken });
    setTasks(data.tasks || []);
  };

  /**
   * Load admin task summary (only for admin users)
   * @param {string} activeToken - JWT token to use for request
   * @param {Object} activeUser - User object to check role
   */
  const loadSummary = async (activeToken = token, activeUser = user) => {
    if (!activeToken || !activeUser || activeUser.role !== "admin") return;
    const data = await request("/tasks/admin/summary", { token: activeToken });
    setSummary(data.summary || []);
  };

  /**
   * Handle user authentication (login or register)
   * @param {string} mode - 'login' or 'register'
   * @param {Object} form - Form data with email, password, name, role
   */
  const handleAuth = async (mode, form) => {
    setLoading(true);
    try {
      // For login, only send email and password
      const body = mode === "login" ? { email: form.email, password: form.password } : form;
      const data = await request(`/auth/${mode}`, { method: "POST", body });
      
      // Save auth state to localStorage and state
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      showMessage("success", mode === "login" ? "Logged in" : "Registered");
      
      // Load user data
      await loadTasks(data.token);
      await loadSummary(data.token, data.user);
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new task
   * @param {Object} payload - Task data (title, description, status)
   */
  const handleCreate = async (payload) => {
    setLoading(true);
    try {
      await request("/tasks", { method: "POST", body: payload, token });
      showMessage("success", "Task created");
      await loadTasks();
      await loadSummary();
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} payload - Updated task fields
   */
  const handleUpdate = async (id, payload) => {
    try {
      await request(`/tasks/${id}`, { method: "PUT", body: payload, token });
      showMessage("success", "Task updated");
      await loadTasks();
      await loadSummary();
    } catch (error) {
      showMessage("error", error.message);
    }
  };

  /**
   * Delete a task
   * @param {string} id - Task ID to delete
   */
  const handleDelete = async (id) => {
    try {
      await request(`/tasks/${id}`, { method: "DELETE", token });
      showMessage("success", "Task deleted");
      await loadTasks();
      await loadSummary();
    } catch (error) {
      showMessage("error", error.message);
    }
  };

  /**
   * Log out user and clear all state
   */
  const handleLogout = () => {
    setToken("");
    setUser(null);
    setTasks([]);
    setSummary([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Load tasks on mount if user is already logged in
  useEffect(() => {
    if (token) {
      loadTasks();
      loadSummary();
    }
  }, []);

  return (
    <div className="app">
      {/* Hero section */}
      <div className="hero">
        <h1>PrimeTrade Task Hub</h1>
        <p>Secure REST API with role-based access and Redis caching.</p>
      </div>

      {/* Toast notification */}
      {message.text && (
        <div className={`toast ${message.type}`}>{message.text}</div>
      )}

      {/* Show auth form or dashboard based on login state */}
      {!token || !user ? (
        <AuthForm onAuth={handleAuth} loading={loading} />
      ) : (
        <TaskDashboard
          user={user}
          tasks={tasks}
          summary={summary}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onLogout={handleLogout}
          loading={loading}
        />
      )}
    </div>
  );
};

export default App;
