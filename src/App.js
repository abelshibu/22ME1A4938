import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import URLShortener from "./components/URLShortener";
import Analytics from "./components/Analytics";
import Redirector from "./components/Redirector";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLShortener />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/:shortcode" element={<Redirector />} />
      </Routes>
    </Router>
  );
};

export default App;
