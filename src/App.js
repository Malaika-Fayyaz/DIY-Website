import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Feed from "./components/Feed";
import ProjectDetail from "./components/ProjectDetail";
import CreateProject from "./components/CreateProject";
import EditProject from "./components/EditProject";
import SavedProjects from "./components/SavedProjects";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/create" element={<CreateProject />} />
          <Route path="/edit/:projectId" element={<EditProject />} />
          <Route path="/saved" element={<SavedProjects />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
