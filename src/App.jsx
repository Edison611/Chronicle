import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Input from "./components/input";
import CharacterPerspective from "./components/CharacterPerspective";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Input />} />
        <Route path="/character-perspective/:storyName/:characterName/:eventPage" element={<CharacterPerspective />} />
      </Routes>
    </Router>
  );
}

export default App;
