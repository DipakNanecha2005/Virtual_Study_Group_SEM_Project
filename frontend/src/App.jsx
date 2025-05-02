import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './RegistrationForm/regs'
import Login from "./LoginForm/login";
import Dashboard from "./pages/Dashboard";

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
                <Main/>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;