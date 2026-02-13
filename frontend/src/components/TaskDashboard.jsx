import { useState } from "react";

// Empty task template for form
const emptyTask = { title: "", description: "", status: "todo" };

/**
 * TaskDashboard component
 * Displays user info, task creation form, and task list
 * Admin users also see a summary of tasks by status
 */
const TaskDashboard = ({ user, tasks, summary, onCreate, onUpdate, onDelete, onLogout, loading }) => {
  const [form, setForm] = useState(emptyTask);

  // Update specific form field
  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Submit new task and reset form
  const submit = (event) => {
    event.preventDefault();
    onCreate(form);
    setForm(emptyTask);
  };

  return (
    <div className="dashboard">
      {/* Header with user info and logout */}
      <div className="dashboard-header">
        <div>
          <h2>Task board</h2>
          <p>{user.name} · {user.role}</p>
        </div>
        <button className="ghost" onClick={onLogout}>Logout</button>
      </div>
      
      <div className="grid">
        {/* Task creation form */}
        <form className="panel" onSubmit={submit}>
          <h3>Create task</h3>
          <div className="stack">
            <input type="text" placeholder="Title" value={form.title} onChange={updateField("title")} required />
            <textarea placeholder="Description" value={form.description} onChange={updateField("description")} rows={4} />
            <select value={form.status} onChange={updateField("status")}>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add task"}
            </button>
          </div>
        </form>
        
        {/* Task list with optional admin summary */}
        <div className="panel">
          <h3>Tasks</h3>
          
          {/* Admin-only: Task summary by status */}
          {user.role === "admin" && summary.length > 0 && (
            <div className="summary">
              {summary.map((item) => (
                <div className="summary-card" key={item.status}>
                  <span>{item.status.replace("_", " ")}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          )}
          
          {/* Task list */}
          <div className="task-list">
            {tasks.length === 0 && <p className="muted">No tasks yet.</p>}
            {tasks.map((task, index) => (
              <div className="task-card" style={{ animationDelay: `${index * 0.05}s` }} key={task._id}>
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description || "No description"}</p>
                </div>
                <div className="task-actions">
                  {/* Status dropdown for quick updates */}
                  <select
                    value={task.status}
                    onChange={(event) => onUpdate(task._id, { status: event.target.value })}
                  >
                    <option value="todo">To do</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="danger" onClick={() => onDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
