import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Chat from "./pages/chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/chat"
          element={
            <Chat
              userId="6802927eafcfdfdfa12d0e3b"
              chatId="680723cfd3d05fa9d2126e25"
              username="dipak"
              avatarUrl="https://avatar.iran.liara.run/public/boy?username=dipak"
            />
          }
        ></Route>
        <Route path="*" element={<Navigate to="/chat" />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
