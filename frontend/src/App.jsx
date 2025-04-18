import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Regs from "./RegistrationForm/regs";
import NavBar from "./Elements/navBar";
import Footer from "./Elements/footer";
import Login from "./LoginForm/login";
import ChatBetweenTwo from "./Chat/dm";
import EditProfile from "./userProfile/userProfile";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Regs />} />
          <Route path="/dm" element={<ChatBetweenTwo chatId="some-chat-id" currentUser="user-id" />} />
          <Route path="/profile" element={<EditProfile/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
