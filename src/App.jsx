import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ViewAttendance from "./pages/ViewAttendance";
import AdminPanel from "./pages/AdminPanel";
import AddStudent from "./pages/AddStudent";
import { useUser } from "./lib/context/user";
import "./styles/index.css";

export default function App() {
  const { user, logout } = useUser();

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">📚 AttendanceDAS</div>
          <div className="nav-links">
            <Link to="/">View Attendance</Link>
            {user ? (
              <>
                <Link to="/admin">Admin Panel</Link>
                <button onClick={logout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login">Admin Login</Link>
            )}
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<ViewAttendance />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Login />} />
        <Route path="/add-student" element={user ? <AddStudent /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}