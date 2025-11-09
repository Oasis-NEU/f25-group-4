// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/Profile";
import CalendarPage from "./pages/Calendar"
import MenuPage from "./pages/menu";
import "./App.css";

function Home() {
  return <h1 className="home-welcome">Welcome Home!</h1>;
}

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

