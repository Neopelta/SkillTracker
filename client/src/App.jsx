// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Template, AdminRoute } from "./components";
import { Home, Login, SkillsPage, StudentProfile, NotFound, ConnectedUserAdmin } from "./pages";
import "./App.css";

function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/:discordId" element={<StudentProfile />} />
          <Route 
            path="/admin/connected-users" 
            element={
              <AdminRoute>
                <ConnectedUserAdmin />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
