import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NavBar from "./Elements/navBar";
import Footer from "./Elements/footer";
// import ChatBetweenTwo from "./Chat/dm";
// import EditProfile from "./userProfile/userProfile";
import Signup from "./RegistrationForm/regs";
import Login from "./LoginForm/login";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./Chat/ChatPage";
import Messages from "./pages/Messages";
function App() {
  return (
    <Router>
      <div className="App">
        {/* <NavBar /> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/messages" element={<Messages/>}/>
          {/* <Route path="/dm" element={<ChatBetweenTwo chatId="some-chat-id" currentUser="user-id" />} /> */}
          {/* <Route path="/profile" element={<EditProfile/>} /> */}
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;