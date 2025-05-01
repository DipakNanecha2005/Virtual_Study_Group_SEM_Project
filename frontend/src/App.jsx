import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './RegistrationForm/regs'
import Login from "./LoginForm/login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ChatPage from "./pages/chatPage";
import Navbar from './pages/Navbar' // Import Navbar if you want it to be visible on all pages
import Main from "./pages/Main";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
                <Login />
            }
          />
          <Route
            path="/register"
            element={
                <Signup />
            }
          />
          <Route
            path="/"
            element={
                <Dashboard />
            }
          />
          <Route
            path="/chat"
            element={
                <Main />
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;