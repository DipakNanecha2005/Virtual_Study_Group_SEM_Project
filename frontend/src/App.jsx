import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./RegistrationForm/regs";
import Login from "./LoginForm/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChatPage from "./pages/chatPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
            />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
