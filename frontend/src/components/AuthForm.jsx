import { useState } from "react";

// Initial form state with all fields
const initialState = {
  name: "",
  email: "",
  password: "",
  role: "user"
};

/**
 * AuthForm component handles user registration and login
 * Toggles between login and register modes
 */
const AuthForm = ({ onAuth, loading }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);

  // Update specific form field
  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Submit form (login or register)
  const submit = (event) => {
    event.preventDefault();
    onAuth(mode, form);
  };

  // Toggle between login and register modes
  const toggle = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <div className="auth-container">
      <div className="panel">
        <div className="panel-header">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p>Use email + password to continue.</p>
        </div>
        <form className="stack" onSubmit={submit}>
          {/* Show name field only in register mode */}
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={update("name")}
              required
            />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={update("email")} required />
          <input
            type="password"
            placeholder="Password (min 8 chars)"
            value={form.password}
            onChange={update("password")}
            required
          />
          {/* Show role selector only in register mode */}
          {mode === "register" && (
            <select value={form.role} onChange={update("role")}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Working..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
      {/* Toggle button to switch between login and register */}
      <button className="ghost" type="button" onClick={toggle}>
        {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
};

export default AuthForm;
