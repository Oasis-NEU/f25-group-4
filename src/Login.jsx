import { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/Profile";
import CalendarPage from "./pages/Calendar"
import "./App.css";
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restore login from localStorage (remember me)
  useEffect(() => {
    const saved = localStorage.getItem("healthyPaws_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  function login(email, password, remember) {
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && password.length >= 6;
    if (!ok) throw new Error("Enter a valid email and 6+ character password.");
    const u = { email };
    setUser(u);
    if (remember) localStorage.setItem("healthyPaws_user", JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("healthyPaws_user");
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}


import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}



import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function HomePage() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    try {
      login(email, pwd, remember);
      setErr("");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={page}>
      {/* Header */}
      <header style={header}>
        <h1 style={{ margin: 0 }}>🐾 Healthy Paws</h1>
        {user ? (
          <div>
            Signed in as <strong>{user.email}</strong>{" "}
            <button onClick={logout} style={linkBtn}>
              Log out
            </button>
          </div>
        ) : (
          <div>Welcome!</div>
        )}
      </header>

      {/* Main Content */}
      <main style={main}>
        {/* Info Section */}
        <section style={card}>
          <h2>About Healthy Paws</h2>
          <p>
            Healthy Paws is your one-stop app for tracking your pet’s weight,
            meals, and daily activity. Stay on top of your furry friend’s
            health journey with easy-to-use tools.
          </p>
          <ul>
            <li>Monitor progress toward a healthy weight</li>
            <li>Record meals, treats, and calories</li>
            <li>Track walks, playtime, and exercise</li>
          </ul>

          <nav style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/menu" style={navBtn}>
              Go to Menu
            </Link>
            <Link to="/profile" style={navBtn}>
              Go to Profile
            </Link>
          </nav>

          <p style={{ marginTop: 8, color: "#64748b", fontSize: 14 }}>
            (You must be logged in to access these pages.)
          </p>
        </section>

        {/* Login Panel */}
        <aside style={card}>
          <h3>{user ? "You’re signed in" : "Sign in"}</h3>
          {!user ? (
            <form onSubmit={handleLogin} style={{ display: "grid", gap: 10, marginTop: 8 }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={input}
              />
              <input
                type="password"
                placeholder="Password (6+ chars)"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                minLength={8}
                style={input}
              />
              <label style={{ fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Remember me
              </label>
              {err && <p style={{ color: "crimson", fontSize: 13 }}>{err}</p>}
              <button style={primaryBtn}>Login</button>
            </form>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              <p>You can now open Menu and Profile.</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Link to="/menu" style={navBtn}>
                  Open Menu
                </Link>
                <Link to="/profile" style={navBtn}>
                  Open Profile
                </Link>
              </div>
              <button onClick={logout} style={linkBtn}>
                Log out
              </button>
            </div>
          )}
        </aside>
      </main>

      <footer style={footer}>© {new Date().getFullYear()} Healthy Paws</footer>
    </div>
  );
}

/* Styles */
const page = { fontFamily: "system-ui,Segoe UI,Arial", color: "#0f172a", minHeight: "100vh", background: "#f8fafc" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#fff", borderBottom: "1px solid #e2e8f0" };
const main = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, maxWidth: 1000, margin: "20px auto", padding: "0 16px" };
const card = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" };
const footer = { textAlign: "center", padding: "20px 0", color: "#64748b" };
const input = { padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 10, width: "100%" };
const primaryBtn = { padding: "10px 14px", borderRadius: 10, background: "#0f172a", color: "#fff", border: "none", cursor: "pointer" };
const navBtn = { padding: "8px 12px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", textDecoration: "none", color: "#0f172a", fontWeight: 600 };
const linkBtn = { background: "none", border: "none", color: "#0f172a", textDecoration: "underline", cursor: "pointer", padding: 0 };


import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import MenuPage from "./MenuPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { AuthProvider } from "./AuthContext.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/menu", element: <ProtectedRoute><MenuPage /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

