import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Import role-specific pages
import AdminPage from "./AdminPage";
import ChefPage from "./ChefPage";
import AssistantPage from "./AssistantPage";
import TechnicienPage from "./TechnicienPage";
const b1 = import.meta.env.VITE_USER_SERVICE_URL;
const b2 = import.meta.env.VITE_PROBLEM_SERVICE_URL;
const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginUser = async () => {
    try {
      const response = await axios.post(`${b1}/login`, {
        email: formData.email,
        password: formData.password,
      });
      
      // Store user data in state & localStorage
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      
      // Redirect based on role
      switch (response.data.role) {
        case "admin":
          navigate("/admin");
          break;
        case "chef":
          navigate("/chef");
          break;
        case "assistant":
          navigate("/assistant");
          break;
        case "technicien":
          navigate("/technicien");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error.response?.data?.error || 
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
      {loginError && <div className="error-message">{loginError}</div>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track auth check status

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          
          // Optional: Verify token with backend
          const response = await axios.get(`${b1}/users/me`, {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          });
          
          setUser(response.data);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={`/${user.role}`} />
            ) : (
              <LoginPage setUser={setUser} />
            )
          }
        />

        {/* Role-Specific Pages */}
        <Route 
          path="/admin" 
          element={user ? <AdminPage user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/chef" 
          element={user ? <ChefPage user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/assistant" 
          element={user ? <AssistantPage user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/technicien" 
          element={user ? <TechnicienPage user={user} setUser={setUser} /> : <Navigate to="/" />} 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;