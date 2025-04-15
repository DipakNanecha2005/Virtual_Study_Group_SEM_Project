import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Regs from "./RegistrationForm/regs";
import NavBar from "./Elements/navBar";
import Footer from "./Elements/footer";
import Login from "./LoginForm/login";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Regs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;