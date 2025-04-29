import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./RegistrationForm/regs";
import Login from "./LoginForm/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChatPage from "./pages/chatPage";
import ChatProvider from './context/ChatProvider'; // Import ChatProvider

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
          {/* Only wrap ChatPage with ChatProvider */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatProvider>  {/* Wrap only ChatPage with ChatProvider */}
                  <ChatPage />
                </ChatProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
